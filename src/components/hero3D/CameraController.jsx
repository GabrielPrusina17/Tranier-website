/* eslint-disable react-hooks/immutability --
   OrbitControls i kamera su three.js objekti; mijenjanje im je jedini
   način rada i nema veze s React stateom. */
import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// === REGULATOR VELIČINE ===
// Na desktopu model namjerno manji — ima prostora oko sebe;
// na mobitelu je veći jer tamo širina ruku ionako diktira kadar.
const HOME_FILL_DESKTOP = 0.78;   // koliki dio kadra model zauzima u mirovanju
const HOME_FILL_MOBILE = 0.92;
const ARM_FIT = 0.8;              // koliki dio raspona ruku mora stati u širinu

const FALLBACK = { height: 1.75, width: 1.75, centerY: -0.025 };

// udaljenost na kojoj model stane i po visini i po širini
function homeView(camera, bounds) {
  const b = bounds ?? FALLBACK;
  const wide = window.innerWidth > 760;
  const fill = wide ? HOME_FILL_DESKTOP : HOME_FILL_MOBILE;

  const half = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
  const aspect = camera.aspect || window.innerWidth / window.innerHeight;

  const distH = b.height / fill / (2 * half);
  const distW = (b.width * ARM_FIT) / fill / (2 * half * aspect);

  return {
    pos: new THREE.Vector3(0, b.centerY + b.height * 0.06, Math.max(distH, distW)),
    tgt: new THREE.Vector3(0, b.centerY, 0),
  };
}

export default function CameraController({ focus, bounds, enabled = true }) {
  const controls = useRef();
  const { camera } = useThree();
  const goalPos = useRef(new THREE.Vector3(0, 0, 3.5));
  const goalTgt = useRef(new THREE.Vector3(0, 0, 0));
  const moving = useRef(true);

  useEffect(() => {
    if (focus) {
      const wide = window.innerWidth > 760;
      const aspect = window.innerWidth / window.innerHeight;

      // udaljenost tako da zona zauzme ~36% visine kadra (32% na mobitelu)
      // manji broj = kamera dalje = više konteksta oko mišića
      // zone koje nisu na osi tijela (ruke, noge) trebaju širi kadar, inače
      // im tijelo pojede pola slike i mišić završi na rubu
      const offAxis = Math.abs(focus.center.x) > 0.12;
      const fill = (wide ? 0.36 : 0.32) * (offAxis ? 0.7 : 1);

      let dist = focus.radius / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) / fill;
      if (aspect < 1) dist /= Math.max(aspect, 0.55);
      // donja granica vezana za visinu modela — inače kamera kod tankih zona
      // (triceps, list) uđe u samu ruku/nogu
      const minDist = (bounds?.height ?? 1.75) * 0.5;
      dist = THREE.MathUtils.clamp(dist, minDist, 6);

      // prednje skupine gledamo sprijeda, stražnje straga, bočne pod kutom
      const dir = new THREE.Vector3(0, 0, focus.side === -1 ? -1 : 1);
      if (focus.side === 0) dir.set(0.5, 0, 0.86).normalize();

      goalTgt.current.copy(focus.center);
      goalPos.current.copy(focus.center).addScaledVector(dir, dist);

      const up = new THREE.Vector3(0, 1, 0);
      if (wide) {
        // desktop: pomakni mišić lijevo da ne završi ispod VideoCard-a.
        // Zone izvan osi tijela (ruke, noge) ne pomičemo — njih bi pomak
        // izbacio iz kadra jer su ionako već sa strane.
        if (!offAxis) {
          const right = new THREE.Vector3().crossVectors(dir, up).normalize();
          goalPos.current.addScaledVector(right, -dist * 0.17);
          goalTgt.current.addScaledVector(right, -dist * 0.17);
        }
      } else {
        // mobitel: podigni model iznad kartice
        goalPos.current.addScaledVector(up, -dist * 0.22);
        goalTgt.current.addScaledVector(up, -dist * 0.22);
      }
    } else {
      const home = homeView(camera, bounds);
      goalPos.current.copy(home.pos);
      goalTgt.current.copy(home.tgt);
    }
    moving.current = true;
  }, [focus, bounds, camera]);

  // rotacija telefona / resize prozora
  useEffect(() => {
    const onResize = () => {
      if (focus) return;                 // dok je zona aktivna, kadar drži zona
      goalPos.current.copy(homeView(camera, bounds).pos);
      moving.current = true;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [focus, bounds, camera]);

  useFrame((_, delta) => {
    if (!moving.current) return;
    const c = controls.current;

    // Dok kamera leti, OrbitControls MORA biti ugašen: drei mu zove update()
    // svaki frame, a taj update vraća kameru na staru udaljenost od targeta,
    // pa lerp nikad ne stigne do cilja (kadar ispadne puno bliži nego treba).
    if (c) c.enabled = false;

    const k = 1 - Math.pow(0.001, Math.min(delta, 0.05));   // frame-rate neovisan lerp
    camera.position.lerp(goalPos.current, k);
    if (c) c.target.lerp(goalTgt.current, k);
    camera.lookAt(c ? c.target : goalTgt.current);          // sami usmjeravamo kameru

    if (camera.position.distanceTo(goalPos.current) < 0.005) {
      moving.current = false;
      if (c) {
        c.target.copy(goalTgt.current);
        c.enabled = enabled;                                 // vrati korisniku kontrolu
        c.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controls}
      enabled={enabled}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.8}
      minPolarAngle={Math.PI * 0.3}
      maxPolarAngle={Math.PI * 0.7}
    />
  );
}