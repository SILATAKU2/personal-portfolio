// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/all";
// gsap.registerPlugin(ScrollTrigger);
// const ServiceSummary = () => {
//   useGSAP(() => {
//     gsap.to("#title-service-1", {
//       xPercent: 20,
//       scrollTrigger: {
//         target: "#title-service-1",
//         scrub: true,
//       },
//     });
//     gsap.to("#title-service-2", {
//       xPercent: -30,
//       scrollTrigger: {
//         target: "#title-service-2",
//         scrub: true,
//       },
//     });
//     gsap.to("#title-service-3", {
//       xPercent: 100,
//       scrollTrigger: {
//         target: "#title-service-3",
//         scrub: true,
//       },
//     });
//     gsap.to("#title-service-4", {
//       xPercent: -100,
//       scrollTrigger: {
//         target: "#title-service-4",
//         scrub: true,
//       },
//     });
//   });
//   return (
//     <section
//   className="p-10 overflow-hidden font-light leading-snug text-center mb-42 contact-text-responsive"
//   // style={{ backgroundColor: "#280607" }}
// >
//   <div id="title-service-1">
//     <p className="text-white">React.js</p>
//   </div>
//   <div
//     id="title-service-2"
//     className="flex items-center justify-center gap-3 translate-x-16"
//   >
//     <p className="font-normal text-white">Wordpress</p>
//     <div className="w-10 h-1 md:w-32 bg-gold" />
//     <p className="text-white">Deployment</p>
//   </div>
//   <div
//     id="title-service-3"
//     className="flex items-center justify-center gap-3 -translate-x-48"
//   >
//     <p className="text-white">APIs</p>
//     <div className="w-10 h-1 md:w-32 bg-gold" />
//     <p className="italic text-white">GSAP</p>
//     <div className="w-10 h-1 md:w-32 bg-gold" />
//     <p className="text-white">Tailwind.css</p>
//   </div>
//   <div id="title-service-4" className="translate-x-48">
//     <p className="text-white">Deployment</p>
//   </div>
// </section>


//   );
// };

// export default ServiceSummary;

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

const items = [
  { type: "img", src: "/images/art.png", text: "" },
  { type: "img", src: "/images/warrior.jpeg", text: "" },
  { type: "video", src: "/images/speed1.mp4", text: "" },
  { type: "img", src: "/images/jinx.png", text: "" },
  { type: "img", src: "/images/water.png", text: "" },
  { type: "img", src: "/images/art.png", text: "" },
  { type: "img", src: "images/warrior.jpeg", text: "" },
  { type: "img", src: "/images/water.png", text: "" },
  { type: "video", src: "/images/speed1.mp4", text: "" },
  { type: "img", src: "https://i.pinimg.com/736x/4c/f4/21/4cf4218443483e227b62eb434ec68e54.jpg", text: "" },
];

export default function RotatingCarousel() {
  const containerRef = useRef(null);

  useEffect(() => {
    const carousel = containerRef.current;
    const cards = gsap.utils.toArray(".rcc-card");
    const numCards = cards.length;
    let radius;
    let dragDistancePerRotation;

    // Autorotation timeline (looped)
    const spin = gsap.timeline({ repeat: -1 })
      .to(cards, {
        rotationY: "+=360",
        duration: 40,
        ease: "none",
      });

    const proxy = document.createElement("div");
    let startProgress;
    const progressWrap = gsap.utils.wrap(0, 1);

    // Responsive positioning
    function updateResponsiveValues() {
      const containerWidth = carousel.offsetWidth;
      radius = containerWidth * 0.5;
      dragDistancePerRotation = radius * 7;

      cards.forEach((card) => {
        gsap.set(card, { transformOrigin: `50% 50% ${-radius}px` });
      });
    }

    function updateRotation() {
      let p = startProgress + (this.startX - this.x) / dragDistancePerRotation;
      spin.progress(progressWrap(p));
    }

    // Draggable
    Draggable.create(proxy, {
      trigger: carousel,
      type: "x",
      inertia: true,
      onPress() {
        gsap.killTweensOf(spin);
        spin.pause(); // pause autorotate on drag
        startProgress = spin.progress();
      },
      onDrag: updateRotation,
      onThrowUpdate: updateRotation,
      onRelease() {
        gsap.to(spin, { timeScale: 1, duration: 1, onComplete: () => spin.play() }); // resume autorotate
      },
      onThrowComplete() {
        gsap.to(spin, { timeScale: 1, duration: 1, onComplete: () => spin.play() });
      },
    });

    // Initial rotation distribution
    cards.forEach((card, i) => {
      gsap.set(card, {
        rotationY: (i * 360) / numCards,
      });
    });

    updateResponsiveValues();
    spin.progress(0);

    window.addEventListener("resize", updateResponsiveValues);
    return () => {
      window.removeEventListener("resize", updateResponsiveValues);
      spin.kill();
    };
  }, []);

  return (
    <section className="rcc-hero">
      <h2 className="rcc-title">
        
      </h2>

      <div className="rcc-carousel-container" ref={containerRef}>
        {items.map((item, i) => (
          <div className="rcc-card" key={i}>
            {item.type === "img" ? (
              <img src={item.src} alt={`card-${i}`} />
            ) : (
              <video autoPlay loop muted playsInline>
                <source src={item.src} type="video/mp4" />
              </video>
            )}
            <div className="rcc-card-content">
              <h3>{item.text}</h3>
            </div>
          </div>
        ))}

        {/* Rotation hint */}
        <div className="rcc-rotate-indicator">
          <span className="rcc-arrow">⇄</span> Drag to rotate
        </div>
      </div>
    </section>
  );
}
