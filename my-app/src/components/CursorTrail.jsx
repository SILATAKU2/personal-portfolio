import { useEffect } from "react";
import gsap from "gsap";

const CursorTrail = () => {
  useEffect(() => {
    let lastPos = { x: 0, y: 0 };
    let lastSpawn = 0;
    const spawnInterval = 80;

    const handleMouse = (e) => {
      const now = Date.now();
      if (now - lastSpawn < spawnInterval) return;
      lastSpawn = now;

      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) return;

      const speedFactor = Math.min(dist / 20, 2);

      // Create petal
      const petal = document.createElement("div");
      const width = Math.random() * 12 + 12; // 12-24px
      const height = width * (0.6 + Math.random() * 0.4); // oval
      petal.style.position = "fixed";
      petal.style.left = `${e.clientX}px`;
      petal.style.top = `${e.clientY}px`;
      petal.style.width = `${width}px`;
      petal.style.height = `${height}px`;
      petal.style.background = `rgba(255, ${180 + Math.random() * 50}, ${200 + Math.random() * 50}, 0.8)`;
      petal.style.borderRadius = "50% 50% 50% 50% / 60% 60% 40% 40%";
      petal.style.pointerEvents = "none";
      petal.style.opacity = Math.random() * 0.5 + 0.5;
      petal.style.transform = `rotate(${Math.random() * 360}deg)`;
      petal.style.filter = `blur(${Math.random() * 1.2}px)`;

      document.body.appendChild(petal);

      const tl = gsap.timeline({
        onComplete: () => petal.remove(),
      });

      const xDrift = (Math.random() * 60 + 30) * speedFactor; // drift mostly right
      const yDrift = -Math.random() * 60 - 30 * speedFactor;   // upward
      const rotateAmount = Math.random() * 720 - 360;
      const swayAmount = Math.random() * 15 + 10;
      const duration = Math.random() * 1.5 + 1.5; // shorter → disappears faster

      // Upward + blown by wind
      tl.to(petal, {
        x: `+=${xDrift}`,
        y: `+=${yDrift}`,
        rotation: `+=${rotateAmount}`,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.8,
        duration: duration / speedFactor,
        ease: "power1.out",
      });

      // Downward + fade
      tl.to(petal, {
        y: "+=80",
        x: `+=${(Math.random() - 0.5) * 20 + 20}`, // more right drift
        opacity: 0,
        scale: 0.3 + Math.random() * 0.5,
        rotation: `+=${Math.random() * 180 - 90}`,
        duration: 2 + Math.random() * 1,
        ease: "sine.out",
      });

      // Gentle sway
      gsap.to(petal, {
        x: `+=${swayAmount}`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: Math.random() * 1 + 0.5,
      });

      lastPos = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("mousemove", handleMouse);
    return () => document.removeEventListener("mousemove", handleMouse);
  }, []);

  return null;
};

export default CursorTrail;
