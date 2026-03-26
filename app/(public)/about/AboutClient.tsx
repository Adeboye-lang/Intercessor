"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

// Classic Divider Motif
const ClassicDivider = () => (
  <div className="flex items-center justify-center gap-4 my-10 opacity-70">
    <div className="w-16 h-[1px] bg-[#C5A059]"></div>
    <div className="w-2 h-2 rotate-45 border border-[#C5A059]"></div>
    <div className="w-16 h-[1px] bg-[#C5A059]"></div>
  </div>
);

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } }
};

export default function AboutClient({
  dbContent: _dbContent
}: {
  dbContent?: Record<string, string>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className="flex flex-col min-h-screen overflow-x-hidden text-[#3D532D] relative" 
      ref={containerRef}
    >
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/vertical-grayscale-shot-grassy-field-with-blurred-cross.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      {/* Fixed Background Overlay Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#FAF9F6]/20 via-[#FAF9F6]/60 to-[#FAF9F6]/95" />
      
      {/* 1. The Letter / Manifesto */}
      <section className="pt-40 pb-32 min-h-[90vh] flex flex-col justify-center px-6 md:px-12 relative z-10 bg-transparent bg-sacred-grid border-b border-[#3D532D]/10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center w-full flex flex-col items-center border-b border-[#3D532D]/10 pb-16"
          >
            <motion.div variants={fadeIn} className="w-12 h-[1px] bg-[#C5A059] mb-10" />
            <motion.h3 variants={fadeIn} className="text-4xl sm:text-5xl md:text-7xl font-serif text-[#3D532D] leading-tight max-w-3xl mx-auto px-4 sm:px-0">
              A Calling from <span className="italic font-light text-[#C5A059]">God</span>
            </motion.h3>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="w-full text-lg md:text-xl text-[#3D532D]/85 leading-[1.8] font-light max-w-3xl mx-auto space-y-10"
          >
            <motion.p variants={fadeIn} className="relative">
              <span className="float-left text-6xl sm:text-7xl md:text-8xl text-[#C5A059] font-serif pr-3 sm:pr-4 pt-2 leading-[0.7] opacity-80 z-0">
                O
              </span>
              <span className="relative z-10">
                ur generation have become a part of a revival, there is a surge of interest in a higher power but the truth only lies in one God. The misconception of this revival as religious psychosis or a temporary trend has misguided us into believing it is more noble to fit in with the crowd than to step out to a calling from God.
              </span>
            </motion.p>
            
            <motion.p variants={fadeIn}>
              To walk with Christ is to standout, to be a light in a world of darkness experiencing true intimacy with him, but we cannot achieve this without first knowing him. If you are reading this, you stumbled here for a reason - whether known to you or not. This platform is about education, pace and intimacy. With so much available at our fingertips and in an instance, we must forge our secret place with an understanding of patience and depth.
            </motion.p>

            <motion.p variants={fadeIn}>
              Our aim is to be a one-stop shop for your knowledge, a safe hub for exploration and to do so only with the backing of the holy spirit. Independent from any church, religious body or denomination - we are simply fuelled by the blood of Christ.
            </motion.p>

            <motion.p variants={fadeIn}>
              If this is the beginning of your journey - welcome, explore, be patient with yourself find out more and God will do the rest. If you have been on this walk before, welcome back. Hopefully this stepping stone will give you the information you didn’t know you needed, but most of all, be kind to yourself. God is love and we will only act in that capacity.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 5. Call to Action */}
      <motion.section 
        className="py-32 px-6 md:px-12 relative z-10 bg-transparent bg-sacred-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        {/* Dark overlay scrim for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40 pointer-events-none z-0" />
        
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
          <ClassicDivider />
          
          <motion.h2 variants={slideUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif mb-8 leading-[1.1] tracking-tight text-white drop-shadow-2xl shadow-2xl px-4 sm:px-0">
            Beyond the <span className="italic font-light text-[#C5A059]">Platform</span>
          </motion.h2>
          
          <motion.p variants={fadeIn} className="text-xl md:text-2xl text-white leading-relaxed font-light mb-14 max-w-2xl font-serif italic drop-shadow-xl shadow-lg">
            Our ultimate mandate: equip you to building an intimate passion for Christ and to go out and intercede for others.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-6 mt-4 w-full sm:w-auto px-4 sm:px-0">
             <Link 
               href="/belong" 
               className="group relative px-6 sm:px-10 py-5 bg-[#C5A059] text-[#3D532D] text-sm uppercase tracking-[0.2em] font-medium overflow-hidden shadow-[0_10px_30px_-10px_rgba(197,160,89,0.4)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(197,160,89,0.6)] hover:-translate-y-1 w-full sm:w-auto text-center"
             >
               <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
               <span className="relative z-10 flex items-center justify-center gap-3">
                 Find Community <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </span>
             </Link>
             
             <Link 
               href="/resources" 
               className="px-6 sm:px-10 py-5 border border-white/40 text-white text-sm uppercase tracking-[0.2em] font-medium hover:bg-white/10 hover:border-white/60 transition-all font-sans drop-shadow-md w-full sm:w-auto text-center"
             >
               Explore Library
             </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
