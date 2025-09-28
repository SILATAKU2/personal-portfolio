import { useGLTF } from "@react-three/drei";
import { forwardRef, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const SamuraiMask = forwardRef(({ ...props }, ref) => {
  const { scene } = useGLTF("/models/samurai_mask.glb");
  const groupRef = ref || useRef();

  const scrollRef = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [progress, setProgress] = useState(0);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Smooth entrance progress
    setProgress((prev) => Math.min(prev + 0.02, 1));
    const eased = THREE.MathUtils.smoothstep(progress, 0, 1); // smooth easing

    // Entrance position (slide in from above-right-front)
    const startPos = new THREE.Vector3(6, 3, 8);
    const endPos = new THREE.Vector3(props.position?.[0] || 3, props.position?.[1] || -1, props.position?.[2] || 0);
    groupRef.current.position.lerpVectors(startPos, endPos, eased);

    // Entrance rotation (spin around Y-axis)
    const startRotY = Math.PI * 2; // full spin
    const endRotY = (scrollRef.current || 0) * 0.001; // keep scroll rotation after entrance
    groupRef.current.rotation.y = THREE.MathUtils.lerp(startRotY, endRotY, eased);

    // Optional: subtle float after entrance
    const idleRot = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    groupRef.current.rotation.y += idleRot;

    // Scale up smoothly
    const startScale = 0.5;
    const endScale = props.scale || 1;
    const s = THREE.MathUtils.lerp(startScale, endScale, eased);
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} {...props}>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
});

useGLTF.preload("/models/samurai_mask.glb");
