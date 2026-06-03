"use client";

import { createContext, useContext, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// We use a React Context to implicitly pass the scroll container's ref to its children.
// This allows `useScroll` to calculate the math accurately within the scrollable div instead of the global window.
export const ScrollSnapContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export function ScrollSnapContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollSnapContext.Provider value={containerRef}>
      {/* 
        CRUCIAL FIX: Handles the unified bounding physics. 
        It forces scrolling and magnetic snap points exclusively inside this element.
      */}
      <div
        id="main-scroll-container"
        ref={containerRef}
        data-lenis-prevent="true"
        className="relative h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        {children}
      </div>
    </ScrollSnapContext.Provider>
  );
}

export function StackedSectionWrapper({ 
  children, 
  zIndex = 10 
}: { 
  children: React.ReactNode; 
  zIndex?: number 
}) {
  const containerRef = useContext(ScrollSnapContext);
  const targetRef = useRef<HTMLDivElement>(null);

  // We detect when this section finishes its internal scroll and begins to leave the viewport.
  // "end end" = bottom of this section hits the bottom of the viewport.
  // "end start" = bottom of this section hits the top of the viewport.
  const { scrollYProgress } = useScroll({
    target: targetRef,
    // Safely cast to expected ref type. Framer motion gracefully defaults to window if null.
    container: containerRef as React.RefObject<HTMLElement>, 
    offset: ["end end", "end start"],
  });

  // Entrance detection: from the moment the section's top enters from the bottom of the viewport ("start end")
  // until its top hits the top of the viewport ("start start") and it docks.
  const { scrollYProgress: entranceProgress } = useScroll({
    target: targetRef,
    container: containerRef as React.RefObject<HTMLElement>,
    offset: ["start end", "start start"],
  });

  // Freeze the section in place by translating it down by exactly 1 viewport height while it scrolls up.
  // We use 75vh instead of 100vh to allow the underlying section to drift "upward" natively by 25vh while it's being covered.
  const yExit = useTransform(scrollYProgress, [0, 1], ["0vh", "75vh"]);
  
  // The Framer Motion Fade and slight parallax scaling scale-down push backwards effect
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  // Premium Entrance Physics:
  // Shift upward (from 25vh down to 0) as the section is revealed to give an elegant entrance weight.
  const entranceY = useTransform(entranceProgress, [0, 1], ["25vh", "0vh"]);
  const entranceOpacity = useTransform(entranceProgress, [0, 1], [0, 1]);

  // Directional Unblur Wipe: We animate a clip-path on a backdrop-blur overlay.
  // 0% inset means fully blurred. 100% inset means the blur is wiped away completely from top to bottom.
  const blurWipe = useTransform(entranceProgress, [0, 1], ["inset(0% 0 0 0)", "inset(100% 0 0 0)"]);

  // Combine Entrance and Exit tracking smoothly into unified variables so Framer Motion operates purely off the GPU bounds.
  // - If it's the first section (zIndex 10), it never "enters" (already mounted), so just map exits.
  // - Otherwise, interpolate: if entrance is not done, map entrance logic. If entrance is done, map exit logic.
  const combinedY = useTransform(() => {
    if (zIndex === 10) return yExit.get();
    return entranceProgress.get() < 1 ? entranceY.get() : yExit.get();
  });

  const combinedOpacity = useTransform(() => {
    if (zIndex === 10) return opacity.get();
    return entranceProgress.get() < 1 ? entranceOpacity.get() : opacity.get();
  });

  return (
    <div
      ref={targetRef}
      className="w-full snap-start relative"
      style={{ zIndex }}
    >
      {/* 
        The Sticky Stacking Shell 
        transformOrigin ensures that for sections larger than 100vh (e.g. 400vh),
        the shrink effect happens centered to the currently visible bottom 100vh slice.
      */}
      <motion.div
        style={{ 
          y: combinedY, 
          scale, 
          opacity: combinedOpacity, 
          transformOrigin: "50% calc(100% - 50vh)" 
        }}
        className="w-full h-full relative"
      >
        {/* The Top-to-Bottom Unblur Overlay (Only applies to sections sliding in from below) */}
        {zIndex > 10 && (
          <motion.div
            style={{ clipPath: blurWipe }}
            className="absolute inset-0 z-50 pointer-events-none backdrop-blur-[35px]"
          />
        )}
        
        {children}
      </motion.div>
    </div>
  );
}