import { useMemo } from "react";
import * as THREE from "three";
import { MUSCLE_ZONES } from "../config/muscleZone";

const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const ellipsoid = (x, y, z, c, r, soft) => {
  const dx = (x - c[0]) / r[0], dy = (y - c[1]) / r[1], dz = (z - c[2]) / r[2];
  return 1 - smooth(1 - soft, 1, Math.sqrt(dx * dx + dy * dy + dz * dz));
};

/**
 * Za svaki vertex izračuna koliko pripada kojoj zoni (0..1) i rezultat upiše u
 * geometry atribute. Radi se JEDNOM po modelu (~30 ms za 32k vertexa).
 * Maska je vezana za vertex, pa prati skinning/pozu sama od sebe.
 */
export default function useMuscleMask(mesh) {
  return useMemo(() => {
    if (!mesh) return null;

    const g = mesh.geometry;
    const N = g.attributes.position.count;
    const pos = g.attributes.position.array;
    const nrm = g.attributes.normal.array;
    const skinIndex = g.attributes.skinIndex?.array ?? null;
    const skinWeight = g.attributes.skinWeight?.array ?? null;
    const boneNames = mesh.skeleton ? mesh.skeleton.bones.map((b) => b.name) : [];

    const masks = {};
    const meta = {};
    const idle = new Float32Array(N);

    for (const z of MUSCLE_ZONES) {
      const m = new Float32Array(N);
      const boneIdx = new Set(z.bones.map((n) => boneNames.indexOf(n)).filter((i) => i >= 0));

      for (let i = 0; i < N; i++) {
        // 1) težina kostiju
        let bw = 1;
        if (skinIndex && boneIdx.size) {
          bw = 0;
          for (let k = 0; k < 4; k++) {
            if (boneIdx.has(skinIndex[i * 4 + k])) bw += skinWeight[i * 4 + k];
          }
          bw = smooth(0.12, 0.55, Math.min(1, bw * 1.15));
        }
        if (bw <= 0) continue;

        // 2) volumen (elipsoid, po potrebi zrcaljen)
        const px = pos[i * 3], py = pos[i * 3 + 1], pz = pos[i * 3 + 2];
        let vol = ellipsoid(px, py, pz, z.center, z.radii, z.soft);
        if (z.mirror) {
          vol = Math.max(vol, ellipsoid(px, py, pz, [-z.center[0], z.center[1], z.center[2]], z.radii, z.soft));
        }
        if (vol <= 0) continue;

        // 3) prednja / stražnja strana po normali
        const side = z.side === 0 ? 1 : smooth(-0.15, 0.5, nrm[i * 3 + 2] * z.side);

        const v = bw * vol * side;
        m[i] = v;
        if (v > idle[i]) idle[i] = v;
      }

      // y-raspon (za sweep) + težište u rest pozi (za fallback klik)
      let y0 = Infinity, y1 = -Infinity, sx = 0, sy = 0, sz = 0, sw = 0, n = 0;
      for (let i = 0; i < N; i++) {
        const v = m[i];
        if (v > 0.15) { const y = pos[i * 3 + 1]; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        if (v > 0.3) { sx += pos[i * 3] * v; sy += pos[i * 3 + 1] * v; sz += pos[i * 3 + 2] * v; sw += v; n++; }
      }

      masks[z.id] = m;
      meta[z.id] = {
        y0: Number.isFinite(y0) ? y0 : 0,
        y1: Number.isFinite(y1) ? y1 : 1.7,
        cx: sw ? sx / sw : 0, cy: sw ? sy / sw : 0, cz: sw ? sz / sw : 0,
        count: n,
      };
      if (!n) console.warn(`[muscle] zona "${z.id}" je prazna — provjeri bones / center / radii`);
    }

    g.setAttribute("aMaskA", new THREE.BufferAttribute(new Float32Array(N), 1));
    g.setAttribute("aMaskB", new THREE.BufferAttribute(new Float32Array(N), 1));
    g.setAttribute("aMaskIdle", new THREE.BufferAttribute(idle, 1));

    return { masks, meta, restPos: pos, count: N };
  }, [mesh]);
}

const _v = new THREE.Vector3();

/**
 * Težište i radijus zone U SVIJETU, iz trenutne poze — kamera iz toga računa
 * gdje treba stati. Za zrcaljene skupine kadrira jednu stranu, jer su u T-pozi
 * ruke preširoko razmaknute da obje stanu u smislen kadar.
 */
export function zoneFocus(mesh, data, zone, oneSide = true) {
  if (!mesh || !data) return null;
  mesh.updateWorldMatrix(true, false);

  const m = data.masks[zone.id];
  const center = new THREE.Vector3();
  const pts = [];
  let w = 0;

  for (let i = 0; i < data.count; i += 4) {
    if (m[i] < 0.4) continue;
    if (oneSide && zone.mirror && data.restPos[i * 3] < 0.02) continue;
    mesh.getVertexPosition(i, _v);
    mesh.localToWorld(_v);
    pts.push(_v.clone());
    center.addScaledVector(_v, m[i]);
    w += m[i];
  }
  if (!w) return null;

  center.divideScalar(w);
  let radius = 0;
  for (const p of pts) radius = Math.max(radius, p.distanceTo(center));

  return { center, radius: Math.max(radius, 0.16), side: zone.side };
}