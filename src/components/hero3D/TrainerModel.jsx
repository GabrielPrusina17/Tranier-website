import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const MODEL_Y = -1;
const SCALE = 1;

export default function TrainerModel() {
  const group = useRef();
  const { scene } = useGLTF("/models/trainer.glb");

  // Samo blagi sway + disanje. NEMA GLB animacije.
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.x = Math.sin(t * 0.6) * 0.015;
    const breathe = 1 + Math.sin(t * 1.2) * 0.006;
    group.current.scale.set(SCALE * breathe, SCALE * breathe, SCALE * breathe);
  });

  return (
    <group ref={group} position={[0, MODEL_Y, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/trainer.glb");