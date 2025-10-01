import { useRef } from "react";
import Marquee from "../components/Marquee";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BackgroundModel from "../components/BackgroundModel";

const ContactSummary = () => {
  const containerRef = useRef(null);

  const items = ["Focus", "Precision", "Trust", "Balance", "Flow"];
  const items2 = ["contact us", "contact us", "contact us", "contact us", "contact us"];

  // GSAP ScrollTrigger
  useGSAP(() => {
    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
        markers: false,
      },
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-between min-h-screen gap-12 mt-16"
    >
      {/* 3D Background */}
      <BackgroundModel />

      {/* Top Marquee */}
      <Marquee items={items} />

      {/* Main Text */}
      <div className="overflow-hidden font-light text-center contact-text-responsive z-10">
        <p>
          “ Let’s build a <br />
          <span className="font-normal">memorable</span> &{" "}
          <span className="italic">inspiring</span> <br />
          web application <span className="text-gold">together</span> “
        </p>
      </div>

      {/* Bottom Marquee */}
      <Marquee
        items={items2}
        reverse={true}
        className="text-black bg-transparent border-y-2 z-10"
        iconClassName="stroke-gold stroke-2 text-primary"
        icon="material-symbols-light:square"
      />
    </section>
  );
};

export default ContactSummary;
