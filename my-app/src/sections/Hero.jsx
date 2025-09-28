import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { SamuraiMask } from "../components/Planet";
import { Environment, Lightformer } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { useRef, useState, useEffect } from "react";
import SakuraLeaves from "../components/SakuraLeaves";


//  Camera with parallax effect
const ParallaxCamera = () => {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

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
    mouse.current.x += (target.current.x - mouse.current.x) * 0.05;
    mouse.current.y += (target.current.y - mouse.current.y) * 0.05;

    
    camera.position.x = mouse.current.x * 0.5;
    camera.position.y = mouse.current.y * 0.3;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Spotlight that follows cursor
const CursorSpotlight = () => {
  const lightRef = useRef();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: -(e.clientY / window.innerHeight - 0.5) * 10,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x += (target.current.x - lightRef.current.position.x) * 0.1;
      lightRef.current.position.y += (target.current.y - lightRef.current.position.y) * 0.1;
    }
  });

  return (
    <spotLight
      ref={lightRef}
      intensity={2.5}
      angle={0.6}
      penumbra={0.5}
      position={[0, 0, 10]}
      castShadow
    />
  );
};

// Idle + Scroll-following Mask
const IdleSamuraiMask = ({ scale, position }) => {
  const ref = useRef();
  const scrollRef = useRef(0);

  // Capture scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const idleFloat = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
      const idleRot = Math.PI / 8 + Math.sin(clock.getElapsedTime() * 0.2) * 0.1;

      // Normalize scroll for this section only
      const section = document.getElementById("home");
      if (section) {
        const rect = section.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1); 
        

        
        const scrollOffset = progress * 4; 
        ref.current.position.y = position[1] + idleFloat - scrollOffset;

        // scroll-driven rotation
        ref.current.rotation.y = idleRot + progress * Math.PI * 0.5; 
      }
    }
  });

  return <SamuraiMask ref={ref} scale={scale} position={position} />;
};


const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const text = `SCROLL AROUND AND FIND OUT`;

  return (
    <section id="home" className="flex flex-col justify-end min-h-screen">
      <AnimatedHeaderSection
        subTitle={"FRONT-END DEVELOPER & DIGITAL ARTIST"}
        title={"Sila Taku"}
        text={text}
        textColor={"text-white"}
      />

      <figure
  className="absolute inset-0 -z-50 bg-cover bg-center"
  style={{
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(/images/cherry blossoms.png)`,
  }}
>
  <Canvas shadows camera={{ position: [0, 0, 12], fov: 25, near: 1, far: 100 }}>
    {/* Base lights */}
    <ambientLight intensity={0.5} />
    <directionalLight position={[10, 10, 10]} intensity={1} castShadow />

    {/* Interactive spotlight */}
    <CursorSpotlight />

    {/* Sakura leaves */}
    <SakuraLeaves count={80} />

    {/* Samurai Mask (idle animation) */}
    <IdleSamuraiMask scale={isMobile ? 10 : 20} position={[3, -1, 0]} />

    {/* Parallax camera */}
    <ParallaxCamera />

    {/* Environment reflections */}
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
