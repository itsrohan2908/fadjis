"use client";

import React, { useRef, useState, useEffect, useContext } from "react";
import { preload } from "react-dom"; // Premium preloading hook
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ScrollSnapContext } from "./StackingWrappers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// -------------------------------------------------------------
// REFACTOR: ASSET PIPELINE CONFIGURATION
// -------------------------------------------------------------
const FRAME_COUNT = 326;            
const BUFFER_CRITICAL_COUNT = 50;
const EXTENSION = ".webp";

const getFrameString = (index: number) => {
  return (index + 1).toString().padStart(4, "0");
};

export default function ScrollVideoSection() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const scrollerContext = useContext(ScrollSnapContext);

  // States
  const [assetPath, setAssetPath] = useState<string | null>(null);
  const [bufferReady, setBufferReady] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const frameRef = useRef({ frame: 0 });

  // ---------------------------------------------------------------------------
  // 1. RUNTIME DEVICE DETECTION & CRITICAL BUFFER HEAD PRELOADING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Detect mobile vs desktop viewports
    const isMobile = window.innerWidth < 768;
    const chosenPath = isMobile 
      ? "/assets/mobile-frames/frames_" 
      : "/assets/scroll-frames/frames_";
    
    setAssetPath(chosenPath);

    // Eagerly inject high-priority preloads for the initial buffer pool directly into HTML head
    for (let i = 0; i < BUFFER_CRITICAL_COUNT; i++) {
      preload(`${chosenPath}${getFrameString(i)}${EXTENSION}`, { as: "image" });
    }
  }, []);

  // ---------------------------------------------------------------------------
  // 2. HIGH-PERFORMANCE RENDERING ENGINE
  // ---------------------------------------------------------------------------
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imagesRef.current[index];
    if (!img || !img.complete) {
      for (let i = index; i >= 0; i--) {
        if (imagesRef.current[i] && imagesRef.current[i]!.complete) {
          img = imagesRef.current[i];
          break;
        }
      }
    }

    if (!img || !img.complete) {
      for (let i = index; i < FRAME_COUNT; i++) {
        if (imagesRef.current[i] && imagesRef.current[i]!.complete) {
          img = imagesRef.current[i];
          break;
        }
      }
    }

    if (!img) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Fixed: Because Option 2 loads separate native aspect ratio layouts for mobile, 
    // we can use standard Math.max (cover) everywhere without causing horizontal cutoff or letterboxing.
    const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
      
    const renderWidth = img.width * scale;
    const renderHeight = img.height * scale;
    
    const offsetX = (canvasWidth - renderWidth) / 2;
    const offsetY = (canvasHeight - renderHeight) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  };

  // ---------------------------------------------------------------------------
  // 3. DYNAMIC ASSET STREAMING PIPELINE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!assetPath) return; // Prevent execution until device path state is locked in

    let loadedTotal = 0;

    // Load Frame 1 instantly
    const firstImg = new Image();
    firstImg.src = `${assetPath}${getFrameString(0)}${EXTENSION}`;
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      drawFrame(0);
    };

    // Stream remaining targeted assets asynchronously
    for (let i = 0; i < FRAME_COUNT; i++) {
      if (i === 0) continue; 

      const img = new Image();
      img.src = `${assetPath}${getFrameString(i)}${EXTENSION}`;
      
      img.onload = () => {
        imagesRef.current[i] = img;
        loadedTotal++;
        
        setGlobalProgress(Math.round((loadedTotal / FRAME_COUNT) * 100));

        if (loadedTotal >= BUFFER_CRITICAL_COUNT && !bufferReady) {
          setBufferReady(true);
        }
        
        if (frameRef.current.frame === i) {
          drawFrame(i);
        }
      };
    }
  }, [assetPath]);

  useEffect(() => {
    if (!bufferReady) return;
    const handleResize = () => drawFrame(frameRef.current.frame);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [bufferReady]);

  // ---------------------------------------------------------------------------
  // 4. GSAP CONTROL TIMELINE (The "Wow" Factor)
  // ---------------------------------------------------------------------------
  useGSAP(() => {
    if (!bufferReady || !containerRef.current || !canvasWrapperRef.current) return;

    const scrollerNode = scrollerContext?.current || window;

    // Smooth Decimal Multipliers
    const frameTween = gsap.to(frameRef.current, {
      frame: FRAME_COUNT - 1,
      ease: "none", 
      onUpdate: () => {
        drawFrame(Math.round(frameRef.current.frame));
      },
    });

    // Premium Cinematic Depth Scaling Effect
    const scaleTween = gsap.fromTo(canvasRef.current, 
      { scale: 1.12 }, 
      { scale: 1, ease: "power2.inOut" } 
    );

    const masterTimeline = gsap.timeline();
    masterTimeline.add(frameTween, 0).add(scaleTween, 0);

    ScrollTrigger.create({
      trigger: containerRef.current,
      scroller: scrollerNode, 
      start: "top top",
      end: "bottom bottom", 
      scrub: 0.5, 
      animation: masterTimeline,
    });
  }, { dependencies: [bufferReady], scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-black h-[800vh]"
    >
      <div 
        ref={canvasWrapperRef} 
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black"
      >
        {/* Initialization overlay */}
        {!bufferReady && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-white bg-black">
            <span className="text-xs sm:text-sm tracking-[0.2em] font-light font-mono uppercase mb-4 opacity-70">
              Initializing Experience...
            </span>
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Real-time streaming texture feedback indicator */}
        {bufferReady && globalProgress < 100 && (
          <div className="absolute bottom-6 right-8 z-40 text-[10px] font-mono text-white/40 tracking-widest uppercase">
            Streaming High-Res Assets... {globalProgress}%
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full object-cover origin-center" 
        />
      </div>
    </section>
  );
}