"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, Flame, ChevronDown, Mail } from "lucide-react";

// Classic Divider Motif
const ClassicDivider = () => (
  <div className="flex items-center justify-center gap-4 my-10 opacity-70">
    <div className="w-16 h-[1px] bg-[#C5A059]"></div>
    <div className="w-2 h-2 rotate-45 border border-[#C5A059]"></div>
    <div className="w-16 h-[1px] bg-[#C5A059]"></div>
  </div>
);

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function HomeClient() {
  return (
    <div 
      className="flex flex-col min-h-screen overflow-x-hidden font-sans selection:bg-[#C5A059]/20 selection:text-[#3D532D]"
    >
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/Nature.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      {/* Fixed Background Overlay Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#F8F6F0]/20 via-[#F8F6F0]/60 to-[#F8F6F0]/95" />
      
      {/* Global Texture Overlay to give a premium paper feel */}
      <div 
        className="fixed inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply z-[100]" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E')" }} 
      />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-24 px-6 md:px-12 border-b-8 border-[#3D532D]">
        
        {/* Subtle ethereal glow behind text - natural gold, not neon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <motion.div 
          className="container mx-auto max-w-5xl relative z-10 flex flex-col items-center text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[9.5rem] font-serif text-[#3D532D] leading-[0.9] tracking-tight mb-8 drop-shadow-sm mt-8 sm:mt-0">
            A Hub for <br/>
            <span className="italic font-light text-[#C5A059] relative inline-block pb-4">
              Exploration
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg sm:text-2xl md:text-3xl text-[#3D532D]/70 font-light leading-relaxed max-w-2xl font-serif italic px-4 sm:px-0">
            Intercession is the means of establishing God&apos;s Kingdom on earth.
          </motion.p>

          <ClassicDivider />

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 mt-4">
            <Link 
              href="/belong" 
              className="group relative px-10 py-5 bg-[#3D532D] text-[#FAF9F6] text-sm uppercase tracking-[0.2em] font-medium overflow-hidden shadow-[0_10px_30px_-10px_rgba(40,46,34,0.3)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(40,46,34,0.4)] hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-[#C5A059] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                Find Community <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              href="/resources" 
              className="px-10 py-5 border border-[#3D532D]/30 text-[#3D532D] text-sm uppercase tracking-[0.2em] font-medium hover:bg-[#3D532D]/10 hover:border-[#3D532D]/60 backdrop-blur-sm transition-all text-center w-full sm:w-auto"
            >
              Explore Library
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1, y: [0, 10, 0] }} 
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }} 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#C5A059] flex flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-widest font-bold">Scroll</span>
          <ChevronDown size={14} />
        </motion.div>
      </section>

      {/* Scripture Quote Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#3D532D]/90 backdrop-blur-md text-[#FAF9F6] relative text-center border-b-[8px] border-[#C5A059]">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23FAF9F6%22 fill-opacity=%221%22 fill-rule=%22evenodd%22%3E%3Ccircle cx=%223%22 cy=%223%22 r=%221%22/%3E%3Ccircle cx=%2213%22 cy=%2213%22 r=%221%22/%3E%3C/g%3E%3C/svg%3E')" }}></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <span className="text-[#C5A059] text-8xl font-serif opacity-30 absolute -top-10 -left-10 select-none">&quot;</span>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-serif italic font-light leading-relaxed mb-12 drop-shadow-md max-w-5xl mx-auto"
          >
            &quot;I looked for someone among them who would build up the wall and stand before me in the gap on behalf of the land so that I would not have to destroy it...&quot;
          </motion.h2>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-[1px] bg-[#C5A059]/50 mb-2"></div>
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-[#FAF9F6]/80">Ezekiel 22:30</p>
          </div>
        </div>
      </section>

      {/* Platform Manifesto Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 relative z-10 bg-transparent">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container mx-auto max-w-5xl"
        >
          <motion.div variants={fadeInUp} className="text-left w-full relative bg-white/70 backdrop-blur-md border border-[#3D532D]/10 p-6 sm:p-10 md:p-16 shadow-[0_10px_40px_-15px_rgba(61,83,45,0.05)]">
            {/* Corner styling */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#C5A059]/40"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#C5A059]/40"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#C5A059]/40"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#C5A059]/40"></div>

            <span className="float-left text-[80px] sm:text-[100px] md:text-[140px] text-[#C5A059] font-serif pr-4 sm:pr-8 pt-4 leading-[0.6] opacity-90 select-none">
              I
            </span>
            <p className="text-[#3D532D]/80 font-light leading-[1.8] sm:leading-[1.9] text-xl sm:text-2xl md:text-3xl mb-8 font-serif">
              ntercessor is a platform for those who want to explore the Christian faith further and learn new ways of understanding God. Our goal is to provide information and resources to support a life dedicated to Christ and help keep the fire burning.
            </p>
            <p className="text-[#3D532D]/80 font-light leading-[1.8] sm:leading-[1.9] text-xl sm:text-2xl md:text-3xl mb-12 font-serif clear-both md:clear-none">
              We are a one-stop shop for exploration, and an intermediary source of prayer independent of denominations and demographics. A pathway to intimacy with Christ may take different forms but the goal of pleasing God is what unites us.
            </p>
            
            <div className="border-t border-[#3D532D]/10 pt-8 mt-8 flex justify-end">
              <Link href="/resources" className="text-[#FAF9F6] bg-[#3D532D] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C5A059] transition-colors flex items-center gap-3 shadow-[4px_4px_0_0_#C5A059] group border border-[#C5A059]/20 w-fit">
                Explore More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Editorial Pillars Section */}
      <section className="py-32 px-6 md:px-12 bg-transparent relative z-10 border-b border-[#3D532D]/10">
        {/* Dark overlay scrim for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/35 pointer-events-none z-0" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col items-center text-center mb-24">
            <span className="text-[#C5A059] mb-4"><Flame size={28} strokeWidth={1} /></span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight mb-6 drop-shadow-xl text-balance">
              The Pillars of Intercession
            </h2>
            <p className="text-xl text-white/90 font-serif italic max-w-2xl drop-shadow-lg">
              Find your pathway to a pursuit that fundamentally changes how we live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#3D532D]/10 -z-10 hidden md:block"></div>
            
            {/* Cards with elegant classic framing */}
            {[
              {
                title: "Deep Teaching",
                icon: <BookOpen size={24} strokeWidth={1} />,
                desc: "Dive into new perspectives that anchor your understanding.",
                link: "/resources"
              },
              {
                title: "Local Gatherings",
                icon: <MapPin size={24} strokeWidth={1} />,
                desc: "Faith wasn't meant to be lived alone, Find believers geographically near you and build ties.",
                link: "/belong"
              },
              {
                title: "Prayer Intercession",
                icon: <Mail size={24} strokeWidth={1} />,
                desc: "We are an intermediary source, reach out and we will agree with you in prayer.",
                link: "/contact"
              }
            ].map((pillar, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white/15 backdrop-blur-md bg-sacred-grid border border-white/20 p-10 flex flex-col group hover:shadow-[0_20px_40px_-20px_rgba(255,255,255,0.2)] transition-all duration-500 hover:-translate-y-2 relative"
              >
                {/* Vintage Corner Brackets */}
                <div className="absolute w-4 h-4 border-t border-l border-[#C5A059] top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute w-4 h-4 border-t border-r border-[#C5A059] top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute w-4 h-4 border-b border-l border-[#C5A059] bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute w-4 h-4 border-b border-r border-[#C5A059] bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="w-16 h-16 rounded-full border border-white/30 shadow-sm flex items-center justify-center text-white mb-8 group-hover:bg-[#C5A059] group-hover:text-[#3D532D] transition-colors duration-500 bg-white/20">
                  {pillar.icon}
                </div>
                
                <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-[#C5A059] transition-colors drop-shadow-md">{pillar.title}</h3>
                <p className="text-white/80 font-light leading-relaxed flex-1 mb-8 text-lg drop-shadow-md">{pillar.desc}</p>
                
                <Link href={pillar.link} className="text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 mt-auto pb-2 border-b border-white/30 w-fit group-hover:border-[#C5A059] transition-colors drop-shadow-md">
                  Explore <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>





    </div>
  );
}
