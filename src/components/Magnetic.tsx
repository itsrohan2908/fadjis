"use client";

import React, { useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  pull?: number; // Strength of the magnetic pull
}

export default function Magnetic({ children, pull = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Framer motion values to track coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Premium physics springs for the snap-back and smooth drag
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    // Get the element's current position and dimensions bounds
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Calculate the distance of the mouse from the center of the element
    const middleX = e.clientX - (left + width / 2);
    const middleY = e.clientY - (top + height / 2);
    
    // Apply the magnetic pull
    x.set(middleX * pull);
    y.set(middleY * pull);
  };

  const reset = () => {
    // Snap back to origin flawlessly
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className="relative flex items-center justify-center z-10 will-change-transform"
    >
      {children}
    </motion.div>
  );
}