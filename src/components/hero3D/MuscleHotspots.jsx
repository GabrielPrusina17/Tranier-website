import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MUSCLE_ZONES } from "../../config/muscleZone";

function GlowZone({ zone, isActive, onSelect }) {
  const ref = useRef();
  const base = zone.size ?? 0.16;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    if (isActive) {
      const p = 1 + Math.sin(t * 3) * 0.05;
      ref.current.scale.setScalar(base * p);
      ref.current.material.opacity = 0.55;
      ref.current.material.emissiveIntensity = 1.6;
    } else {
      const p = 1 + Math.sin(t * 1.8 + zone.position[0] * 3) * 0.08;
      ref.current.scale.setScalar(base * 0.85 * p);
      ref.current.material.opacity = 0.18;
      ref.current.material.emissiveIntensity = 0.5;
    }
  });

  return (
    <mesh
      ref={ref}
      position={zone.position}
      onClick={(e) => { e.stopPropagation(); onSelect(zone); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "default"; }}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={isActive ? "#e23b2e" : "#c9a24b"}
        emissive={isActive ? "#ff3b1e" : "#c9a24b"}
        emissiveIntensity={0.5}
        transparent
        opacity={0.18}
        depthWrite={false}
        roughness={1}
      />
    </mesh>
  );
}

export default function MuscleHotspots({ activeZone, onSelect }) {
  return (
    <group>
      {MUSCLE_ZONES.map((z) => (
        <GlowZone key={z.id} zone={z} isActive={activeZone?.id === z.id} onSelect={onSelect} />
      ))}
    </group>
  );
}