import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const SakuraLeaves = ({ count = 80 }) => {
  const meshRef = useRef();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Create leaves with procedural "petal-like" shape
  const leaves = useMemo(() => {
    return new Array(count).fill().map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        Math.random() * 10 + 5,
        (Math.random() - 0.5) * 10 - 5
      ),
      speed: Math.random() * 0.01 + 0.005,
      sway: Math.random() * 0.01 + 0.005,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      size: Math.random() * 0.3 + 0.2, // ellipse size
      scaleX: Math.random() * 0.6 + 0.7, // make width smaller than height for petal
    }));
  }, [count]);

  const { camera } = useThree();

  useFrame(() => {
    const cursorWorld = new THREE.Vector3(mouse.current.x, mouse.current.y, 0.5);
    cursorWorld.unproject(camera);

    leaves.forEach((leaf, i) => {
      leaf.position.y -= leaf.speed;
      leaf.position.x += Math.sin(leaf.rotation) * leaf.sway;
      leaf.rotation += leaf.rotationSpeed;

      const dist = leaf.position.distanceTo(cursorWorld);
      if (dist < 2) {
        const force = (2 - dist) * 0.02;
        const dir = new THREE.Vector3().subVectors(leaf.position, cursorWorld).normalize();
        leaf.position.addScaledVector(dir, force);
      }

      if (leaf.position.y < -5) {
        leaf.position.y = Math.random() * 10 + 5;
        leaf.position.x = (Math.random() - 0.5) * 20;
        leaf.position.z = (Math.random() - 0.5) * 10 - 5;
      }

      positions[i * 3] = leaf.position.x;
      positions[i * 3 + 1] = leaf.position.y;
      positions[i * 3 + 2] = leaf.position.z;
    });

    if (meshRef.current) {
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Procedural "canvas" texture for petal
  const petalTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FFC0CB";
    ctx.beginPath();
    ctx.ellipse(size / 2, size / 2, size * 0.35, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

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
        map={petalTexture}
        transparent
        alphaTest={0.5}
        sizeAttenuation
        size={0.25}
        opacity={0.9}
      />
    </points>
  );
};

export default SakuraLeaves;
