import { Calendar, BookOpen, Headphones, Star, ArrowUpRight, Plus, Activity } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { hasValidPostgresDatabaseUrl } from "@/lib/database-url";

export const revalidate = 0;

export default async function AdminDashboard() {
  let eventCount = 0;
  let bookCount = 0;
  let podcastCount = 0;
  let spotlightCount = 0;
  let recentEvents: Array<{ title: string; createdAt: Date }> = [];
  let recentPodcasts: Array<{ name: string; createdAt: Date }> = [];

  if (hasValidPostgresDatabaseUrl()) {
    try {
      [eventCount, bookCount, podcastCount, spotlightCount, recentEvents] = await Promise.all([
        prisma.event.count(),
        prisma.book.count(),
        prisma.podcast.count(),
        prisma.spotlight.count(),
        prisma.event.findMany({ orderBy: { createdAt: "desc" }, take: 2, select: { title: true, createdAt: true } })
      ]);

      recentPodcasts = await prisma.podcast.findMany({ orderBy: { createdAt: "desc" }, take: 2, select: { name: true, createdAt: true } });
    } catch (error) {
      console.warn("Dashboard data unavailable; rendering fallback metrics.", error);
    }
  }

  const latestActivity = [
    ...recentEvents.map((e) => ({ title: `Event: ${e.title}`, date: e.createdAt, type: "event" })),
    ...recentPodcasts.map((p) => ({ title: `Podcast: ${p.name}`, date: p.createdAt, type: "podcast" }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-end mb-14 border-b-[2px] border-[#3D532D]/10 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif text-[#3D532D] mb-4">Archival Overview</h1>
          <p className="text-[#3D532D]/70 text-lg font-serif italic max-w-xl">Welcome back. The state of your ministries and recent records are detailed below.</p>
        </div>
        <Link href="/admin/events" className="hidden md:flex items-center gap-3 bg-[#3D532D] text-[#FAF9F6] px-6 py-4 border border-[#C5A059] text-sm uppercase tracking-widest font-bold hover:bg-[#2A3A1F] transition-all shadow-[4px_4px_0_0_#C5A059] hover:shadow-[6px_6px_0_0_#C5A059] hover:-translate-y-0.5 group">
          <Plus size={18} className="text-[#C5A059] group-hover:rotate-90 transition-transform" /> New Entry
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-8 border border-[#3D532D]/20 shadow-[4px_4px_0_0_#C5A059] hover:shadow-[8px_8px_0_0_#C5A059] transition-all flex flex-col justify-between group relative h-48">
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]/40"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]/40"></div>
          
          <div className="flex justify-between items-start w-full relative z-10">
            <div className="w-12 h-12 bg-[#FAF9F6] border border-[#3D532D]/20 flex items-center justify-center text-[#3D532D] group-hover:bg-[#C5A059] group-hover:text-white group-hover:border-[#C5A059] transition-colors shadow-sm">
              <Star size={20} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">Spotlights</p>
          </div>
          <p className="text-4xl font-serif text-[#3D532D] mt-auto relative z-10">{spotlightCount}</p>
        </div>

        <div className="bg-white p-8 border border-[#3D532D]/20 shadow-[4px_4px_0_0_#C5A059] hover:shadow-[8px_8px_0_0_#C5A059] transition-all flex flex-col justify-between group relative h-48">
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]/40"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]/40"></div>
          
          <div className="flex justify-between items-start w-full relative z-10">
            <div className="w-12 h-12 bg-[#FAF9F6] border border-[#3D532D]/20 flex items-center justify-center text-[#3D532D] group-hover:bg-[#C5A059] group-hover:text-white group-hover:border-[#C5A059] transition-colors shadow-sm">
              <Calendar size={20} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">Events</p>
          </div>
          <p className="text-4xl font-serif text-[#3D532D] mt-auto relative z-10">{eventCount}</p>
        </div>

        <div className="bg-white p-8 border border-[#3D532D]/20 shadow-[4px_4px_0_0_#C5A059] hover:shadow-[8px_8px_0_0_#C5A059] transition-all flex flex-col justify-between group relative h-48">
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]/40"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]/40"></div>
          
          <div className="flex justify-between items-start w-full relative z-10">
            <div className="w-12 h-12 bg-[#FAF9F6] border border-[#3D532D]/20 flex items-center justify-center text-[#3D532D] group-hover:bg-[#C5A059] group-hover:text-white group-hover:border-[#C5A059] transition-colors shadow-sm">
              <BookOpen size={20} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">Books</p>
          </div>
          <p className="text-4xl font-serif text-[#3D532D] mt-auto relative z-10">{bookCount}</p>
        </div>

        <div className="bg-white p-8 border border-[#3D532D]/20 shadow-[4px_4px_0_0_#C5A059] hover:shadow-[8px_8px_0_0_#C5A059] transition-all flex flex-col justify-between group relative h-48">
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]/40"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]/40"></div>
          
          <div className="flex justify-between items-start w-full relative z-10">
            <div className="w-12 h-12 bg-[#FAF9F6] border border-[#3D532D]/20 flex items-center justify-center text-[#3D532D] group-hover:bg-[#C5A059] group-hover:text-white group-hover:border-[#C5A059] transition-colors shadow-sm">
              <Headphones size={20} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">Podcasts</p>
          </div>
          <p className="text-4xl font-serif text-[#3D532D] mt-auto relative z-10">{podcastCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="bg-white border-2 border-[#3D532D]/20 p-10 lg:col-span-2 relative">
          <div className="absolute top-0 right-10 w-8 h-full bg-[#FAF9F6] border-x border-[#3D532D]/5 pointer-events-none -z-10"></div>
          
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#3D532D]/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-[#C5A059] bg-[#FAF9F6] flex items-center justify-center text-[#C5A059]">
                <Activity size={18} />
              </div>
              <h2 className="text-2xl font-serif text-[#3D532D]">Recent Activity</h2>
            </div>
            <Link href="/admin/spotlight" className="text-[10px] text-[#3D532D] font-bold uppercase tracking-[0.2em] border-b border-[#3D532D] hover:text-[#C5A059] hover:border-[#C5A059] flex items-center gap-2 transition-all pb-1">
              View Register <ArrowUpRight size={14} />
            </Link>
          </div>
          
          {latestActivity.length > 0 ? (
            <div className="space-y-4 relative z-10">
              {latestActivity.map((activity, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-[#FAF9F6] border border-[#3D532D]/10 group hover:border-[#C5A059] transition-all hover:shadow-[4px_4px_0_0_rgba(61,83,45,0.05)]">
                  <div className="flex items-center gap-6">
                    <div className={`w-3 h-3 rotate-45 border ${activity.type === "event" ? "border-[#C5A059] bg-[#C5A059]" : "border-[#3D532D] bg-[#3D532D]"} shadow-sm`}/>
                    <span className="text-[#3D532D] font-serif text-xl group-hover:italic transition-colors">{activity.title}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#3D532D]/60 whitespace-nowrap">{new Date(activity.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-24 border border-[#3D532D]/10 bg-[#FAF9F6] relative z-10 flex flex-col items-center justify-center">
               <div className="w-16 h-[1px] bg-[#C5A059] mb-6"></div>
               <p className="text-xl font-serif text-[#3D532D] italic mb-3">No activity recorded.</p>
               <p className="text-sm font-sans uppercase tracking-widest text-[#3D532D]/50">Records added to the platform will appear here.</p>
               <div className="w-16 h-[1px] bg-[#C5A059] mt-6"></div>
            </div>
          )}
        </div>

        <div className="bg-[#3D532D] border-t-[8px] border-[#C5A059] text-white p-10 shadow-[8px_8px_0_0_#C5A059] relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute inset-0 bg-sacred-grid opacity-20 pointer-events-none mix-blend-overlay"></div>
          
          <div className="relative z-10 mb-12">
            <h2 className="text-3xl font-serif text-[#FAF9F6] mb-4 pb-4 border-b border-white/10 leading-tight">Administrative<br/>Actions</h2>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] block">Quick Links</span>
          </div>
          
          <div className="space-y-4 relative z-10 flex flex-col mt-auto">
            <Link href="/admin/spotlight" className="flex items-center justify-between p-5 bg-white/5 hover:bg-[#C5A059] border border-white/20 hover:border-[#C5A059] transition-all group/btn text-[#FAF9F6]">
              <span className="font-serif italic text-lg tracking-wide">Update Spotlight</span>
              <div className="w-8 h-8 border border-white/30 group-hover/btn:border-white/80 group-hover/btn:bg-white flex items-center justify-center transition-all bg-transparent">
                <ArrowUpRight size={16} className="text-[#FAF9F6] group-hover/btn:text-[#3D532D]" />
              </div>
            </Link>
            <Link href="/admin/podcasts" className="flex items-center justify-between p-5 bg-white/5 hover:bg-[#C5A059] border border-white/20 hover:border-[#C5A059] transition-all group/btn text-[#FAF9F6]">
              <span className="font-serif italic text-lg tracking-wide">Publish Podcast</span>
              <div className="w-8 h-8 border border-white/30 group-hover/btn:border-white/80 group-hover/btn:bg-white flex items-center justify-center transition-all bg-transparent">
                <ArrowUpRight size={16} className="text-[#FAF9F6] group-hover/btn:text-[#3D532D]" />
              </div>
            </Link>
            <Link href="/admin/events" className="flex items-center justify-between p-5 bg-white/5 hover:bg-[#C5A059] border border-white/20 hover:border-[#C5A059] transition-all group/btn text-[#FAF9F6]">
              <span className="font-serif italic text-lg tracking-wide">Schedule Event</span>
              <div className="w-8 h-8 border border-white/30 group-hover/btn:border-white/80 group-hover/btn:bg-white flex items-center justify-center transition-all bg-transparent">
                <ArrowUpRight size={16} className="text-[#FAF9F6] group-hover/btn:text-[#3D532D]" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}