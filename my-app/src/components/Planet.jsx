import { useGLTF } from "@react-three/drei";
import { forwardRef } from "react";

// SamuraiMask.jsx
export const SamuraiMask = forwardRef((props, ref) => {
  const { scene } = useGLTF("/models/samurai_mask.glb");

  return (
    <group
      ref={ref}
      rotation={[0, Math.PI / 8, 0]} // just rotation
      {...props}                     // Float position/scale will come here
    >
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
});



useGLTF.preload("/models/samurai_mask.glb");
