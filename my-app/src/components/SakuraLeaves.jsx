import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SakuraLeaves = ({ count = 80 }) => {
  const meshRef = useRef();

  // Initialize leaves with position, speed, sway, and rotation
  const leaves = useMemo(() => {
    return new Array(count).fill().map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        Math.random() * 10 + 5,
        (Math.random() - 0.5) * 10 - 5 // behind Samurai mask
      ),
      speed: Math.random() * 0.005 + 0.003, // slower for graceful fall
      sway: Math.random() * 0.01 + 0.005,    // gentle horizontal sway
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01 // slow rotation
    }));
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(() => {
    leaves.forEach((leaf, i) => {
      // Fall down slowly
      leaf.position.y -= leaf.speed;

      // Horizontal sway
      leaf.position.x += Math.sin(leaf.rotation) * leaf.sway;

      // Slow rotation
      leaf.rotation += leaf.rotationSpeed;

      // Reset leaf when it goes below screen
      if (leaf.position.y < -5) {
        leaf.position.y = Math.random() * 10 + 5;
        leaf.position.x = (Math.random() - 0.5) * 20;
      }

      // Update buffer positions
      positions[i * 3] = leaf.position.x;
      positions[i * 3 + 1] = leaf.position.y;
      positions[i * 3 + 2] = leaf.position.z;
    });

    if (meshRef.current) {
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFB7C5"
        size={0.25} // slightly bigger
        sizeAttenuation
        transparent
        opacity={0.9}
      />
    </points>
  );
};

export default SakuraLeaves;
