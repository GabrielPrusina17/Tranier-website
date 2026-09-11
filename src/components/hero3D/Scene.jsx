import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Svjetlo pričvršćeno na kameru: koju god stranu modela okreneš,
// mišić ostaje čitljiv (inače su leđa u mraku).
function Headlight({ color = "#fff3e2", intensity = 1.25 }) {
  const { camera, scene } = useThree();
  useEffect(() => {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0.4, 0.6, 1);
    light.target = camera;
    camera.add(light);
    scene.add(camera);
    return () => { camera.remove(light); light.dispose(); };
  }, [camera, scene, color, intensity]);
  return null;
}

export default function Scene({ children }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 38, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Svjetla daju modelu volumen — bez njih je Meshy model plosnat kao 2D slika */}
      <hemisphereLight args={["#5a5f6b", "#0a0a0a", 0.55]} />
      <directionalLight position={[2.5, 3.4, 2.6]} intensity={2.4} color="#ffd9a0" />
      <directionalLight position={[-3, 2, -2.4]} intensity={1.0} color="#7fb4ff" />
      <directionalLight position={[0, 1.2, 3.5]} intensity={0.35} />
      <Headlight />

      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}