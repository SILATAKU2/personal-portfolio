import { Canvas, useFrame } from "@react-three/fiber";
import { SamuraiMask } from "../components/Planet"; 
import { Environment, Lightformer } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { useRef, useState, useEffect } from "react";
import SakuraLeaves from "../components/SakuraLeaves";

const CursorFollowingSamuraiMask = ({ scale }) => {
  const ref = useRef();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      target.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;

      mouse.x += (target.current.x - mouse.x) * 0.05;
      mouse.y += (target.current.y - mouse.y) * 0.05;

      ref.current.position.x = 3 + mouse.x * 0.5;
      ref.current.position.y = mouse.y * 0.5 - 1;
    }
  });

  return <SamuraiMask ref={ref} scale={scale} />;
};

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const text = `Results-driven developer with a proven track record in building and optimizing websites. Combining technical expertise with creative flair to deliver exceptional digital experiences.`;

  return (
    <section id="home" className="flex flex-col justify-end min-h-screen">
      <AnimatedHeaderSection
        subTitle={"FRONT-END DEVELOPER & DIGITAL ARTIST"}
        title={"Sila Taku"}
        text={text}
        textColor={"text-white"}
      />

      <figure className="absolute inset-0 -z-50" style={{ width: "100vw", height: "100vh" }}>
        <Canvas shadows camera={{ position: [0, 0, 12], fov: 25, near: 1, far: 100 }}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={100}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />

          {/* Sakura leaves behind the mask */}
          <SakuraLeaves count={80} />

          {/* Samurai Mask in front */}
          <CursorFollowingSamuraiMask scale={isMobile ? 10 : 20} />

          <Environment resolution={512}>
            <group rotation={[-Math.PI / 3, 4, 1]}>
              <Lightformer form="circle" intensity={2} position={[0, 10, -10]} scale={15} castShadow />
              <Lightformer form="circle" intensity={1.5} position={[0, 5, 2]} scale={12} castShadow />
              <Lightformer form="circle" intensity={1} position={[-10, -5, -5]} scale={10} castShadow />
              <Lightformer form="circle" intensity={2} position={[15, 3, 0]} scale={20} castShadow />
            </group>
          </Environment>
        </Canvas>
      </figure>
    </section>
  );
};

export default Hero;
