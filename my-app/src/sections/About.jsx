import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const About = () => {
  const text = `Merging creativity and technology 
  to craft engaging digital art 
  and visual narratives`;

  const aboutText = `Developer since 2020 with a BSc in Information and Computer Science and a lifelong passion for art and creativity.
☾ Unique Style
☾ Tailored approach
☾ Multitasking at its finest`;

  const imgRef = useRef(null);
  const overlayRef = useRef(null);

  useGSAP(() => {
    // Scale section on scroll
    gsap.to("#about", {
      scale: 0.95,
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
      },
      ease: "power1.inOut",
    });

    // Image clip reveal
    gsap.set(imgRef.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.to(imgRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 2,
      ease: "power4.out",
      scrollTrigger: { trigger: imgRef.current },
    });

    // Overlay reveal from left + grow
gsap.fromTo(
  overlayRef.current,
  { opacity: 0, scaleX: 0, transformOrigin: "left center" },
  {
    opacity: 1,
    scaleX: 1,
    scrollTrigger: {
      trigger: imgRef.current,
      start: "top 80%",
      end: "top 40%",
      scrub: true,
    },
    ease: "power2.out",
  }
);

  });

  return (
    <section
      id="about"
      className="relative min-h-screen bg-black rounded-b-4xl overflow-hidden"
    >
      <AnimatedHeaderSection
        subTitle={"@merethyl_art"}
        title={"About"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />

      <div className="relative flex flex-col lg:flex-row items-center gap-16 px-10 pb-16 text-xl font-light tracking-wide text-white/60">
        {/* Left column: bigger image */}
        <div className="relative w-full lg:w-1/2 flex justify-center">
          <img
            ref={imgRef}
            src="images/me2.png"
            alt="man"
            className="relative z-10 w-full lg:w-[450px] xl:w-[550px] rounded-3xl object-cover"
          />

          {/* Transparent overlay */}
          <img
            ref={overlayRef}
            src="images/sakura-overlay.png"
            alt="sakura overlay"
            className="absolute top-0 left-0 w-full lg:w-[450px] xl:w-[550px] h-full z-20 pointer-events-none object-cover"
          />
        </div>

        {/* Right column: text */}
        <div className="w-full lg:w-1/2">
          <AnimatedTextLines text={aboutText} className="w-full" />
        </div>
      </div>
    </section>
  );
};

export default About;
