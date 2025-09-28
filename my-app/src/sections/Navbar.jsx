import React, { useEffect, useRef, useState } from "react";
import { socials } from "../constants";
import gsap from "gsap";
import { Link } from "react-scroll";

const Navbar = () => {
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const spansRef = useRef([]); // <span> inside each link for scramble
  const contactRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const tl = useRef(null);
  const iconTl = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(true);

  // Japanese characters
  const japaneseChars =
    "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
  const getRandomChar = () => japaneseChars[Math.floor(Math.random() * japaneseChars.length)];

  // Scramble animation
  const scrambleText = (element, finalText, duration = 2) => {
    const chars = finalText.split("");
    let start = 0;
    const step = () => {
      start += 1 / (60 * duration);
      const output = chars
        .map((char, i) => (start >= i / chars.length ? char : getRandomChar()))
        .join("");
      element.textContent = output;
      if (start < 1) requestAnimationFrame(step);
      else element.textContent = finalText;
    };
    step();
  };

  // GSAP setup
  useEffect(() => {
    gsap.set(navRef.current, { xPercent: 100 });
    gsap.set([...linksRef.current, contactRef.current], { autoAlpha: 0, x: -20 });

    tl.current = gsap
      .timeline({ paused: true })
      .to(navRef.current, { xPercent: 0, duration: 1, ease: "power3.out" })
      .to(
        linksRef.current,
        { autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
        "<"
      )
      .to(contactRef.current, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, "<+0.2");

    iconTl.current = gsap
      .timeline({ paused: true })
      .to(topLineRef.current, { rotate: 45, y: 3.3, duration: 0.3, ease: "power2.inOut" })
      .to(bottomLineRef.current, { rotate: -45, y: -3.3, duration: 0.3, ease: "power2.inOut" }, "<");
  }, []);

  // Hide/show burger button on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowBurger(currentScrollY <= lastScrollY || currentScrollY < 10);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle menu
  const toggleMenu = () => {
    if (isOpen) {
      tl.current.reverse();
      iconTl.current.reverse();
    } else {
      tl.current.play();
      iconTl.current.play();

      // Scramble each <span> inside links
      spansRef.current.forEach((spanEl, i) => {
        setTimeout(() => {
          scrambleText(spanEl, spanEl.dataset.text, 2);
        }, i * 200);
      });
    }
    setIsOpen(!isOpen);
  };

  const sections = ["home", "services", "about", "work", "contact"];

  return (
    <>
      {/* Navbar */}
      <nav
        ref={navRef}
        className="fixed z-50 flex flex-col justify-between w-full h-full px-10 uppercase bg-black text-white/80 py-28 gap-y-10 md:w-1/2 md:left-1/2"
      >
        <div className="flex flex-col text-5xl gap-y-2 md:text-6xl lg:text-8xl">
  {sections.map((section, index) => (
    <div key={index} ref={(el) => (linksRef.current[index] = el)}>
      <Link
        className="transition-all duration-300 cursor-pointer hover:text-white"
        to={section}
        smooth
        offset={0}
        duration={2000}
      >
        <span
          ref={(el) => (spansRef.current[index] = el)}
          data-text={section}
        >
          {section}
        </span>
      </Link>
    </div>
  ))}
</div>


        <div ref={contactRef} className="flex flex-col flex-wrap justify-between gap-8 md:flex-row">
          <div className="font-light">
            <p className="tracking-wider text-white/50">E-mail</p>
            <p className="text-xl tracking-widest lowercase text-pretty">takusilaa@gmail.com</p>
          </div>
          <div className="font-light">
            <p className="tracking-wider text-white/50">Social Media</p>
            <div className="flex flex-col flex-wrap md:flex-row gap-x-2">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-loose tracking-widest uppercase hover:text-white transition-colors duration-300"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hamburger Button */}
      <div
        className="fixed z-50 flex flex-col items-center justify-center gap-1 transition-all duration-300 bg-black rounded-full cursor-pointer w-14 h-14 md:w-20 md:h-20 top-4 right-10"
        onClick={toggleMenu}
        style={showBurger ? { clipPath: "circle(50% at 50% 50%)" } : { clipPath: "circle(0% at 50% 50%)" }}
      >
        <span ref={topLineRef} className="block w-8 h-0.5 bg-white rounded-full origin-center"></span>
        <span ref={bottomLineRef} className="block w-8 h-0.5 bg-white rounded-full origin-center"></span>
      </div>
    </>
  );
};

export default Navbar;
