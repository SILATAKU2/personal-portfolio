import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model = () => {
  const { scene } = useGLTF("/models/shattered_katana.glb"); 
  return <primitive object={scene} scale={0.8} position={[0, -1, 0]} />;
};

const BackgroundModel = () => (
  <Canvas
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1, 
    }}
    camera={{ position: [0, 0, 5], fov: 50 }}
  >
    <ambientLight intensity={0.5} />
    <directionalLight position={[5, 5, 5]} intensity={1} />
    <Suspense fallback={null}>
      <Model />
    </Suspense>
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
  </Canvas>
);

export default BackgroundModel;
