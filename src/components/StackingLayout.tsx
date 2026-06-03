"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function StackingLayout() {
  // Reference to the main scroll container
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimalist dataset
  const sections = [
    {
      id: 1,
      title: "Vision",
      subtitle: "Chapter One",
      bg: "bg-luxury-white",
      text: "text-luxury-black",
    },
    {
      id: 2,
      title: "Structure",
      subtitle: "Chapter Two",
      bg: "bg-luxury-black",
      text: "text-luxury-white",
    },
    {
      id: 3,
      title: "Material",
      subtitle: "Chapter Three",
      bg: "bg-luxury-gray-200",
      text: "text-luxury-black",
    },
    {
      id: 4,
      title: "Serenity",
      subtitle: "Chapter Four",
      bg: "bg-luxury-gray-800",
      text: "text-luxury-white",
    },
  ];

  return (
    // 1. The Scroll Container (Handles magnetic snapping)
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
    >
      {sections.map((section, index) => (
        <StackingSection
          key={section.id}
          section={section}
          index={index}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}

// 2. The Section Structure
interface SectionProps {
  section: { id: number; title: string; subtitle: string; bg: string; text: string };
  index: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const StackingSection = ({ section, index, containerRef }: SectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Tie scroll progress to the local parent container rather than the window
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef, // crucial for calculating scroll within 'overflow-y-auto'
    offset: ["start start", "end start"],
  });

  // 4. The Fade-Out Effect: smoothly transitions from 1 down to 0.7
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

  return (
    <div
      ref={sectionRef}
      // 5. Layering: Incremental z-index structurally assigned (10, 20, 30, 40)
      className={`h-screen w-full snap-start relative`}
      style={{ zIndex: (index + 1) * 10 }}
    >
      {/* 3. The Stacking Effect: Sticky internal wrapping container */}
      <motion.div
        style={{ opacity }}
        className={`sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center ${section.bg} ${section.text}`}
      >
        {/* Minimal Content */}
        <span className="text-sm md:text-base tracking-[0.4em] uppercase mb-4 opacity-60">
          {section.subtitle}
        </span>
        <h2 className="text-5xl md:text-8xl font-light uppercase tracking-tight">
          {section.title}
        </h2>
      </motion.div>
    </div>
  );
}