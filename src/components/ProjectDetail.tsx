"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import Magnetic from "./Magnetic";

// Exporting the type so our parent component can use it
export interface ProjectData {
  id: string;
  title: string;
  location: string;
  year: string;
  image: string;
  type: "portrait" | "landscape";
  client: string;
  services: string[];
  description: string;
  gallery: string[];
}

interface ProjectDetailProps {
  project: ProjectData;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  // Premium smooth easing for massive editorial elements
  const ease = [0.76, 0, 0.24, 1] as const;

  // Stagger sequence for the metadata grid and description
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.4 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease }}
      className="fixed inset-0 z-50 bg-luxury-white text-luxury-black overflow-y-auto"
      // Crucial: This prevents Lenis from scrolling the background layout while inside the modal
      data-lenis-prevent="true"
    >
      {/* Floating Magnetic Close Button */}
      <div className="fixed top-6 right-6 md:top-10 md:right-10 z-[60]">
        <Magnetic pull={0.2}>
          <button 
            onClick={onClose} 
            className="w-12 h-12 md:w-16 md:h-16 bg-luxury-black text-luxury-white rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
          </button>
        </Magnetic>
      </div>

      {/* Hero Image (Shared Layout with the previous card) */}
      <motion.div 
        layoutId={`project-image-${project.id}`}
        data-cursor="image" 
        className="w-full h-[50vh] md:h-[80vh] overflow-hidden bg-luxury-gray-200 origin-center relative"
      >
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/10 z-10" />
      </motion.div>

      {/* Editorial Content */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="px-6 py-16 md:px-12 md:py-24 max-w-[1600px] mx-auto flex flex-col md:flex-row gap-16"
      >
        {/* Metadata Grid */}
        <div className="w-full md:w-1/3 grid grid-cols-2 gap-8 md:gap-12 content-start">
          <motion.div variants={itemVars} className="flex flex-col gap-2">
            <span className="text-luxury-gray-400 uppercase tracking-widest text-[0.65rem] font-bold">Client</span>
            <span className="text-fluid-sm text-luxury-black font-medium">{project.client}</span>
          </motion.div>
          <motion.div variants={itemVars} className="flex flex-col gap-2">
            <span className="text-luxury-gray-400 uppercase tracking-widest text-[0.65rem] font-bold">Location</span>
            <span className="text-fluid-sm text-luxury-black font-medium">{project.location}</span>
          </motion.div>
          <motion.div variants={itemVars} className="flex flex-col gap-2">
            <span className="text-luxury-gray-400 uppercase tracking-widest text-[0.65rem] font-bold">Year</span>
            <span className="text-fluid-sm text-luxury-black font-medium">{project.year}</span>
          </motion.div>
          <motion.div variants={itemVars} className="flex flex-col gap-2">
            <span className="text-luxury-gray-400 uppercase tracking-widest text-[0.65rem] font-bold">Services</span>
            <span className="text-fluid-sm text-luxury-black font-medium">
              {project.services.map((s, i) => <span key={i} className="block">{s}</span>)}
            </span>
          </motion.div>
        </div>

        {/* Large Typography Description */}
        <motion.div variants={itemVars} className="w-full md:w-2/3">
          <h2 className="text-fluid-xl md:text-fluid-2xl font-light tracking-tight leading-[1.1] text-luxury-black">
            {project.description}
          </h2>
        </motion.div>
      </motion.div>

      {/* Asymmetric Image Gallery */}
      <div className="px-6 pb-24 md:px-12 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
        {project.gallery.map((img, idx) => (
          <motion.div 
            key={idx}
            data-cursor="image"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease, delay: idx % 2 === 0 ? 0 : 0.3 }}
            className={`w-full overflow-hidden bg-luxury-gray-200 ${idx % 2 !== 0 ? 'md:mt-32' : ''}`}
          >
            <img 
              src={img} 
              alt={`${project.title} detail ${idx + 1}`} 
              className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-[2s] ease-[cubic-bezier(0.76,0,0.24,1)]" 
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}