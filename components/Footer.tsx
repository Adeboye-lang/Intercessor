"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "./ui/Logo";
import { resolvePublicDisclaimer } from "@/lib/public-site-content";

// Enhanced Classic Divider Motif for Footer
const FooterDivider = () => (
  <div className="flex items-center justify-center gap-6 w-full opacity-40 mb-12 mt-6">
    <div className="flex-1 h-[1px] bg-[#3D532D]"></div>
    <div className="w-16 h-[1px] bg-[#C5A059]"></div>
    <div className="w-3 h-3 rotate-45 border border-[#C5A059] flex items-center justify-center">
      <div className="w-1 h-1 bg-[#3D532D]"></div>
    </div>
    <div className="w-16 h-[1px] bg-[#C5A059]"></div>
    <div className="flex-1 h-[1px] bg-[#3D532D]"></div>
  </div>
);

export default function Footer({
  globalData,
  footerDisclaimer,
  legalLinks = [],
}: {
  globalData?: Record<string, string>;
  footerDisclaimer?: string | null;
  legalLinks?: Array<{ href: string; label: string }>;
}) {
  const currentYear = new Date().getFullYear();
  const resolvedFooterDisclaimer = resolvePublicDisclaimer(footerDisclaimer);

  return (
    <footer className="text-[#3D532D] border-t-[8px] border-[#C5A059] relative overflow-hidden font-sans bg-[#FAF9F6]">

      <div className="container mx-auto px-6 md:px-12 pt-16 pb-8 relative z-10 max-w-7xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          {/* Left Column: Brand & Nav */}
          <div className="lg:col-span-6 flex flex-col items-start lg:pr-12">
            <Link href="/" className="mb-12 inline-block">
              <Logo className="h-20 md:h-24 w-auto text-[#3D532D]" variant="dark" />
            </Link>
            
            <nav className="flex flex-col w-full">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] mb-6 border-b border-[#3D532D]/10 pb-4 pr-12 w-fit">
                Navigation
              </h3>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { name: 'Home', numeral: 'I' },
                  { name: 'About', numeral: 'II' },
                  { name: 'Belong', numeral: 'III' },
                  { name: 'Resources', numeral: 'IV' },
                  { name: 'Contact', numeral: 'V' }
                ].map((item) => {
                  const href = item.name === 'Home' ? '/' : `/${item.name.toLowerCase()}`;
                  return (
                  <li key={item.name}>
                    <Link href={href} className="group flex items-baseline gap-3">
                      <span className="text-[9px] font-serif font-bold text-[#C5A059] opacity-60 w-3 text-right">{item.numeral}.</span>
                      <span className="text-[#3D532D] font-serif text-base hover:text-[#C5A059] hover:italic transition-all relative">
                        {item.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                )})}
              </ul>
            </nav>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Right Column: Contact Information */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end w-full pt-6 lg:pt-0">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] mb-6 border-b border-[#3D532D]/10 pb-2 pr-12 lg:pr-0 lg:pl-12 w-fit text-left lg:text-right ml-0 lg:ml-auto">
              Contact
            </h3>
            
            <div className="w-full">
              <a href={`mailto:${globalData?.contact_email || "contact@intercessor.uk"}`} className="group relative flex flex-col gap-2 text-[#3D532D]/70 bg-white/80 backdrop-blur-sm p-4 border border-[#3D532D]/10 shadow-[6px_6px_0_0_#C5A059] hover:shadow-[8px_8px_0_0_#C5A059] hover:-translate-y-1 transition-all duration-300 ml-0 lg:ml-auto max-w-xs mt-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FAF9F6] p-3 border border-[#3D532D]/10 group-hover:bg-[#C5A059] group-hover:text-white transition-colors rounded-full text-[#3D532D]">
                    <Mail size={16} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[#3D532D] font-bold text-[10px] uppercase tracking-[0.2em] mb-0 hidden sm:block">Email</h3>
                </div>
                <div className="border-b border-[#3D532D]/10 pb-2 w-full"></div>
                <span className="font-serif italic text-base text-[#3D532D] group-hover:text-[#C5A059] transition-colors break-all mt-1">{globalData?.contact_email || "contact@intercessor.uk"}</span>
              </a>
            </div>
          </div>
        </div>

        <FooterDivider />

        {/* Bottom Bar */}
        <div className="flex flex-col gap-8 pt-4 border-[#3D532D]/10 text-[10px] font-bold tracking-[0.3em] uppercase text-[#3D532D]/50 items-center text-center">
          {legalLinks.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-10">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-[#C5A059] transition-colors flex items-center gap-3">
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
          
          <div className="flex flex-col items-center gap-4 w-full border-t border-[#3D532D]/5 pt-8">
            <p>
              &copy; {currentYear} INTERCESSOR. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[#3D532D]/45 max-w-3xl mx-auto text-[9px] md:text-[10px] tracking-[0.12em] leading-[2] font-normal font-serif">
              {resolvedFooterDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
