import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const CAMERA_Z = 5.5;
const CAMERA_Y = 0.4;
const CAMERA_FOV = 42;

export default function Scene({ children, controlsEnabled = true }) {
  return (
    <Canvas
      camera={{ position: [0, CAMERA_Y, CAMERA_Z], fov: CAMERA_FOV }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ camera, size }) => {
        const aspect = size.width / size.height;
        if (aspect < 1) camera.position.z = CAMERA_Z * 1.6;
        else if (aspect < 1.5) camera.position.z = CAMERA_Z * 1.2;
        camera.updateProjectionMatrix();
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={2.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.8} />

      {children}

      <OrbitControls
        enabled={controlsEnabled}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}