"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { ArrowRight, Play, Pause, Heart, ArrowUpRight, X, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Beat {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  audio_url: string;
  art_url?: string;
  duration?: string;
}

export default function Home() {
  const [demos, setDemos] = useState<Beat[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Audio State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function initHome() {
      try {
        setLoading(true);
        // Fetch up to 3 featured beats and projects in parallel
        const [beatsRes, projectsRes] = await Promise.all([
          supabase.from('beats').select('id, title, genre, bpm').eq('is_featured', true).limit(3),
          supabase.from('projects').select('*').order('date', { ascending: false }).limit(3)
        ]);

        if (beatsRes.data) setDemos(beatsRes.data as Beat[]);
        if (projectsRes.data) setFeaturedProjects(projectsRes.data);
      } catch (err) {
        console.error("Critical home data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    
    initHome();
  }, []);

  return (
    <>
      <Header />
      <main className="pt-12 md:pt-20 pb-24 md:pb-32 min-h-screen debug-grid overflow-x-hidden">
        {/* --- Hero Section --- */}
        <section className="px-4 md:px-12 pt-4 md:pt-12 pb-16 md:pb-24 border-b-4 border-primary">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-12">
            <div className="flex-1 w-full">
              {/* Tag - Hidden on mobile */}
              <p className="hidden md:block font-headline text-[0.6rem] md:text-[0.6875rem] tracking-[0.2em] md:tracking-[0.3em] text-outline mb-3 md:mb-4 uppercase">
                PREMIUM_SOUND_RESOURCES / 2024
              </p>
              {/* Title - Hidden on mobile */}
              <h2 className="hidden md:block font-headline text-[4rem] leading-[0.85] md:text-7xl lg:text-[9.5rem] font-black md:leading-[0.8] tracking-tighter uppercase text-primary break-words whitespace-pre-line">
                PREMIUM_
                BEATS_FOR_
                ARTISTS_
              </h2>
            </div>
            <div className="w-full md:w-[40%] flex flex-col gap-6">
              <p className="text-sm text-on-surface-variant max-w-full md:max-w-xs leading-relaxed border-l-2 border-primary pl-4">
                High-quality instrumentals for your next hit. Industry standard sound design and professional licensing for independent artists.
              </p>
              <Link 
                href="/catalog" 
                className="group flex items-center justify-between bg-primary text-on-primary p-4 md:p-6 cursor-pointer hover:bg-surface-container-highest hover:text-primary transition-colors duration-100"
              >
                <span className="font-headline font-bold uppercase tracking-widest text-sm md:text-base">
                 Visit_LuxBeatz_Store
                </span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            </div>
          </div>
        </section>

        {/* --- Demo Beats Section --- */}
        <section className="px-4 md:px-12 py-12 md:py-24 border-b-2 border-outline-variant">
          <div className="flex justify-between items-end mb-8 md:mb-12 border-b-2 border-zinc-800 pb-4">
            <div>
              <h3 className="font-headline text-2xl md:text-5xl font-black uppercase tracking-tighter italic">DEMO_BEATS</h3>
              <p className="font-mono text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 md:mt-2 line-clamp-1">PREVIEW_SYSTEM // STREAM_ACTIVE</p>
            </div>
            <span className="font-mono text-xs text-outline underline cursor-pointer hidden md:block">VIEW_ALL_STOCKS</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 md:gap-6">
            {loading ? (
                <div className="col-span-3 py-10 md:py-20 flex items-center justify-center bg-zinc-950 border border-zinc-900 border-dashed">
                    <p className="font-mono text-[8px] md:text-xs uppercase tracking-[0.4em] animate-pulse">Establishing_Stream_Connection...</p>
                </div>
            ) : demos.length > 0 ? (
                demos.map((demo, index) => (
                    <div key={demo.id} className="group relative bg-zinc-900/50 border border-zinc-800 md:border-2 p-2 md:p-6 hover:border-zinc-50 transition-all flex flex-col gap-2 md:gap-6">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[6px] md:text-[10px] bg-zinc-800 text-zinc-400 px-1.5 md:px-2 py-0.5 md:py-1">
                            { (index + 1).toString().padStart(2, '0') }
                        </span>
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-mono text-[5px] md:text-[8px] text-zinc-600 uppercase hidden md:block">GENRE: {demo.genre}</span>
                          <span className="font-mono text-[5px] md:text-[8px] text-zinc-600 uppercase">BPM: {demo.bpm}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-headline text-[9px] md:text-3xl font-black uppercase tracking-tighter leading-none group-hover:text-primary transition-colors truncate">
                          {demo.title}
                        </h4>
                        <div className="mt-2 md:mt-4 flex items-center gap-2 md:gap-4">
                           <button 
                                onClick={() => {
                                    if (playingId === demo.id) {
                                        audioRef.current?.pause();
                                        setPlayingId(null);
                                    } else {
                                        if (audioRef.current) audioRef.current.pause();
                                        audioRef.current = new Audio(demo.audio_url);
                                        audioRef.current.play();
                                        setPlayingId(demo.id);
                                        audioRef.current.onended = () => setPlayingId(null);
                                    }
                                }}
                                className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                                    playingId === demo.id ? "bg-primary text-zinc-50" : "bg-zinc-50 text-zinc-950 hover:bg-primary hover:text-zinc-50"
                                }`}
                            >
                               {playingId === demo.id ? <Pause className="w-4 h-4 md:w-6 md:h-6" /> : <Play className="w-4 h-4 md:w-6 md:h-6 fill-current" />}
                           </button>
                           <div className="flex-1 h-[1px] md:h-[2px] bg-zinc-800 relative overflow-hidden hidden md:block">
                              <div className="absolute inset-x-0 inset-y-0 bg-primary/20 animate-pulse"></div>
                           </div>
                        </div>
                      </div>
      
                      <div className="flex justify-between items-center pt-2 md:pt-4 border-t border-zinc-800">
                        <span className="font-mono text-[6px] md:text-[10px] text-zinc-500">DYNAMIC_SRC</span>
                        <button className="md:hidden text-zinc-400 hover:text-primary transition-colors">
                          <Heart className="w-3 h-3" strokeWidth={3} />
                        </button>
                        <button className="hidden md:block group/like flex items-center gap-2 border border-zinc-800 px-3 py-1 hover:border-zinc-50 transition-all">
                          <Heart className="w-3 h-3 group-hover/like:text-primary transition-colors" strokeWidth={3} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">LIKE</span>
                        </button>
                      </div>
                    </div>
                  ))
            ) : (
                <div className="col-span-3 py-10 md:py-20 flex flex-col items-center justify-center bg-zinc-950 border border-zinc-900 border-dashed">
                    <p className="font-mono text-[8px] md:text-xs uppercase tracking-[0.2em] text-zinc-700">No_Demo_Assets_Identified</p>
                </div>
            )}
          </div>
        </section>

        {/* --- Top Projects Section --- */}
        <section className="px-4 md:px-12 py-12 md:py-24 border-b-2 border-outline-variant bg-zinc-900/10">
          <div className="flex justify-between items-end mb-8 md:mb-12 border-b-2 border-zinc-800 pb-4">
            <div>
              <h3 className="font-headline text-2xl md:text-5xl font-black uppercase tracking-tighter italic">TOP_PROJECTS</h3>
              <p className="font-mono text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-[0.3em] mt-1">ARCHIVAL_SELECTION // HIT_RECORDS</p>
            </div>
            <Link href="/projects" className="font-mono text-[10px] text-outline underline cursor-pointer uppercase">View_All</Link>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-8">
            {loading ? (
                [...Array(3)].map((_, i) => (
                    <div key={i} className="aspect-square bg-zinc-900 animate-pulse border border-zinc-800"></div>
                ))
            ) : featuredProjects.map((project) => (
                <div 
                    key={project.id} 
                    onClick={() => setSelectedProject(project)}
                    className="group flex flex-col gap-1 md:gap-4 relative cursor-pointer"
                >
                    <div className="relative aspect-square bg-zinc-950 overflow-hidden border border-zinc-800 group-hover:border-primary transition-all duration-300">
                        <img 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                            src={project.image_url}
                            alt={project.title}
                        />
                        <div className="absolute inset-x-0 bottom-0 py-2 md:py-4 px-2 md:px-6 bg-gradient-to-t from-black to-transparent">
                            <h4 className="font-headline text-[9px] md:text-2xl font-black uppercase text-zinc-50 tracking-tighter truncate leading-none">
                                {project.title}
                            </h4>
                            <div className="flex justify-between items-center opacity-70 mt-1">
                                <span className="font-mono text-[6px] md:text-[10px] text-zinc-400 uppercase tracking-tighter">{project.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </section>
        <section className="px-4 md:px-12 py-10 md:py-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-6 md:mb-16 gap-4">
            <h2 className="font-headline text-2xl md:text-5xl font-black uppercase tracking-tighter">
              LATEST_UPDATES
            </h2>
            <span className="font-mono text-[10px] md:text-xs text-outline underline cursor-pointer">[ VIEW_ALL_POSTS ]</span>
          </div>
          
          {/* Slidable container for mobile, Grid for desktop */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-0 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory">
            {/* Log Entry 1 */}
            <div className="min-w-[85vw] md:min-w-0 border-2 border-outline-variant p-4 md:p-8 group hover:border-primary transition-colors bg-surface-container-low snap-center">
              <div className="aspect-[21/9] md:aspect-video bg-surface mb-4 md:mb-6 overflow-hidden">
                <img alt="Mixing console" className="w-full h-full object-cover grayscale contrast-150 brightness-75 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_NhBClZMSLXyFKSBKea52elSRK21OJbXyJQlu_ESbEr07zdXVu7KlgBWFbCRwKOzs-aaITaGQ5VGIje_1886FISNpq2ixwYj8L_mupOTgpdH6ROrpK_JbmHgy98AhEezEZ6yy9pzgfQkCSoaOtqgaT73Q1m8quoNvCG2IVrOEE0pkhS90mD2nca5pDDuikRRIxPdB1JvfEGejSmzmcFixm-bgn24l-KCKuZcad3ew-VcWctOWyPbByP4rk57RzJMsmqaMYcciukA"/>
              </div>
              <div className="flex justify-between items-start mb-2 md:mb-4">
                <span className="font-mono text-[8px] md:text-[10px] bg-primary text-on-primary px-2 py-0.5 md:py-1 uppercase">TUTORIAL</span>
                <span className="font-mono text-[8px] md:text-[10px] text-outline">2024.10.12</span>
              </div>
              <h4 className="font-headline text-lg md:text-2xl font-bold uppercase mb-2 md:mb-4 group-hover:text-primary transition-colors">DRUM_PROCESSING</h4>
              <p className="text-[10px] md:text-sm text-on-surface-variant mb-4 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">A simple walkthrough of how we process our hard-hitting kicks and snares.</p>
              <div className="pt-2 md:pt-4 border-t border-outline-variant flex justify-between items-center">
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">READ_ARTICLE</span>
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
            
            {/* Log Entry 2 */}
            <div className="min-w-[85vw] md:min-w-0 border-2 border-outline-variant border-l-0 md:border-l-0 md:border-t-2 p-4 md:p-8 group hover:border-primary transition-colors bg-surface-container-low md:border-l-0 snap-center">
              <div className="aspect-[21/9] md:aspect-video bg-surface mb-4 md:mb-6 overflow-hidden">
                <img alt="Reel to reel" className="w-full h-full object-cover grayscale contrast-150 brightness-75 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNSL-EO87Ki8QEsSFlSmmNR-f96avl0e_6rfenj4vMjJUpHVwR3Hm5D0JhmH_zBtmR7fIsNXQR_0FNkuzWBoQsuvVm1SYguKBHFswuBn79OkpyQPj2d8AkIXZN4FlSeKgizLbd882BlDgYSgFe2jLME5MN5qlTwsnl-0JK9PZBzTclQuGcdeUyErMQjvtxARMH5n5n_9NY9Wr5ZlzuQsolspZyXBYhmfI_XeWeb3VCicf1weQilaiGbEAdeHqP9daWMBrYKEA_b2o"/>
              </div>
              <div className="flex justify-between items-start mb-2 md:mb-4">
                <span className="font-mono text-[8px] md:text-[10px] bg-primary text-on-primary px-2 py-0.5 md:py-1 uppercase">TECH_TIPS</span>
                <span className="font-mono text-[8px] md:text-[10px] text-outline">2024.10.05</span>
              </div>
              <h4 className="font-headline text-lg md:text-2xl font-bold uppercase mb-2 md:mb-4 group-hover:text-primary transition-colors">ANALOG_POWER</h4>
              <p className="text-[10px] md:text-sm text-on-surface-variant mb-4 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">Why we use hardware gear to give your beats that warm industrial edge.</p>
              <div className="pt-2 md:pt-4 border-t border-outline-variant flex justify-between items-center">
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">READ_ARTICLE</span>
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
            
            {/* Log Entry 3 */}
            <div className="min-w-[85vw] md:min-w-0 border-2 border-outline-variant border-l-0 lg:border-l-0 md:border-t-0 p-4 md:p-8 group hover:border-primary transition-colors bg-surface-container-low md:border-t-0 lg:border-l-0 snap-center">
              <div className="aspect-[21/9] md:aspect-video bg-surface mb-4 md:mb-6 overflow-hidden">
                <img alt="Audio cables" className="w-full h-full object-cover grayscale contrast-150 brightness-75 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjRXmxPg9YVuZDWMqf_yphu0CfFDNTzLU4Uzzqal-fCXWTVzIudgKUrCRyMMy8JKXqWn4FDOo9uF307XT7uig8_VI0E1dxmyAafoXNHKsDs5J8y1E0vQAwoXfLpWhx3yqfkys98ucDuP70SRUUCm4QIm4YonIesEU78tjPdc5pSIzuqpTyK-zcBjCFMS5PlrztbTS-QI7Ti25KowNSp8VXR3CMYf5KfbBuO3vncQUYdZzZtLgAaX0XtTdZNVPQy3-fEEsBfmeFW4w"/>
              </div>
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[8px] md:text-[10px] bg-primary text-on-primary px-2 py-0.5 md:py-1 uppercase">BEHIND_SCENES</span>
                <span className="font-mono text-[8px] md:text-[10px] text-outline">2024.09.28</span>
              </div>
              <h4 className="font-headline text-lg md:text-2xl font-bold uppercase mb-2 md:mb-4 group-hover:text-primary transition-colors">NEW_WAV_PACK</h4>
              <p className="text-[10px] md:text-sm text-on-surface-variant mb-4 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">We're collecting new samples from the city's depths. Get ready.</p>
              <div className="pt-2 md:pt-4 border-t border-outline-variant flex justify-between items-center">
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">READ_ARTICLE</span>
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
          </div>
        </section>

        {/* --- Newsletter --- */}
        <section className="px-4 md:px-12 py-16 md:py-32 bg-primary text-on-primary">
          <div className="max-w-4xl">
            <h3 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-none break-words">
              GET_SAMPLES
            </h3>
            <p className="text-lg md:text-xl mb-8 md:mb-12 font-medium">
              Sign up to receive exclusive beats and production tips straight to your inbox.
            </p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
              <input
                className="flex-1 bg-transparent border-2 md:border-4 border-on-primary p-4 md:p-6 text-on-primary placeholder:text-on-primary/50 focus:ring-0 focus:outline-none font-mono text-base md:text-xl"
                placeholder="ENTER_EMAIL_ADDRESS"
                type="email"
              />
              <button className="bg-on-primary text-primary px-8 md:px-12 py-4 md:py-6 font-headline font-black text-lg md:text-xl hover:invert transition-all">
                JOIN_NOW
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* --- Project Detail Overlay --- */}
      {selectedProject && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-[fadeIn_0.3s_ease-out]"
            onClick={() => setSelectedProject(null)}
          >
            <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-xl"></div>
            <div className="absolute inset-0 debug-grid opacity-[0.05]"></div>
            
            <div 
                className="relative w-full max-w-6xl bg-zinc-900 border-2 border-zinc-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col lg:flex-row h-full max-h-[90vh] md:max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Exit Station */}
                <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 z-20 w-12 h-12 bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-50 hover:border-zinc-50 transition-all active:scale-95 group"
                >
                    <X size={20} className="group-hover:rotate-90 transition-transform" />
                </button>

                {/* Left Side: Media Asset */}
                <div className="w-full lg:w-[55%] relative h-64 lg:h-auto overflow-hidden bg-black flex items-center justify-center border-r border-zinc-800/50">
                    <img 
                        src={selectedProject.image_url} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.5]" 
                        alt={selectedProject.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-transparent hidden lg:block"></div>
                </div>

                {/* Right Side: Archive Content */}
                <div className="flex-1 p-6 md:p-12 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                    <div className="space-y-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 border border-primary/30 uppercase tracking-widest">{selectedProject.category}</span>
                                <span className="font-mono text-[10px] text-zinc-600 uppercase flex items-center gap-2">
                                    <Calendar size={12} />
                                    SYNCED_{new Date(selectedProject.date).getFullYear()}
                                </span>
                            </div>
                            <h2 className="font-headline text-5xl md:text-8xl font-black uppercase text-zinc-50 tracking-tighter leading-[0.85] italic mb-6">
                                {selectedProject.title}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <h5 className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest border-b border-zinc-800 pb-2">STREAM_ON_SIGNALS</h5>
                            <div className="grid grid-cols-1 gap-3">
                                {selectedProject.spotify_url && (
                                    <a 
                                        href={selectedProject.spotify_url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="bg-zinc-950 border border-zinc-800 p-4 hover:border-[#1DB954] hover:bg-[#1DB954]/5 transition-all flex items-center justify-between group"
                                    >
                                        <span className="font-mono text-xs uppercase tracking-widest group-hover:text-[#1DB954]">SPOTIFY_SIGNAL</span>
                                        <ExternalLink size={14} className="text-zinc-700 group-hover:text-[#1DB954]" />
                                    </a>
                                )}
                                {selectedProject.apple_music_url && (
                                    <a 
                                        href={selectedProject.apple_music_url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="bg-zinc-950 border border-zinc-800 p-4 hover:border-[#FA2D3F] hover:bg-[#FA2D3F]/5 transition-all flex items-center justify-between group"
                                    >
                                        <span className="font-mono text-xs uppercase tracking-widest group-hover:text-[#FA2D3F]">APPLE_MUSIC_TRANS</span>
                                        <ExternalLink size={14} className="text-zinc-700 group-hover:text-[#FA2D3F]" />
                                    </a>
                                )}
                                {selectedProject.youtube_url && (
                                    <a 
                                        href={selectedProject.youtube_url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="bg-zinc-950 border border-zinc-800 p-4 hover:border-[#FF0000] hover:bg-[#FF0000]/5 transition-all flex items-center justify-between group"
                                    >
                                        <span className="font-mono text-xs uppercase tracking-widest group-hover:text-[#FF0000]">YOUTUBE_VISUAL</span>
                                        <ExternalLink size={14} className="text-zinc-700 group-hover:text-[#FF0000]" />
                                    </a>
                                )}
                                {selectedProject.audiomack_url && (
                                    <a 
                                        href={selectedProject.audiomack_url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="bg-zinc-950 border border-zinc-800 p-4 hover:border-[#FFA200] hover:bg-[#FFA200]/5 transition-all flex items-center justify-between group"
                                    >
                                        <span className="font-mono text-xs uppercase tracking-widest group-hover:text-[#FFA200]">AUDIOMACK_SIGNAL</span>
                                        <ExternalLink size={14} className="text-zinc-700 group-hover:text-[#FFA200]" />
                                    </a>
                                )}
                                {!selectedProject.spotify_url && !selectedProject.apple_music_url && !selectedProject.youtube_url && !selectedProject.audiomack_url && (
                                    <p className="font-mono text-[10px] text-zinc-800 uppercase italic">ARCHIVAL_SIGNAL_ONLY // NO_PUBLIC_TRANSMISSION</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      )}

      <BottomNav />
      <Footer />
    </>
  );
}
