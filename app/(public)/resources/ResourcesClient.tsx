"use client";

import { useState } from "react";
import Link from "next/link";
import { Event, Music, Character, Spotlight } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  BookOpen, 
  Headphones, 
  Calendar, 
  Search, 
  ArrowRight, 
  Info,
  Library,
  Play,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { resolvePublicDisclaimer } from "@/lib/public-site-content";

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string | null;
  coverImage: string | null;
  purchaseLink: string | null;
  purchaseLink2: string | null;
};

type Podcast = {
  id: string;
  name: string;
  host: string;
  description: string;
  category: string | null;
  coverImage: string | null;
  link: string | null;
  link2: string | null;
};

export type ResourceCollectionStatus =
  | "ready"
  | "empty"
  | "database_not_configured"
  | "database_error";

const filters = ["All", "Theology", "Spiritual Growth", "Study", "Devotional", "Relationships"];

function ResourceEmptyState({
  icon: Icon,
  title,
  message,
}: {
  icon: typeof BookOpen;
  title: string;
  message: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-dashed border-[#3D532D]/20 bg-white/50 py-20 text-center"
    >
      <div className="flex flex-col items-center justify-center">
        <Icon size={32} className="mb-4 text-[#3D532D]/20" strokeWidth={1} />
        <span className="mb-3 font-serif italic text-xl text-[#3D532D]/60">{title}</span>
        <p className="max-w-xl px-6 text-sm leading-7 text-[#3D532D]/55">{message}</p>
      </div>
    </motion.div>
  );
}

function getCollectionMessage(
  status: ResourceCollectionStatus,
  searchQuery: string,
  collectionName: "books" | "podcasts"
) {
  const hasSearch = searchQuery.trim().length > 0;

  if (status === "database_not_configured") {
    return {
      title: `${collectionName === "books" ? "Books" : "Podcasts"} will appear once the database is configured.`,
      message:
        "This section is now managed from the admin dashboard. Add a PostgreSQL DATABASE_URL, run your Prisma setup and seed, then publish content from admin.",
    };
  }

  if (status === "database_error") {
    return {
      title: `${collectionName === "books" ? "Books" : "Podcasts"} are temporarily unavailable.`,
      message:
        "The app could not read this content from the database. Check the database connection and Prisma setup, then refresh the page.",
    };
  }

  if (status === "empty") {
    return {
      title: `No ${collectionName} have been published yet.`,
      message:
        collectionName === "books"
          ? "Use the admin dashboard to add the first title, author, and purchase link."
          : "Use the admin dashboard to add the first podcast channel and link.",
    };
  }

  if (hasSearch) {
    return {
      title: `No ${collectionName} match that search.`,
      message:
        collectionName === "books"
          ? "Try another title or author name."
          : "Try another podcast name or host.",
    };
  }

  return {
    title: `No ${collectionName} are available right now.`,
    message: "Please check back soon.",
  };
}

export default function Resources({ initialBooks, initialPodcasts, initialMusic, booksStatus, podcastsStatus, disclaimer, spotlight, pageContents }: { initialBooks: Book[], initialPodcasts: Podcast[], initialMusic: Music[], booksStatus: ResourceCollectionStatus, podcastsStatus: ResourceCollectionStatus, disclaimer?: string | null, spotlight?: Spotlight | null, pageContents?: Record<string, string> }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = initialBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || (book.author || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || (book.category && book.category.includes(activeFilter));
    return matchesSearch && matchesFilter;
  });

  const filteredPodcasts = initialPodcasts.filter(podcast => {
    const matchesSearch = podcast.name.toLowerCase().includes(searchQuery.toLowerCase()) || (podcast.host || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || (podcast.category && podcast.category.includes(activeFilter));
    return matchesSearch && matchesFilter;
  });

  return (
    <div 
      className="min-h-screen text-[#3D532D] overflow-hidden relative selection:bg-[#C5A059]/20 selection:text-[#3D532D] pb-32 font-sans border-b border-[#3D532D]/10"
    >
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/field-with-dark-clouds.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      {/* Fixed Background Overlay Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#FCFAF5]/20 via-[#FCFAF5]/60 to-[#FCFAF5]/95" />
      
      {/* Subtle ethereal glow behind header */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl pt-32 relative z-10">
        
        {/* Dynamic Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-24 flex flex-col items-center pb-24 border-b border-[#3D532D]/10 relative"
        >
          {/* Architectural Background Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#3D532D] opacity-5 -z-10"></div>

          <motion.div variants={fadeIn} className="flex flex-col items-center mb-10 w-full">
            <div className="border border-[#3D532D]/20 p-2 relative inline-block bg-[#FAF9F6]/80 backdrop-blur-sm bg-sacred-grid">
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#C5A059]"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#C5A059]"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#C5A059]"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#C5A059]"></div>
              
              <div className="bg-[#3D532D] px-6 py-3 flex items-center gap-3">
                 <Library size={12} className="text-[#C5A059]"/>
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#FAF9F6]">
                   The Resource Library
                 </span>
              </div>
            </div>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] font-serif text-[#3D532D] mb-6 leading-[0.9] tracking-tight text-balance decoration-[#C5A059]/20 decoration-2 px-4 sm:px-0">
            Find Your <br className="hidden md:block"/> 
            <span className="italic font-light text-[#C5A059] relative">
              Path.
            </span>
          </motion.h1>
          
          <ClassicDivider />
        </motion.div>

        {/* Filters & Search Bar - Classic Index Styling */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col xl:flex-row justify-between items-center gap-6 mb-24 bg-[#FAF9F6]/80 backdrop-blur-md bg-sacred-grid border border-[#3D532D]/10 p-4 shadow-sm relative"
        >
          {/* Subtle corners for filter box */}
          <div className="absolute w-2 h-2 border-t border-l border-[#C5A059] top-2 left-2"></div>
          <div className="absolute w-2 h-2 border-b border-r border-[#C5A059] bottom-2 right-2"></div>

          {/* Tabs */}
          <div className="flex items-center gap-6 w-full xl:w-auto overflow-x-auto pb-4 xl:pb-0 border-b xl:border-none border-[#3D532D]/10 pl-6">
            {filters.map(filter => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-xs tracking-[0.2em] uppercase pb-2 transition-all font-bold ${isActive ? 'text-[#C5A059] border-b border-[#C5A059]' : 'text-[#3D532D]/40 hover:text-[#3D532D]'}`}
                >
                  {filter}
                </button>
              )
            })}
          </div>

          <div className="relative w-full xl:w-96 group px-4 xl:px-0 xl:mr-6">
            <div className="absolute inset-y-0 left-4 xl:left-0 flex items-center pointer-events-none">
              <Search size={16} className="text-[#C5A059]/60 group-focus-within:text-[#C5A059] transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search index..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-0 py-2 bg-transparent border-b border-[#3D532D]/10 text-[#3D532D] font-serif italic text-lg outline-none focus:border-[#C5A059] transition-all placeholder:text-[#3D532D]/30"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative">
          
          {/* Structural Vertical Divider */}
          <div className="absolute top-0 bottom-0 left-[66.666%] w-[1px] bg-[#3D532D]/10 hidden lg:block -ml-12"></div>

          {/* Left Column: Media Galleries (Span 8) */}
          <div className="lg:col-span-8 space-y-32 pr-0 lg:pr-8">
            
            {/* Books Section */}
            <section>
              <div className="flex flex-col mb-16 border-b border-[#3D532D]/10 pb-6 relative">
                 <div className="w-12 h-[2px] bg-[#C5A059] mb-6"></div>
                 <div className="flex items-center gap-4 text-[#C5A059]">
                    <BookOpen size={28} strokeWidth={1} />
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#3D532D] tracking-tight">For the readers</h2>
                 </div>
              </div>
              
              <AnimatePresence mode="popLayout">
                {filteredBooks.length > 0 ? (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {filteredBooks.map((book) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        key={book.title} 
                        className="group flex flex-col items-start relative p-8 bg-white/80 backdrop-blur-sm border border-[#3D532D]/10 hover:shadow-[0_20px_40px_-20px_rgba(40,46,34,0.15)] transition-all duration-500 hover:-translate-y-1"
                      >
                         {/* Vintage Corner Brackets */}
                        <div className="absolute w-4 h-4 border-t border-l border-[#C5A059] top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute w-4 h-4 border-b border-r border-[#C5A059] bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <h3 className="text-2xl font-serif text-[#3D532D] mb-3 leading-tight pr-8 group-hover:text-[#C5A059] transition-colors">{book.title}</h3>
                        {book.author && <p className="text-[#3D532D]/50 text-base font-light mb-6 font-serif italic border-l border-[#C5A059] pl-3">by {book.author}</p>}
                        
                        {book.description ? (
                          <p className="mb-8 flex-1 text-sm font-light leading-relaxed text-[#3D532D]/70">
                            {book.description}
                          </p>
                        ) : (
                          <div className="mb-8 flex-1" />
                        )}
                        
                        {book.purchaseLink ? (
                          <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#3D532D] text-[10px] uppercase tracking-[0.3em] font-bold group-hover:text-[#C5A059] transition-colors border-b border-[#3D532D]/20 pb-1 group-hover:border-[#C5A059]">
                            Find Book
                            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-[#3D532D]/30 text-[10px] uppercase tracking-[0.3em] font-bold border-b border-transparent pb-1">
                            Link Coming Soon
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <ResourceEmptyState
                    icon={BookOpen}
                    title={getCollectionMessage(booksStatus, searchQuery, "books").title}
                    message={getCollectionMessage(booksStatus, searchQuery, "books").message}
                  />
                )}
              </AnimatePresence>
            </section>

            {/* Podcasts Section */}
            <section>
              <div className="flex flex-col mb-16 border-b border-[#3D532D]/10 pb-6 relative">
                 <div className="w-12 h-[2px] bg-[#C5A059] mb-6"></div>
                 <div className="flex items-center gap-4 text-[#C5A059]">
                    <Headphones size={28} strokeWidth={1} />
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#3D532D] tracking-tight">Audio & Teaching</h2>
                 </div>
              </div>
              
              <AnimatePresence mode="popLayout">
                {filteredPodcasts.length > 0 ? (
                  <motion.div layout className="space-y-6">
                    {filteredPodcasts.map((podcast) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.6 }}
                        key={podcast.id} 
                        className={`group bg-white/80 backdrop-blur-sm p-6 md:p-8 border border-[#3D532D]/10 hover:border-[#C5A059]/40 hover:shadow-[0_15px_30px_-10px_rgba(40,46,34,0.1)] transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden ${podcast.link ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                         {/* Subtle left border accent on hover */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#C5A059] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

                        <div className="flex items-center gap-6 z-10">
                          <div className="flex gap-3">
                              {podcast.link && (
                                <a 
                                  href={podcast.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center px-5 h-11 rounded-full border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all duration-300 gap-2 shrink-0 font-serif text-sm tracking-wide"
                                >
                                  <Play size={14} fill="currentColor" />
                                  <span>YouTube</span>
                                </a>
                              )}
                              {podcast.link2 && (
                                <a 
                                  href={podcast.link2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center px-5 h-11 rounded-full border border-[#3D532D]/40 text-[#3D532D] hover:bg-[#3D532D] hover:text-white transition-all duration-300 gap-2 shrink-0 font-serif text-sm tracking-wide"
                                >
                                  <Headphones size={16} />
                                  <span>Spotify</span>
                                </a>
                              )}
                          </div>
                          <div>
                            <h3 className="text-xl md:text-2xl font-serif text-[#3D532D] group-hover:text-[#C5A059] transition-colors mb-2">{podcast.name}</h3>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-[#3D532D]/60 italic font-serif leading-relaxed text-sm">Hosted by {podcast.host}</span>
                            </div>
                            {podcast.description && (
                              <p className="text-[#3D532D]/70 text-sm font-light leading-relaxed mt-3 max-w-lg">
                                {podcast.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <ResourceEmptyState
                    icon={Headphones}
                    title={getCollectionMessage(podcastsStatus, searchQuery, "podcasts").title}
                    message={getCollectionMessage(podcastsStatus, searchQuery, "podcasts").message}
                  />
                )}
              </AnimatePresence>
            </section>

            {/* Music Section */}
            <section>
              <div className="flex flex-col mb-16 border-b border-[#3D532D]/10 pb-6 relative mt-32">
                 <div className="w-12 h-[2px] bg-[#C5A059] mb-6"></div>
                 <div className="flex items-center gap-4 text-[#C5A059]">
                    <Headphones size={28} strokeWidth={1} />
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#3D532D] tracking-tight">Update your playlist</h2>
                 </div>
                 {pageContents?.["playlist_commentary"] && (
                    <div className="mt-8 text-[#3D532D]/80 font-serif italic leading-relaxed text-xl max-w-4xl whitespace-pre-wrap border-l-2 border-[#C5A059] pl-6 py-2">
                      {pageContents["playlist_commentary"]}
                    </div>
                 )}
              </div>
              
              <AnimatePresence mode="popLayout">
                {initialMusic.length > 0 ? (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {initialMusic.map((track) => (
                      <motion.a 
                        href={track.link ? track.link : undefined}
                        target={track.link ? "_blank" : undefined}
                        rel={track.link ? "noopener noreferrer" : undefined}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        key={track.id} 
                        className="group flex flex-col items-start relative p-8 bg-white/80 backdrop-blur-sm border border-[#3D532D]/10 hover:shadow-[0_20px_40px_-20px_rgba(40,46,34,0.15)] transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                      >
                         {/* Vintage Corner Brackets */}
                        <div className="absolute w-4 h-4 border-t border-l border-[#C5A059] top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute w-4 h-4 border-b border-r border-[#C5A059] bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="w-12 h-12 rounded-full border border-[#3D532D]/20 flex items-center justify-center group-hover:bg-[#3D532D] group-hover:border-[#3D532D] transition-colors duration-500 mb-6 bg-[#FAF9F6] bg-sacred-grid">
                           <Play fill="currentColor" className="text-[#C5A059] group-hover:text-[#FAF9F6] ml-1 transition-colors duration-300" size={14} />
                        </div>

                        <h3 className="text-2xl font-serif text-[#3D532D] mb-3 leading-tight pr-8 group-hover:text-[#C5A059] transition-colors">{track.title}</h3>
                        <p className="text-[#3D532D]/50 text-base font-light mb-6 font-serif italic border-l border-[#C5A059] pl-3">by {track.artist}</p>
                        
                        <p className="text-sm text-[#3D532D]/70 leading-relaxed mb-8 flex-1 font-light">
                          {track.description || "A recommended track for your spiritual playlist."}
                        </p>
                      </motion.a>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-[#3D532D]/20 bg-white/50">
                    <Headphones size={32} className="text-[#3D532D]/20 mb-4" strokeWidth={1}/>
                    <span className="font-serif italic text-xl text-[#3D532D]/50">Playlist updating soon.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

          </div>

          {/* Right Column: Sidebar Panels (Span 4) */}
          <div className="lg:col-span-4 space-y-16 lg:mt-0 mt-16 relative">
            
            {/* Featured Spotlight Card */}
            {spotlight && (
              <motion.a
                href={spotlight.link || "#"}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="group flex flex-col items-start relative p-8 bg-white/80 backdrop-blur-sm border border-[#3D532D]/10 hover:shadow-[0_20px_40px_-20px_rgba(40,46,34,0.15)] transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              >
                {/* Vintage Corner Brackets */}
                <div className="absolute w-4 h-4 border-t border-l border-[#C5A059] top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute w-4 h-4 border-b border-r border-[#C5A059] bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {spotlight.image && (
                  <div className="w-full h-32 mb-6 rounded-sm overflow-hidden">
                    <img src={spotlight.image} alt={spotlight.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}

                <span className="inline-block px-3 py-1 border border-[#3D532D]/20 text-[8px] font-bold uppercase tracking-[0.2em] text-[#3D532D] mb-4 bg-[#C5A059]/10">
                  Featured
                </span>

                <h3 className="text-xl font-serif text-[#3D532D] mb-3 leading-tight pr-6 group-hover:text-[#C5A059] transition-colors">{spotlight.title}</h3>

                <p className="text-sm text-[#3D532D]/70 leading-relaxed mb-6 flex-1 font-light">
                  {spotlight.description}
                </p>

                {spotlight.link && (
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#3D532D] flex items-center gap-2 group-hover:text-[#C5A059] transition-colors border-b border-[#3D532D]/20 pb-1 group-hover:border-[#C5A059]">
                    Explore <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                )}
              </motion.a>
            )}
            

            {/* Themed Spotlight Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-[#3D532D]/90 backdrop-blur-md text-[#FAF9F6] p-10 md:p-12 relative overflow-hidden group shadow-xl border-t-[6px] border-[#C5A059]"
            >
               {/* Ornate corner for spotlight */}
               <div className="absolute w-6 h-6 border-b border-l border-[#C5A059]/30 bottom-4 left-4"></div>
               <div className="absolute w-6 h-6 border-b border-r border-[#C5A059]/30 bottom-4 right-4"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-12 border-b border-[#FAF9F6]/10 pb-4">
                  <span className="w-2 h-2 rotate-45 bg-[#C5A059]"></span>
                  <h2 className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.4em]">Editor&apos;s Selection</h2>
                </div>
                
                <div className="mb-14">
                  <h3 className="text-4xl md:text-5xl font-serif leading-[1.1] mb-6 text-[#FAF9F6]">
                    {pageContents?.["editor_selection_title"] || "David: A Man After God's Own Heart"}
                  </h3>
                  <p className="text-[#FAF9F6]/60 font-light leading-relaxed text-lg italic font-serif mb-8">
                    {pageContents?.["editor_selection_subtitle"] || "Exploring themes of deep repentance, overwhelming grace, and enduring faith."}
                  </p>

                  {pageContents?.["editor_selection_content"] && (
                    <div className="text-[#FAF9F6]/80 font-light leading-relaxed text-sm whitespace-pre-wrap border-t border-[#C5A059]/20 pt-8 mt-2">
                      {pageContents["editor_selection_content"]}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Music Spotlight Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="bg-[#FAF9F6] p-10 md:p-12 relative overflow-hidden group shadow-xl border border-[#3D532D]/10"
            >
              {/* Ornate corner for spotlight */}
              <div className="absolute w-4 h-4 border-t border-l border-[#C5A059]/40 top-4 left-4"></div>
              <div className="absolute w-4 h-4 border-b border-r border-[#C5A059]/40 bottom-4 right-4"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10 border-b border-[#3D532D]/10 pb-4">
                  <span className="w-2 h-2 rotate-45 bg-[#C5A059]"></span>
                  <h2 className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.4em]">Music Spotlight</h2>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-3xl md:text-4xl font-serif leading-[1.1] mb-4 text-[#3D532D]">
                    {pageContents?.["music_spotlight_title"] || "Oceans (Where Feet May Fail)"}
                  </h3>
                  <p className="text-[#C5A059] font-bold tracking-[0.2em] uppercase text-xs mb-8">
                    {pageContents?.["music_spotlight_subtitle"] || "Hillsong UNITED"}
                  </p>
                  
                  {pageContents?.["music_spotlight_content"] && (
                    <div className="text-[#3D532D]/70 font-light leading-relaxed text-sm whitespace-pre-wrap">
                      {pageContents["music_spotlight_content"]}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>


            {/* Disclaimer Mini Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="px-6 py-8 border-y border-[#3D532D]/20 text-[#3D532D]/80 flex gap-4 items-start bg-white/50"
            >
              <Info size={16} className="shrink-0 mt-0.5 opacity-80" strokeWidth={2} />
              <p className="text-[11px] leading-[1.9] tracking-[0.06em] font-medium max-w-sm text-[#3D532D]">
                {resolvePublicDisclaimer(disclaimer)}
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
