/* eslint-disable react-hooks/immutability --
   three.js objekti (materijali, geometrije, atributi) su mutabilni GPU handleovi;
   mijenjanje im je jedini način rada i nema veze s React stateom. */
import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useMuscleMask, { zoneFocus } from "../../hooks/useMuscleMask";
import { patchMuscleMaterial, HIGHLIGHT_UNIFORMS as U } from "./muscleHighlightMaterial";
import { MUSCLE_ZONES } from "../../config/muscleZone";

const TARGET_HEIGHT = 1.75;   // na koliku visinu u sceni dovodimo model
const FLOOR_Y = -0.9;         // gdje stoje stopala

/**
 * Stvarni gabariti modela u svijetu.
 * Box3.setFromObject() zna lagati (mesh čvor sa skalom 0.01, a veličinu nose
 * kosti), pa mjerimo vertexe — isti put kojim se računa i zoom na zonu, da se
 * kadar i highlight ne mogu razići.
 */
function measureModel(mesh, step = 8) {
  const box = new THREE.Box3();
  const v = new THREE.Vector3();
  const n = mesh.geometry.attributes.position.count;
  mesh.updateWorldMatrix(true, false);
  for (let i = 0; i < n; i += step) {
    mesh.getVertexPosition(i, v);
    mesh.localToWorld(v);
    box.expandByPoint(v);
  }
  return box;
}

export default function TrainerModel({ activeZone, onSelect, onFocus, onReady }) {
  const { scene } = useGLTF("/models/trainer1.glb");
  const { gl, camera } = useThree();
  const group = useRef();
  const prevZone = useRef(null);
  const anim = useRef({ mix: 1, sweep: 2, focus: 0, idle: 1 });

  // props u refove -> listeneri i efekti se ne moraju ponovno vezati
  const focusCb = useRef(onFocus);
  const readyCb = useRef(onReady);
  const selectCb = useRef(onSelect);
  const activeRef = useRef(activeZone);
  useEffect(() => {
    focusCb.current = onFocus;
    readyCb.current = onReady;
    selectCb.current = onSelect;
    activeRef.current = activeZone;
  });

  const mesh = useMemo(() => {
    let found = null;
    scene.traverse((o) => { if (!found && o.isSkinnedMesh) found = o; });
    if (!found) scene.traverse((o) => { if (!found && o.isMesh) found = o; });
    if (!found) console.error("[TrainerModel] u GLB-u nema mesha");
    return found;
  }, [scene]);

  const data = useMuscleMask(mesh);

  // ---- T-poza + mjerenje + smještanje u scenu ----
  useEffect(() => {
    if (!mesh || !group.current) return;

    // Ako model IMA kosti, vrati ih u bind (T) pozu; trainer1.glb ih nema
    // pa se ovo preskoči. Nijedna GLB animacija se ne pokreće — model stoji.
    if (mesh.skeleton) { mesh.skeleton.pose(); mesh.skeleton.update(); }
    scene.traverse((o) => { if (o.isMesh || o.isSkinnedMesh) o.frustumCulled = false; });

    const g = group.current;
    g.scale.setScalar(1);
    g.position.set(0, 0, 0);
    g.updateWorldMatrix(true, true);

    const box = measureModel(mesh);
    const size = box.getSize(new THREE.Vector3());

    if (!Number.isFinite(size.y) || size.y <= 0) {
      console.error("[TrainerModel] mjerenje nije uspjelo, ostavljam skalu 1");
      readyCb.current?.({ height: TARGET_HEIGHT, width: TARGET_HEIGHT, centerY: FLOOR_Y + TARGET_HEIGHT / 2 });
      return;
    }

    const s = TARGET_HEIGHT / size.y;
    g.scale.setScalar(s);
    g.position.set(
      -((box.min.x + box.max.x) / 2) * s,
      FLOOR_Y - box.min.y * s,
      -((box.min.z + box.max.z) / 2) * s
    );
    g.updateWorldMatrix(true, true);

    readyCb.current?.({
      height: TARGET_HEIGHT,
      width: size.x * s,                       // T-poza: raspon ruku
      centerY: FLOOR_Y + TARGET_HEIGHT / 2,
    });
  }, [mesh, scene]);

  // ---- materijal: shader + oštrina teksture ----
  useEffect(() => {
    if (!mesh) return;
    patchMuscleMaterial(mesh.material);

    // Anizotropno filtriranje — najveći pojedinačni dobitak na oštrinu tamo
    // gdje tekstura bježi pod kutom (bokovi, ruke). Bez toga je mipmap zamućen.
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    for (const tex of [mesh.material.map, mesh.material.emissiveMap]) {
      if (!tex) continue;
      tex.anisotropy = maxAniso;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;
    }

    // unsharp mask treba znati stvarnu veličinu teksela
    const img = mesh.material.map?.image;
    if (img?.width) U.uTexel.value.set(1 / img.width, 1 / img.height);
  }, [mesh, gl]);

  // ---- klik: bez raycasta na svaki pomak miša ----
  // R3F raycasta scenu na SVAKI pointermove, a raycast po gustom meshu je skup
  // -> lag pri rotaciji. Zato modelu gasimo raycast, a sami ga pozovemo točno
  // jednom, na klik.
  useEffect(() => {
    if (!mesh || !data) return;

    const meshRaycast = mesh.raycast.bind(mesh);
    mesh.raycast = () => {};

    const el = gl.domElement;
    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let down = null;

    const onDown = (e) => { down = { x: e.clientX, y: e.clientY }; };

    const onUp = (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      down = null;
      if (moved > 6) return;                   // bio je drag, ne klik

      const rect = el.getBoundingClientRect();
      ndc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);

      const hits = [];
      meshRaycast(raycaster, hits);
      hits.sort((a, b) => a.distance - b.distance);
      const hit = hits[0];

      if (!hit || !hit.face) { selectCb.current(null); return; }   // klik u prazno = zatvori

      const { a, b, c } = hit.face;
      let best = null;
      let bestV = 0.12;
      for (const z of MUSCLE_ZONES) {
        const m = data.masks[z.id];
        const v = (m[a] + m[b] + m[c]) / 3;
        if (v > bestV) { bestV = v; best = z; }
      }
      if (!best) {
        // klik "između" zona -> najbliža zona
        const p = [data.restPos[a * 3], data.restPos[a * 3 + 1], data.restPos[a * 3 + 2]];
        let bestD = 0.28;
        for (const z of MUSCLE_ZONES) {
          const md = data.meta[z.id];
          const d = Math.hypot(p[0] - md.cx, p[1] - md.cy, p[2] - md.cz);
          if (d < bestD) { bestD = d; best = z; }
        }
      }

      selectCb.current(best && best.id === activeRef.current?.id ? null : best);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      mesh.raycast = meshRaycast;
    };
  }, [mesh, data, gl, camera]);

  // ---- promjena zone ----
  useEffect(() => {
    if (!mesh || !data) return;
    const geo = mesh.geometry;
    const a = geo.attributes.aMaskA.array;
    const b = geo.attributes.aMaskB.array;

    const old = prevZone.current ? data.masks[prevZone.current.id] : null;
    const next = activeZone ? data.masks[activeZone.id] : null;
    old ? a.set(old) : a.fill(0);
    next ? b.set(next) : b.fill(0);
    geo.attributes.aMaskA.needsUpdate = true;
    geo.attributes.aMaskB.needsUpdate = true;

    anim.current.mix = 0;
    anim.current.sweep = 0;

    if (activeZone) {
      const md = data.meta[activeZone.id];
      U.uY0.value = md.y0;
      U.uY1.value = md.y1;
      U.uColor.value.set(activeZone.color ?? "#ff4a2e");
    }

    prevZone.current = activeZone ?? null;
    focusCb.current?.(activeZone ? zoneFocus(mesh, data, activeZone) : null);
  }, [activeZone, mesh, data]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const A = anim.current;

    A.mix += (1 - A.mix) * dt * 5;
    A.sweep += dt * 1.35;
    A.focus += ((activeZone ? 1 : 0) - A.focus) * dt * 4;
    A.idle += ((activeZone ? 0 : 1) - A.idle) * dt * 3;

    U.uMix.value = A.mix;
    U.uSweep.value = Math.min(A.sweep, 2);
    U.uFocus.value = A.focus;
    U.uIdle.value = A.idle;
    U.uTime.value = t;

    const ph = (t * 0.16) % 1;
    U.uScan.value = ph < 0.62 ? (ph / 0.62) * 2.05 - 0.18 : -9;
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/trainer1.glb");