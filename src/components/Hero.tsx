"use client";

import { useEffect, useRef, useContext } from "react";
import { motion, useScroll, useTransform, useMotionValue, animate } from "framer-motion";
import { ScrollSnapContext } from "./StackingWrappers";

const TEXT = "FADJIS";
const CHARS = TEXT.split("");

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useContext(ScrollSnapContext);

  // Lock scrolling during the ultra-minimalist intro sequence to ensure the user experiences the initial buttery spread
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timeout = setTimeout(() => {
      document.body.style.overflow = "";
    }, 2800);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(timeout);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });

  // Intro Animation Value (0 to 1 over 2.5 seconds)
  const intro = useMotionValue(0);
  useEffect(() => {
    animate(intro, 1, {
      duration: 2.2,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.3,
    });
  }, [intro]);

  // Combine Intro & Scroll for the Character Spread Factor
  // Starts at 0 (kerning normal), spreads to 1 during intro, shrinks back to 0 as user scrolls down
  const spreadFactor = useTransform(() => {
    const introProgress = intro.get();
    const scrollProgress = scrollYProgress.get();
    return introProgress * (1 - scrollProgress); 
  });

  // Slide-in entrance
  const containerX = useTransform(intro, [0, 1], ["-120vw", "0vw"]);
  const containerOpacity = useTransform(intro, [0, 0.2], [0, 1]);

  // Scroll Exit Transforms (Hand-coded values for seamless scale and transition into the next block)
  const globalScale = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const globalY = useTransform(scrollYProgress, [0, 1], ["0vh", "-38vh"]);
  const globalOpacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-luxury-white text-luxury-black z-0"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        <motion.div
          style={{
            x: containerX,
            opacity: containerOpacity,
            scale: globalScale,
            y: globalY,
          }}
          className="flex items-center justify-center relative whitespace-nowrap"
        >
          {CHARS.map((char, index) => {
            // Find mathematical center offset (e.g., -4 for 'A', 0 for 'E', +4 for 'R')
            const offset = index - (CHARS.length - 1) / 2;
            
            // Animate x based on spread factor. Max spread heavily relies on the offset and a fluid vw value
            // Notice: Absolutely no letter-spacing used to prevent DOM thrashing
            const charX = useTransform(
              spreadFactor, 
              (v) => `${v * offset * 4.4}vw`
            );

            return (
              <motion.span
                key={index}
                style={{ x: charX, opacity: globalOpacity }}
                className="text-[13vw] font-medium tracking-tighter uppercase leading-none block origin-center mix-blend-difference"
              >
                {char}
              </motion.span>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}