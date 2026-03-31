import AdminSidebar from "@/components/admin/AdminSidebar";
import { ReactNode } from "react";
import { Bell } from "lucide-react";

import { Logo } from "@/components/ui/Logo";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#FAF9F6] bg-sacred-grid overflow-hidden selection:bg-[#3D532D] selection:text-[#FAF9F6] font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Archival Top Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-10 bg-[#FAF9F6] border-b-[4px] border-[#C5A059] z-10 shrink-0 shadow-[0_10px_30px_-10px_rgba(61,83,45,0.05)] relative">
          <div className="absolute inset-0 bg-sacred-grid opacity-50 pointer-events-none"></div>
          
          <div className="md:hidden flex items-center z-10">
            <Logo className="w-[140px] h-[42px] brightness-0 opacity-90 relative z-10" />
          </div>

          <div className="flex items-center justify-end gap-6 relative z-10 ml-auto">
            <button aria-label="Notifications" className="relative p-3 border border-[#3D532D]/20 bg-white text-[#3D532D] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors shadow-[2px_2px_0_0_rgba(197,160,89,0.3)]">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C5A059] rotate-45 border border-[#FAF9F6]" />
            </button>
            <div className="w-10 h-10 border border-[#C5A059] bg-[#3D532D] flex items-center justify-center text-[#FAF9F6] font-serif text-lg shadow-[2px_2px_0_0_#C5A059] cursor-pointer hover:bg-[#2A3A1F] transition-colors relative">
               <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-[#C5A059]"></div>
               <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-[#C5A059]"></div>
              I
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
