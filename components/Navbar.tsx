"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./ui/Logo";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      /* scroll handler for future use */
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    startTransition(() => {
      setMobileMenuOpen(false);
    });
  }, [pathname]);
  
  // Prevent unused variable warning
  void isPending;

  const navLinks = [
    { href: "/", label: "Home", numeral: "I" },
    { href: "/about", label: "About", numeral: "II" },
    { href: "/belong", label: "Belong", numeral: "III" },
    { href: "/resources", label: "Resources", numeral: "IV" },
    { href: "/contact", label: "Contact", numeral: "V" },
  ];

  return (
    <>
      <header
        className={`absolute top-0 inset-x-0 z-50 transition-all duration-700 border-b-4 border-brand bg-linear-to-r from-brand-bg/40 via-brand-bg/35 to-brand-bg/40 backdrop-blur-md bg-sacred-grid py-8 shadow-lg shadow-black/10`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between gap-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 group z-50 relative focus:outline-none shrink-0"
          >
            <Logo 
              className={`h-20 md:h-28 w-auto transition-all duration-700 group-hover:scale-105 text-[#3D532D]`} 
              variant="dark"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-14">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[12px] tracking-[0.15em] uppercase font-semibold transition-all relative group py-2 flex items-baseline gap-2.5 ${
                    isActive ? "text-[#3D532D]" : "text-[#3D532D]/70 hover:text-[#3D532D]"
                  }`}
                >
                  <span className={`font-serif tracking-normal text-[11px] font-bold ${isActive ? "text-brand" : "text-brand/60 group-hover:text-brand"} transition-colors duration-300`}>{link.numeral}.</span>
                  {link.label}
                    <span className={`absolute bottom-0 left-0 h-0.75 transition-all duration-500 ${
                      isActive ? "bg-brand w-full" : "bg-brand w-0 group-hover:w-full"
                    }`}
                    ></span>
                  {isActive && <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand rotate-45"></span>}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 relative p-3 -mr-3 text-[#3D532D] hover:text-brand transition-colors focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className={`relative w-12 h-12 flex items-center justify-center border-2 transition-all duration-300 ${mobileMenuOpen ? 'border-brand bg-brand-bg shadow-md shadow-brand/20' : 'border-[#3D532D]/30 bg-white shadow-[2px_2px_0_0_rgba(197,160,89,0.3)]'} rounded-md`}>
              <span className={`absolute h-0.5 w-5 ${mobileMenuOpen ? 'bg-brand' : 'bg-[#3D532D]'} transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45' : '-translate-y-2'
              }`} />
              <span className={`absolute h-0.5 w-5 ${mobileMenuOpen ? 'bg-brand' : 'bg-[#3D532D]'} transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`absolute h-0.5 w-5 ${mobileMenuOpen ? 'bg-brand' : 'bg-[#3D532D]'} transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45' : 'translate-y-2'
              }`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-0 bg-linear-to-b from-brand-bg/98 to-brand-bg/95 backdrop-blur-xl bg-sacred-grid z-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 border-[6px] border-brand m-4 pointer-events-none opacity-30 flex items-center justify-center">
             <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brand"></div>
             <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brand"></div>
             <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brand"></div>
             <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brand"></div>
             <div className="w-px h-full bg-[#3D532D]/5"></div>
             <div className="h-px w-full bg-[#3D532D]/5 absolute top-1/2"></div>
        </div>

        <div className="flex flex-col h-full justify-center px-12 pb-20 mt-10 relative z-10 max-w-md mx-auto">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand mb-12 border-b border-[#3D532D]/10 pb-6 w-full opacity-[0.8]">
             Index
          </h2>
          <nav className="flex flex-col gap-8 w-full">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <div 
                  key={link.href}
                  className="overflow-hidden border-b border-[#3D532D]/5 pb-4"
                >
                  <div
                    className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-end gap-6"
                    style={{ 
                      transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(100%)',
                      transitionDelay: mobileMenuOpen ? `${0.1 + index * 0.05}s` : '0s'
                    }}
                  >
                    <span className="text-xl font-serif font-bold text-brand opacity-70 mb-2">{link.numeral}.</span>
                    <Link
                      href={link.href}
                      className={`text-[42px] font-serif tracking-tight block ${
                        isActive ? "text-brand italic" : "text-[#3D532D] hover:text-brand"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </div>
                </div>
              );
            })}
          </nav>
          
          <div 
            className="mt-16 pt-10 text-center transition-all duration-700 delay-300 relative border border-[#3D532D]/10 bg-white p-6 shadow-[4px_4px_0_0_#C5A059]"
            style={{ 
              opacity: mobileMenuOpen ? 1 : 0,
              transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand mb-4">
              Direct Epistle
            </p>
            <a href="mailto:contact@intercessor.uk" className="text-[#3D532D] font-serif italic text-xl border-b border-brand/30 pb-1 hover:border-brand hover:text-brand transition-all">
              contact@intercessor.uk
            </a>
          </div>
        </div>
      </div>
    </>
  );
}