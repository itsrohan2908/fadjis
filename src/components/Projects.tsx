"use client";

import { useRef, useState, useContext } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from "framer-motion";
import ProjectDetail, { ProjectData } from "./ProjectDetail";
import { ScrollSnapContext } from "./StackingWrappers";
import AnimatedBackground from "./AnimatedBackground";

// Enriched mock data matching the new ProjectData structure
const projects: ProjectData[] = [
  {
    id: "p1",
    title: "Minimalist Concrete Villa",
    location: "Kyoto, Japan",
    year: "2025",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop",
    type: "landscape",
    client: "Tadao Private",
    services: ["Architecture", "Interior Design", "Lighting Strategy"],
    description: "Nestled in the hills of Kyoto, this concrete pavilion strips away all ornamentation to let light and shadow dictate the rhythm of the day. A study in ultimate atmospheric reduction.",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18efc2297?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687126-8a3414349a51?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    id: "p2",
    title: "Brutalist Penthouse",
    location: "New York, NY",
    year: "2024",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    type: "portrait",
    client: "Studio Freight",
    services: ["Renovation", "Spatial Planning", "Furnishings"],
    description: "Floating above Manhattan, this brutalist sanctuary redefines urban luxury through massive monolithic forms, poured resin floors, and uncompromisingly sharp linear intersections.",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800&auto=format&fit=crop",
    ]
  },
  {
    id: "p3",
    title: "Desert Pavilion",
    location: "Joshua Tree, CA",
    year: "2026",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1600&auto=format&fit=crop",
    type: "landscape",
    client: "Atlas Developments",
    services: ["Concept Architecture", "Material Sourcing", "Landscaping"],
    description: "A breathtaking horizontal slab extending effortlessly over the arid landscape. Designed to merge inside and out, blurring the line between absolute protection and exposed wilderness.",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
    ]
  },
  {
    id: "p4",
    title: "Glass House",
    location: "Swiss Alps",
    year: "2023",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    type: "portrait",
    client: "Vela Trust",
    services: ["Architecture", "Engineering", "Thermal Strategy"],
    description: "An isolated glass anomaly situated amongst severe snowcaps. The challenge was thermal retention while upholding our obsessive commitment to thin, almost invisible structural framing.",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687126-8a3414349a51?q=80&w=800&auto=format&fit=crop",
    ]
  },
];

const ProjectCard = ({ project, onClick }: { project: ProjectData, onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col gap-6 shrink-0 cursor-pointer ${
        project.type === "portrait" ? "w-[75vw] md:w-[35vw]" : "w-[85vw] md:w-[50vw]"
      }`}
    >
      {/* Image Container with strict clipping for hover scale + Shared Layout ID */}
      <motion.div
        layoutId={`project-image-${project.id}`}
        data-cursor="project" 
        className={`w-full overflow-hidden bg-luxury-gray-200 ${
          project.type === "portrait" ? "aspect-[3/4]" : "aspect-[16/9]"
        }`}
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover origin-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-[1.03]"
        />
      </motion.div>

      {/* Typography block */}
      <div className="flex justify-between items-start text-luxury-black">
        <div>
          <h3 className="text-fluid-lg tracking-tighter uppercase font-medium">
            {project.title}
          </h3>
          <p className="text-luxury-gray-600 text-fluid-sm tracking-widest uppercase mt-2">
            {project.location}
          </p>
        </div>
        <span className="text-luxury-gray-400 text-fluid-sm mt-1">
          {project.year}
        </span>
      </div>
    </div>
  );
};

export default function Projects() {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useContext(ScrollSnapContext);
  
  // High-level state to track the active detailed project
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = projects.find(p => p.id === selectedId);

  // Track scroll position of the massive vertical container
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: scrollContainerRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });

  // Map the 0-1 vertical scroll progress to percentage and vw offsets safely
  const xPercent = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const vwOffset = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const x = useMotionTemplate`calc(${xPercent}% + ${vwOffset}vw)`;

  return (
    <>
      <section className="bg-luxury-white w-full text-luxury-black isolate z-10 relative">
        
        {/* UNIVERSAL HORIZONTAL SCROLL (Sticky Linked for all devices) */}
        <div ref={targetRef} className="relative h-[400vh] md:h-[500vh]">
          {/* Sticky wrapper locks into the viewport */}
          <div className="sticky top-0 flex h-dvh items-center overflow-hidden">
            
            <AnimatedBackground className="opacity-80 pointer-events-none" />
            
            <motion.div style={{ x }} className="flex items-center w-max gap-12 md:gap-24 px-[10vw] relative z-10">
              
              {/* Intro Lead */}
              <div className="w-[60vw] md:w-[30vw] flex flex-col justify-center shrink-0">
                <h2 className="text-fluid-display font-medium tracking-tighter uppercase leading-[0.85]">
                  Selected
                  <br />
                  <span className="text-luxury-gray-400 opacity-60">Works</span>
                </h2>
              </div>

              {/* Track of Cards */}
              {projects.map((p) => (
                <div key={p.id} className="flex flex-col justify-center shrink-0">
                  <ProjectCard 
                    project={p} 
                    onClick={() => setSelectedId(p.id)} 
                  />
                </div>
              ))}
              
              {/* Trailing Space to allow the last card to center gracefully */}
              <div className="w-[10vw] shrink-0" />
              
            </motion.div>
          
          </div>
        </div>
      </section>

      {/* MODAL / DETAIL VIEW PRESENCE */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail 
            key="project-detail"
            project={selectedProject} 
            onClose={() => setSelectedId(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}