"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../ui/Logo";
import { LayoutDashboard, Star, Calendar, BookOpen, Headphones, Settings, FileText, LogOut, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";

const links = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Spotlight", href: "/admin/spotlight", icon: Star },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Books", href: "/admin/books", icon: BookOpen },
  { name: "Podcasts", href: "/admin/podcasts", icon: Headphones },
  { name: "Music", href: "/admin/music", icon: Headphones },
  { name: "Characters", href: "/admin/characters", icon: BookOpen },
  { name: "Pages", href: "/admin/pages", icon: FileText },
  { name: "Disclaimers & Legal", href: "/admin/disclaimers", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-[#FAF9F6] h-screen hidden md:flex flex-col justify-between sticky top-0 shadow-[4px_0_0_0_#C5A059] z-20 shrink-0 border-r-[4px] border-[#3D532D]">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 pb-4">
          <Link href="/" className="flex flex-col items-start gap-2 group">
            <Logo className="h-16 md:h-20 w-auto transition-transform group-hover:scale-[1.02]" />
            <span className="text-[9px] text-[#3D532D]/60 uppercase tracking-[0.3em] font-bold mt-1">Admin Portal</span>
          </Link>
        </div>
        
        <div className="px-6 py-8 mt-4 border-t-2 border-[#3D532D]/10 relative">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold mb-6 px-2">Record Management</p>
          <nav className="flex flex-col">
            {links.map((link) => {
              // Ensure we don't accidentally match /admin for all pages
              const isActive = link.href === "/admin" 
                ? pathname === "/admin" 
                : pathname.startsWith(link.href);
                
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-4 text-sm font-medium transition-all group border-b border-[#3D532D]/5 last:border-0 ${
                    isActive 
                    ? "bg-[#3D532D] text-[#FAF9F6] border-l-[4px] border-l-[#C5A059] -ml-[4px] pl-[16px]" 
                    : "text-[#3D532D]/70 hover:bg-[#3D532D]/5 hover:text-[#3D532D] hover:pl-5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <link.icon size={16} className={`${isActive ? "text-[#C5A059]" : "text-[#3D532D] group-hover:text-[#C5A059]"} transition-colors`} strokeWidth={isActive ? 2 : 1.5} />
                    <span className="tracking-wide uppercase text-xs">{link.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-[#C5A059]" />}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      
      <div className="p-6 border-t-[4px] border-[#3D532D]/10">
        <div className="bg-white p-2 border border-[#3D532D]/20 shadow-[2px_2px_0_0_#C5A059]">
          <button 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold text-red-700 hover:bg-red-50 hover:text-red-900 transition-all border border-transparent hover:border-red-200"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut size={16} strokeWidth={2}/>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
