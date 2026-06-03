"use client";

import Magnetic from "./Magnetic";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-luxury-black text-luxury-white overflow-hidden flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 min-h-screen z-30">
      
      {/* 1. MASSIVE CTA & MAGNETIC BUTTON ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-luxury-gray-800 pb-16 md:pb-24 gap-16 md:gap-0">
        <h2 className="text-fluid-display font-medium tracking-tighter leading-[0.85] uppercase">
          Let's Shape <br /> 
          <span className="text-luxury-gray-400">Your Space</span>
        </h2>

        {/* Magnetic Get In Touch Bubble */}
        <div className="md:mr-24">
          <Magnetic pull={0.4}>
            <div data-cursor="magnetic" className="w-36 h-36 md:w-52 md:h-52 rounded-full bg-luxury-white text-luxury-black flex flex-col items-center justify-center cursor-pointer group transition-colors hover:bg-luxury-gray-200">
              <span className="uppercase tracking-widest text-fluid-sm font-medium z-10 transition-transform duration-500 group-hover:-translate-y-1">
                Get in Touch
              </span>
              <ArrowUpRight className="w-6 h-6 mt-1 transition-all duration-500 opacity-0 -translate-x-4 translate-y-4 absolute group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-4" strokeWidth={1.5} />
            </div>
          </Magnetic>
        </div>
      </div>

      {/* 2. MINIMAL GRID DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mt-16 text-fluid-sm w-full">
        
        {/* Office Navigation */}
        <div className="flex flex-col gap-4">
          <span className="text-luxury-gray-600 uppercase tracking-widest text-[0.7rem] font-bold">Office</span>
          <div className="flex flex-col gap-1 text-luxury-gray-200">
            <p>128 Architectural Ave.</p>
            <p>Suite 404, Minimal District</p>
            <p>New York, NY 10013</p>
          </div>
        </div>

        {/* Contact Interactivity */}
        <div className="flex flex-col gap-4">
          <span className="text-luxury-gray-600 uppercase tracking-widest text-[0.7rem] font-bold">Inquiries</span>
          <div className="flex flex-col items-start gap-1">
            <Magnetic pull={0.15}>
              <a href="mailto:hello@aircenter.space" className="text-luxury-gray-200 hover:text-luxury-white transition-colors py-1">
                hello@aircenter.space
              </a>
            </Magnetic>
            <Magnetic pull={0.15}>
              <a href="tel:+12125550199" className="text-luxury-gray-200 hover:text-luxury-white transition-colors py-1">
                +1 (212) 555-0199
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Social Graph */}
        <div className="flex flex-col gap-4">
          <span className="text-luxury-gray-600 uppercase tracking-widest text-[0.7rem] font-bold">Socials</span>
          <div className="flex flex-col items-start gap-1">
            {["Instagram", "LinkedIn", "Twitter", "Awwwards"].map((social) => (
              <Magnetic pull={0.2} key={social}>
                <a href="#" className="relative group text-luxury-gray-200 hover:text-luxury-white transition-colors py-1 flex items-center">
                  <span>{social}</span>
                  {/* Subtle underline hover expansion */}
                  <span className="absolute left-0 bottom-1 w-0 h-[1px] bg-luxury-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Copyright & Meta */}
        <div className="flex flex-col md:items-end justify-end mt-8 md:mt-0 text-luxury-gray-400">
          <p className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Aircenter</span>
          </p>
          <p className="mt-1 text-luxury-gray-600 text-[0.75rem]">All rights reserved.</p>
        </div>

      </div>

    </footer>
  );
}