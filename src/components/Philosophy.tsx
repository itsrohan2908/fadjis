"use client";

import { useRef, useContext } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ScrollSnapContext } from "./StackingWrappers";

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word = ({ children, progress, range }: WordProps) => {
  // Map the scroll progress to an opacity value tied precisely to the user's scroll speed
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <span className="relative inline-block mr-3 md:mr-5 mt-1 md:mt-3">
      {/* Background shadow word (low opacity) */}
      <span className="absolute opacity-15">{children}</span>
      {/* Foreground illuminated word */}
      <motion.span style={{ opacity }} className="text-luxury-white">
        {children}
      </motion.span>
    </span>
  );
};

export default function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useContext(ScrollSnapContext);

  // We track the scroll progress of the wrapper section.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef as React.RefObject<HTMLElement>,
    // The entire 400vh takes the highlight from start to finish
    offset: ["start start", "end end"],
  });

  const statement =
    "We do not just build structures. We sculpt the void, giving physical form to air, light, and silence.";
  const words = statement.split(" ");

  return (
    <section ref={containerRef} className="w-full h-[400vh] relative z-10 bg-luxury-black">
      <div className="sticky top-0 w-full h-screen text-luxury-white flex flex-col justify-center px-8 md:px-24 py-24 md:py-32 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-center md:justify-between gap-16 md:gap-24 items-start md:items-center w-full max-w-[1500px] mx-auto">
          {/* LEFT: Massive Asymmetrical Statement (Scroll- scrubbed text reveal) */}
          <div className="w-full md:w-[70%]">
        <h2 className="text-[8.5vw] leading-[1.15] md:text-fluid-2xl font-medium tracking-tighter uppercase flex flex-wrap">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </h2>
      </div>

      {/* RIGHT: Detailed minimal paragraph (Enters viewport gently) */}
      <div className="w-full md:w-[30%] flex items-start md:items-end md:pb-12">
        <motion.p
          className="text-luxury-gray-400 text-[3.5vw] md:text-fluid-sm font-sans tracking-wide leading-relaxed max-w-sm md:max-w-xs"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          Our philosophy is rooted in the belief that true luxury is found in reduction. 
          By stripping away the unnecessary, we allow the essential materials—concrete, 
          glass, raw timber—to speak their own absolute truth.
        </motion.p>
      </div>
        </div>
      </div>
    </section>
  );
}