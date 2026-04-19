"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { ArrowRight, X, Calendar, Activity, Tag, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  title: string;
  image_url: string;
  category: string;
  date: string;
  tags?: string[];
  description?: string;
  spotify_url?: string;
  apple_music_url?: string;
  youtube_url?: string;
  audiomack_url?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('date', { ascending: false });

        if (data) setProjects(data as Project[]);
        if (error) console.error("Error fetching projects:", error);
      } catch (err) {
        console.error("Critical project fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-32 bg-zinc-950 text-zinc-50 font-['Space_Grotesk'] overflow-x-hidden">
        {/* --- Hit Projects Gallery --- */}
        <section className="px-4 md:px-12 pt-8 border-t border-zinc-900 pb-12">
          <div className="mb-12 flex justify-between items-end border-b-2 border-zinc-800 pb-6">
            <div>
                <h3 className="font-headline text-3xl md:text-6xl font-black uppercase italic text-zinc-50 tracking-tighter">HIT_PROJECTS</h3>
                <p className="font-mono text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-[0.4em] mt-2">ARCHIVAL_SIGNAL_VAULT // QUANTUM_CREDITS</p>
            </div>
            <span className="font-mono text-[10px] md:text-xs text-zinc-600 uppercase tracking-widest font-bold">
                TOTAL_RECORDS: {loading ? "--" : projects.length.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-8">
            {loading ? (
                [...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-zinc-900 animate-pulse border border-zinc-800"></div>
                ))
            ) : projects.length > 0 ? (
                projects.map((project) => (
                    <div 
                        key={project.id} 
                        className="group flex flex-col gap-1 cursor-pointer"
                        onClick={() => setSelectedProject(project)}
                    >
                        <div className="relative aspect-square bg-zinc-950 overflow-hidden border border-zinc-800 group-hover:border-primary transition-colors">
                            <img 
                                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-100 opacity-80 transition-all duration-700" 
                                src={project.image_url}
                                alt={project.title}
                            />
                            <div className="absolute inset-x-0 bottom-0 py-2 md:py-4 px-2 md:px-6 bg-gradient-to-t from-black to-transparent">
                                <span className="md:hidden font-headline text-[8px] uppercase font-black text-zinc-50 truncate block">{project.title}</span>
                            </div>
                        </div>
                        <div className="p-2 md:p-6 bg-zinc-900/30 border-t border-zinc-800 flex-1 hidden md:block">
                            <h4 className="font-headline text-[10px] md:text-3xl font-black uppercase text-zinc-50 leading-none truncate mb-1 tracking-tighter group-hover:text-primary transition-colors">
                                {project.title}
                            </h4>
                            <div className="flex justify-between items-center opacity-60">
                                <p className="font-mono text-[6px] md:text-xs text-zinc-400 font-bold uppercase tracking-tighter">
                                    {project.category || 'PRODUCED'}
                                </p>
                                <span className="font-mono text-[6px] md:text-xs text-zinc-600 uppercase font-bold">
                                    {project.date ? new Date(project.date).getFullYear() : '2024'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-3 py-32 flex flex-col items-center justify-center border-2 border-zinc-900 border-dashed">
                    <p className="font-mono text-xs uppercase tracking-[0.5em] text-zinc-800 mb-4">No_Signatures_Detected</p>
                    <button onClick={() => window.location.reload()} className="text-[10px] font-mono underline uppercase text-zinc-600 hover:text-zinc-50">RETRY_PROTOCOL</button>
                </div>
            )}
          </div>
        </section>

        <Footer />
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
                <div className="w-full lg:w-[55%] relative h-64 lg:h-auto overflow-hidden bg-black flex items-center justify-center">
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
    </>
  );
}
