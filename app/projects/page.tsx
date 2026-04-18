"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlayCircle, ArrowRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  date: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
      <main className="min-h-screen pt-20 pb-32 debug-grid overflow-x-hidden">
        {/* --- Header Section --- */}
        <header className="px-4 md:px-12 mb-8 border-l-4 md:border-l-2 border-primary ml-4 md:ml-12 pl-4">
          <p className="font-body text-sm md:text-base text-zinc-400 leading-tight md:leading-normal max-w-2xl">
            A professional collection of unique beats and creative projects. Built for artists who want to stand out.
          </p>
        </header>

        {/* --- Hit Projects Gallery --- */}
        <section className="px-4 md:px-12 pt-8 border-t border-zinc-900 pb-12">
          <div className="mb-8 flex justify-between items-end border-b-2 border-zinc-800 pb-4">
            <h3 className="font-headline text-2xl md:text-4xl font-black uppercase italic text-zinc-50 tracking-tighter">Hit Projects</h3>
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                ARCHIVE_COUNT: {loading ? "--" : projects.length.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-8">
            {loading ? (
                <div className="col-span-3 py-32 flex items-center justify-center border-2 border-zinc-900 border-dashed">
                    <p className="font-mono text-xs uppercase tracking-[0.5em] animate-pulse">Synchronizing_Archive_Assets...</p>
                </div>
            ) : projects.length > 0 ? (
                projects.map((project) => {
                    return (
                        <div 
                            key={project.id} 
                            className="group flex flex-col gap-1"
                        >
                            <div className="relative aspect-square bg-zinc-950 overflow-hidden border border-zinc-800 group-hover:border-primary transition-colors">
                                <img 
                                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-100 opacity-80 transition-all duration-700" 
                                    src={project.image_url}
                                    alt={project.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            </div>
                            <div className="p-2 md:p-6 bg-zinc-900/30 border-t border-zinc-800 flex-1">
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
                    );
                })
            ) : (
                <div className="col-span-12 py-32 flex flex-col items-center justify-center border-2 border-zinc-900 border-dashed">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-600 mb-4">No_Project_Signals_Detected</p>
                    <Link href="/contact" className="border border-zinc-800 px-6 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-zinc-50 hover:text-zinc-950 transition-all">Submit_Your_Project</Link>
                </div>
            )}
          </div>
        </section>

        {/* --- Collab Protocol Section --- */}
        <section className="px-4 md:px-12 mt-20 border-t-8 border-zinc-50 bg-zinc-950 overflow-hidden">
          <div className="pt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
            <div className="py-8 md:p-12 border-b-2 md:border-b-0 md:border-r-2 border-zinc-800 flex flex-col justify-between md:min-h-[500px]">
              <div>
                <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-8 text-zinc-50">COLLAB<br />PROTOCOL</h2>
                <div className="space-y-4 font-mono text-[10px] md:text-xs text-zinc-600 uppercase">
                  <p>[ PHASE 01: INITIAL_CONTACT ]</p>
                  <p>[ PHASE 02: ASSET_EXCHANGE ]</p>
                  <p>[ PHASE 03: REFINEMENT_LOOP ]</p>
                  <p>[ PHASE 04: FINAL_RENDER ]</p>
                </div>
              </div>
              <div className="pt-10 md:pt-20">
                <p className="font-mono text-sm leading-relaxed max-w-sm text-zinc-400 uppercase">
                  WE DO NOT ACCEPT UNSOLICITED DEMOS. FILL THE PROTOCOL FORM FOR ARCHITECTURAL EVALUATION.
                </p>
              </div>
            </div>
            <div className="hidden lg:block p-12 bg-black/50">
              <form className="space-y-8">
                <div className="group relative">
                  <label className="font-mono text-[10px] text-zinc-600 uppercase block mb-2">IDENTIFICATION / NAME</label>
                  <input className="w-full bg-transparent border-b-2 border-zinc-800 focus:border-zinc-50 text-zinc-50 font-mono uppercase text-sm p-2 outline-none transition-colors placeholder:text-zinc-800" placeholder="ENTITY_NAME_REQUIRED" type="text" />
                </div>
                <div className="group relative">
                  <label className="font-mono text-[10px] text-zinc-600 uppercase block mb-2">COMMS / EMAIL</label>
                  <input className="w-full bg-transparent border-b-2 border-zinc-800 focus:border-zinc-50 text-zinc-50 font-mono uppercase text-sm p-2 outline-none transition-colors placeholder:text-zinc-800" placeholder="COMMS_CHANNEL_REQUIRED" type="email" />
                </div>
                <div className="group relative">
                  <label className="font-mono text-[10px] text-zinc-600 uppercase block mb-2">PROJECT_TYPE</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="border border-zinc-50 bg-zinc-50 text-zinc-950 py-2 font-mono text-[10px] uppercase" type="button">PRODUCTION</button>
                    <button className="border border-zinc-800 text-zinc-600 py-2 font-mono text-[10px] uppercase hover:border-zinc-50 hover:text-zinc-50 transition-colors" type="button">MIXING/MASTERING</button>
                    <button className="border border-zinc-800 text-zinc-600 py-2 font-mono text-[10px] uppercase hover:border-zinc-50 hover:text-zinc-50 transition-colors" type="button">SOUND_DESIGN</button>
                    <button className="border border-zinc-800 text-zinc-600 py-2 font-mono text-[10px] uppercase hover:border-zinc-50 hover:text-zinc-50 transition-colors" type="button">CONSULTATION</button>
                  </div>
                </div>
                <div className="group relative">
                  <label className="font-mono text-[10px] text-zinc-600 uppercase block mb-2">PROJECT_MANIFESTO</label>
                  <textarea className="w-full bg-transparent border-2 border-zinc-800 focus:border-zinc-50 text-zinc-50 font-mono uppercase text-sm p-4 outline-none transition-colors placeholder:text-zinc-800 resize-none" placeholder="DESCRIBE_THE_VISION" rows={4}></textarea>
                </div>
                <button className="group flex items-center justify-between w-full bg-zinc-50 text-zinc-950 p-6 font-headline font-black uppercase text-xl hover:bg-zinc-950 hover:text-zinc-50 border-2 border-zinc-50 transition-all" type="button">
                  <span>INITIATE_HANDSHAKE</span>
                  <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* --- Footer Visual --- */}
        <section className="hidden md:flex border-y-2 border-zinc-800 p-6 flex-wrap justify-between items-center gap-4 opacity-30 mt-12">
          <span className="font-mono text-[10px] uppercase font-bold">EST_2024</span>
          <span className="font-mono text-[10px] uppercase font-bold">ALL_RIGHTS_RESERVED</span>
          <span className="font-mono text-[10px] uppercase font-bold">LUXBEATZ_PRODUCER_SUITE</span>
          <span className="font-mono text-[10px] uppercase font-bold">BUILD_SYSTEM_STABLE</span>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
