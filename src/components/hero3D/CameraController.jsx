import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// === REGULATOR VELIČINE ===
// === REGULATOR VELIČINE ===
// Na desktopu model namjerno manji — ima prostora oko sebe;
// na mobitelu ostaje kakav je (tamo ionako širina ruku diktira kadar).
const HOME_FILL_DESKTOP = 0.78;   // manji broj = manji model na desktopu
const HOME_FILL_MOBILE = 0.92;    // ne diraj, mobitel ti je ok
const ARM_FIT = 0.8;              // koliki dio raspona ruku mora stati u širinu

const FALLBACK = { height: 1.75, width: 1.75, centerY: -0.025 };

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

      // udaljenost tako da zona zauzme ~42% visine kadra (32% na mobitelu)
      let dist = focus.radius / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) / (wide ? 0.42 : 0.32);
      if (aspect < 1) dist /= Math.max(aspect, 0.55);
      dist = THREE.MathUtils.clamp(dist, 0.35, 6);

      // prednje skupine gledamo sprijeda, stražnje straga, bočne pod kutom
      const dir = new THREE.Vector3(0, 0, focus.side === -1 ? -1 : 1);
      if (focus.side === 0) dir.set(0.5, 0, 0.86).normalize();

      goalTgt.current.copy(focus.center);
      goalPos.current.copy(focus.center).addScaledVector(dir, dist);

      const up = new THREE.Vector3(0, 1, 0);
      if (wide) {
        // desktop: pomakni model lijevo da ne završi ispod VideoCard-a
        const right = new THREE.Vector3().crossVectors(dir, up).normalize();
        goalPos.current.addScaledVector(right, -dist * 0.17);
        goalTgt.current.addScaledVector(right, -dist * 0.17);
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
    const k = 1 - Math.pow(0.001, Math.min(delta, 0.05));   // frame-rate neovisan lerp
    camera.position.lerp(goalPos.current, k);
    if (controls.current) {
      controls.current.target.lerp(goalTgt.current, k);
      controls.current.update();
    }
    if (camera.position.distanceTo(goalPos.current) < 0.005) moving.current = false;
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