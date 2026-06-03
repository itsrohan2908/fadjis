"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState("default");
  const [isVisible, setIsVisible] = useState(false);

  // Initial out-of-bounds positions
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Premium tight physics for buttery soft follow
  const springConfig = { damping: 25, stiffness: 450, mass: 0.1 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only engage the custom cursor on devices with a fine pointer (desktop/mouse)
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      // Sync raw mouse coordinates
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      
      // Determine what variant to invoke based on what we are hovering
      if (target.closest('[data-cursor="project"]')) {
        setCursorState("project");
      } else if (target.closest('[data-cursor="magnetic"]')) {
        // When pulling magnetic elements, shrink the cursor tight
        setCursorState("magnetic");
      } else if (target.closest('img, [data-cursor="image"]')) {
        // Force the cursor to be solid white over images instead of inverted colors
        setCursorState("image");
      } else if (target.closest('a, button, [data-cursor="pointer"], .cursor-pointer')) {
        // General clickable elements
        setCursorState("pointer");
      } else {
        setCursorState("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  // Variant States
  const variants = {
    default: {
      width: 14,
      height: 14,
      backgroundColor: "#ffffff",
      border: "0px solid #ffffff",
    },
    pointer: {
      width: 48,
      height: 48,
      backgroundColor: "transparent",
      border: "1px solid #ffffff",
    },
    magnetic: {
      width: 8,
      height: 8,
      backgroundColor: "#ffffff",
      border: "0px solid transparent",
    },
    image: {
      width: 14,
      height: 14,
      backgroundColor: "#f5f5f7",
      border: "0px solid transparent",
    },
    project: {
      width: 110,
      height: 110,
      backgroundColor: "#f5f5f7",
      border: "0px solid transparent",
    }
  };

  const isNormalBlend = cursorState === "project" || cursorState === "image";

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ x: cursorX, y: cursorY, mixBlendMode: isNormalBlend ? "normal" : "difference" }}
    >
      <motion.div
        variants={variants}
        animate={cursorState}
        transition={{ type: "tween", ease: 'easeOut', duration: 0.25 }}
        className="flex items-center justify-center rounded-full text-luxury-black font-medium text-[0.7rem] tracking-widest uppercase overflow-hidden"
        // This instantly centers the expanding circle directly on the cursor coordinate point
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: cursorState === "project" ? 1 : 0, 
            scale: cursorState === "project" ? 1 : 0.5 
          }}
          transition={{ duration: 0.2 }}
        >
          View
        </motion.span>
      </motion.div>
    </motion.div>
  );
}