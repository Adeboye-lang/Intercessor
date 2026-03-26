"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, ArrowRight, Heart, BookOpen, Globe } from "lucide-react";

// Classic Divider Motif
const ClassicDivider = () => (
  <div className="flex items-center justify-center gap-4 my-10 opacity-70 w-full">
    <div className="w-16 h-[1px] bg-[#C5A059]"></div>
    <div className="w-2 h-2 rotate-45 border border-[#C5A059]"></div>
    <div className="w-16 h-[1px] bg-[#C5A059]"></div>
  </div>
);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const subjects = [
  { id: "general", label: "General Enquiry", icon: MessageSquare },
  { id: "prayer", label: "Prayer Request", icon: Heart },
  { id: "partnership", label: "Partnership", icon: Globe },
];

export default function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          subject: formData.subject,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "general", message: "" });
      } else {
        setStatusMessage(
          result?.error || "Something went wrong. Please try again or email us directly at contact@intercessor.uk"
        );
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to send message. Please try emailing us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen text-[#3D532D] overflow-hidden relative selection:bg-[#C5A059]/20 selection:text-[#3D532D]"
    >
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/cross.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      {/* Light overlay to ensure text readability while keeping cross prominently visible */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#F4F5F0]/2 via-[#F4F5F0]/12 to-[#F4F5F0]/35" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-20 md:pt-32 pb-12 md:pb-32 relative z-10 border-x border-[#3D532D]/5 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center md:text-left mb-12 md:mb-20 max-w-4xl"
        >
          <motion.div variants={fadeIn} className="flex flex-col md:items-start items-center mb-8">
             <div className="w-[1px] h-12 bg-[#C5A059] mb-4" />
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
               Correspondence
             </span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-[8rem] font-serif text-[#3D532D] mb-8 leading-[1] tracking-tight text-balance">
            Connect <br className="hidden lg:block"/> 
            <span className="italic font-light text-[#C5A059]">with us.</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-2xl lg:text-3xl text-[#3D532D]/80 font-serif italic leading-[1.6] max-w-3xl font-light">
            Whether you have a prayer request, want to know more or simply have a question, we want to hear from you.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 md:gap-20">
          
          {/* Left Column: Info Group */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-4 flex flex-col gap-8"
          >
            {/* Main Contact Card */}
            <motion.div variants={fadeIn} className="bg-white/80 backdrop-blur-md p-6 md:p-12 border border-[#3D532D]/10 relative flex flex-col group shadow-[8px_8px_0_0_rgba(197,160,89,0.1)]">
               {/* Vintage Corner Brackets */}
               <div className="absolute w-4 h-4 border-t border-l border-[#C5A059] top-3 left-3 opacity-50"></div>
               <div className="absolute w-4 h-4 border-b border-r border-[#C5A059] bottom-3 right-3 opacity-50"></div>

              <div className="w-12 h-12 flex items-center justify-center text-[#C5A059] mb-8 border border-[#3D532D]/10 bg-[#FAF9F6]">
                <Mail size={20} strokeWidth={1} />
              </div>
              
              <h3 className="text-[10px] tracking-[0.4em] text-[#3D532D]/50 uppercase font-bold mb-4">Email</h3>
              <a href="mailto:contact@intercessor.uk" className="text-lg md:text-2xl font-serif text-[#3D532D] hover:text-[#C5A059] transition-colors block mb-6 break-all sm:break-normal italic">
                contact@intercessor.uk
              </a>
              
              <div className="h-[1px] w-full bg-[#3D532D]/10 mb-6" />
              
              <h3 className="text-[10px] tracking-[0.4em] text-[#3D532D]/50 uppercase font-bold mb-4 mt-2">Social</h3>
              <div className="flex flex-col gap-3">
                <a href="https://www.instagram.com/intercessor.uk?igsh=MXYzeDRhcm03eW1oaw==" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg font-serif text-[#3D532D] hover:text-[#C5A059] transition-colors italic flex items-center gap-2">
                  Instagram <ArrowRight size={14} className="opacity-50" />
                </a>
                <a href="https://www.tiktok.com/@intercessor.uk?_r=1&_t=ZN-94wDnTBnHhW" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg font-serif text-[#3D532D] hover:text-[#C5A059] transition-colors italic flex items-center gap-2">
                  TikTok <ArrowRight size={14} className="opacity-50" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Premium Document Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
            className="lg:col-span-8"
          >
            <div className="bg-[#FAF9F6]/80 backdrop-blur-md p-6 sm:p-8 md:p-16 border-2 border-[#3D532D] relative h-full shadow-[12px_12px_0_0_#C5A059] hover:shadow-[16px_16px_0_0_#C5A059] transition-shadow duration-500">
               {/* Ornate Inner Line */}
               <div className="absolute inset-2 border border-[#3D532D]/20 pointer-events-none"></div>
               {/* Classical Corner Highlights */}
               <div className="absolute w-8 h-8 border-t-2 border-l-2 border-[#C5A059] top-4 left-4 pointer-events-none"></div>
               <div className="absolute w-8 h-8 border-b-2 border-r-2 border-[#C5A059] bottom-4 right-4 pointer-events-none"></div>
               
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.4 }}
                    onSubmit={handleSubmit}
                    className="space-y-8 md:space-y-12 relative z-10"
                  >
                    {/* Topic Selection */}
                    <div className="space-y-6">
                      <label className="block text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059] mb-4 text-center">Nature of Enquiry</label>
                      <div className="flex flex-wrap justify-center gap-3 md:gap-4 border-b border-[#3D532D]/10 pb-8 md:pb-10">
                        {subjects.map((sub) => {
                          const Icon = sub.icon;
                          const isActive = formData.subject === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, subject: sub.id })}
                              className={`flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 text-xs md:text-sm font-serif italic transition-all duration-300 border ${
                                isActive 
                                ? 'bg-[#3D532D] text-[#FAF9F6] border-[#3D532D]' 
                                : 'bg-transparent text-[#3D532D]/70 border-[#3D532D]/20 hover:border-[#3D532D]/50'
                              }`}
                            >
                              <Icon size={16} className={isActive ? "text-[#C5A059]" : "text-[#3D532D]/50"} strokeWidth={1} />
                              <span className="hidden sm:inline">{sub.label}</span>
                              <span className="sm:hidden text-[10px]">{sub.label.split(" ")[0]}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-[10px] font-bold tracking-[0.3em] uppercase text-[#3D532D]/50">Your Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-0 py-3 md:py-4 bg-transparent border-b border-[#3D532D]/20 focus:border-[#C5A059] outline-none text-[#3D532D] text-base md:text-xl font-serif transition-colors duration-300 placeholder:text-[#3D532D]/30 placeholder:italic"
                          placeholder=""
                        />
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-[10px] font-bold tracking-[0.3em] uppercase text-[#3D532D]/50">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-0 py-3 md:py-4 bg-transparent border-b border-[#3D532D]/20 focus:border-[#C5A059] outline-none text-[#3D532D] text-base md:text-xl font-serif transition-colors duration-300 placeholder:text-[#3D532D]/30 placeholder:italic"
                          placeholder=""
                        />
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-[10px] font-bold tracking-[0.3em] uppercase text-[#3D532D]/50">Your Message</label>
                      <textarea 
                        id="message" 
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 md:px-6 py-4 md:py-6 bg-white/70 backdrop-blur-sm border border-[#3D532D]/10 focus:border-[#C5A059] outline-none text-[#3D532D] text-base md:text-lg font-serif transition-colors duration-300 resize-y min-h-[180px] placeholder:text-[#3D532D]/30 placeholder:italic focus:ring-1 focus:ring-[#C5A059]/30"
                        placeholder=""
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-center">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="group inline-flex items-center gap-3 md:gap-4 px-8 md:px-12 py-3 md:py-5 bg-[#3D532D] hover:bg-[#2A3A1F] text-[#FAF9F6] font-bold text-[10px] uppercase tracking-[0.4em] transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed border border-[#3D532D] text-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                            <span className="hidden sm:inline">Sending Epistle...</span>
                            <span className="sm:hidden">Sending...</span>
                          </>
                        ) : (
                          <>
                            <span className="hidden sm:inline">Send Message</span>
                            <span className="sm:hidden">Send</span>
                            <ArrowRight size={14} className="text-[#C5A059] group-hover:translate-x-2 transition-transform duration-300" strokeWidth={2} />
                          </>
                        )}
                      </button>
                    </div>

                    {statusMessage ? (
                      <p className="text-center text-sm text-[#7A2E2E] font-serif">{statusMessage}</p>
                    ) : null}
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    className="flex flex-col items-center justify-center text-center py-12 md:py-20 px-4 md:px-6 relative z-10 h-full min-h-[400px]"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-24 h-24 border border-[#C5A059]/30 text-[#C5A059] rounded-full flex items-center justify-center mb-8 bg-white"
                    >
                      <BookOpen size={40} strokeWidth={1} />
                    </motion.div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#3D532D] mb-6 tracking-tight italic">Message Received</h3>
                    <p className="text-base md:text-xl text-[#3D532D]/80 font-serif font-light mb-12 max-w-md leading-relaxed">
                      Thank you for reaching out. Your epistle has been safely delivered to our bounds.
                    </p>
                    <ClassicDivider />
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="mt-8 px-6 md:px-8 py-3 md:py-4 text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold hover:text-[#3D532D] transition-colors duration-300 flex items-center gap-3 group"
                    >
                      <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform duration-300" /> 
                      Return to Form
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>


            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
