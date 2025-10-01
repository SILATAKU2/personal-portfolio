import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model = () => {
  const { scene } = useGLTF("/models/wip_katana.glb");
  const modelRef = useRef();

  // Floating animation
  useFrame(({ clock }) => {
    if (!modelRef.current) return;
    const t = clock.getElapsedTime();
    modelRef.current.rotation.y = t * 0.3;          // slow rotation
    modelRef.current.position.y = Math.sin(t * 0.5) * 0.2; // floating
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={3}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]} // rotate 90° along X-axis
    />
  );
};


const BackgroundModel = () => {
  return (
    <Canvas
      shadows
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
      camera={{ position: [0, 2, 3], fov: 50 }} // closer camera
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={2} castShadow />

      <Suspense fallback={null}>
        <Model />
      </Suspense>

      <OrbitControls enableZoom={false} enablePan autoRotate={false} />
    </Canvas>
  );
};

export default BackgroundModel;
