"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 229;
const FPS = 20;
const FRAME_DURATION = 1000 / FPS;

export default function AnimatedBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const lastDrawTimeRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    let loadedCount = 0;
    const frames: HTMLImageElement[] = [];

    // Preload frames
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(4, "0");
      img.src = `/assets/flower-bg-frames/frames_${frameNumber}.webp`;
      img.onload = () => {
        loadedCount++;
        // Draw the very first loaded frame (usually frame 1) so it doesn't stay blank
        if (loadedCount === 1 && canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
          }
        }
      };
      frames.push(img);
    }
    framesRef.current = frames;

    const animate = (time: number) => {
      if (!lastDrawTimeRef.current) lastDrawTimeRef.current = time;
      
      const deltaTime = time - lastDrawTimeRef.current;

      if (deltaTime >= FRAME_DURATION) {
        const nextFrame = (currentFrameRef.current + 1) % FRAME_COUNT;
        const img = framesRef.current[nextFrame];
        
        if (img && img.complete && img.naturalWidth > 0 && canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            if (canvas.width !== img.naturalWidth) {
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          }
          currentFrameRef.current = nextFrame;
        }
        
        lastDrawTimeRef.current = time;
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full object-cover z-0 ${className}`}
    />
  );
}
