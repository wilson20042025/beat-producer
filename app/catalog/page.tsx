"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Play, Pause, ShoppingBag, Filter, ShieldCheck, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Beat {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  audio_url: string;
  price_basic: number;
}

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Audio State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catRes, beatRes] = await Promise.all([
          supabase.from('categories').select('name').order('name'),
          supabase.from('beats').select('*').order('created_at', { ascending: false })
        ]);

        if (catRes.data) setCategories(catRes.data.map(c => c.name));
        if (beatRes.data) setBeats(beatRes.data as Beat[]);
      } catch (err) {
        console.error("Data fetch protocol failure:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  const togglePlay = (beat: Beat) => {
    if (playingId === beat.id) {
        audioRef.current?.pause();
        setPlayingId(null);
    } else {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        audioRef.current = new Audio(beat.audio_url);
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
        audioRef.current.onended = () => setPlayingId(null);
        setPlayingId(beat.id);
    }
  };

  const filteredBeats = selectedCategory 
    ? beats.filter(beat => beat.genre === selectedCategory)
    : beats;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-12 md:pt-20 pb-32 bg-zinc-950 text-zinc-50 font-['Space_Grotesk'] overflow-x-hidden">
        <Hero title="BEAT_\nCATALOG" />

        {/* --- Advanced Filter Bar --- */}
        <div className="px-4 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 sticky top-16 bg-zinc-950/90 backdrop-blur-md z-40">
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-6 py-2 border font-mono text-[10px] uppercase tracking-widest transition-all ${
                !selectedCategory 
                ? "bg-zinc-50 text-zinc-950 border-zinc-50" 
                : "border-zinc-800 text-zinc-500 hover:text-zinc-50"
              }`}
            >
              ALL_SIGNALS
            </button>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-6 py-2 border font-mono text-[10px] uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                  ? "bg-zinc-50 text-zinc-950 border-zinc-50" 
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-50 shadow-lg"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6 opacity-30 hidden lg:flex">
             <div className="flex items-center gap-2"><ShieldCheck size={14} /> <span className="text-[10px] font-mono">SECURE_PAYMENT</span></div>
             <div className="flex items-center gap-2"><Zap size={14} /> <span className="text-[10px] font-mono">INSTANT_DELIVERY</span></div>
          </div>
        </div>

        {/* --- Catalog Stream --- */}
        <section className="border-t border-zinc-900 divide-y divide-zinc-900 min-h-[500px]">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-2 border-zinc-800 border-t-zinc-50 animate-spin mb-4"></div>
                <p className="font-mono text-xs uppercase tracking-[0.4em] text-zinc-600">Syncing_Beat_Cloud...</p>
             </div>
          ) : filteredBeats.length > 0 ? (
            filteredBeats.map((beat) => (
              <div key={beat.id} className="group relative hover:bg-zinc-900/30 transition-all duration-300">
                <div className="flex flex-col lg:flex-row items-stretch">
                  
                  {/* Visual ID Component */}
                  <div className="hidden lg:flex w-24 items-center justify-center border-r border-zinc-900 group-hover:bg-zinc-900 transition-colors">
                     <span className="font-mono text-[10px] text-zinc-800 group-hover:text-zinc-500 rotate-90 whitespace-nowrap">ID_{beat.id.slice(0, 4)}</span>
                  </div>

                  <div className="flex-1 flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-8">
                     <div className="flex-1 min-w-0 w-full md:w-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-[8px] bg-zinc-800 text-zinc-400 px-2 py-0.5 uppercase">{beat.genre}</span>
                            <span className="font-mono text-[8px] text-zinc-600">{beat.bpm} BPM</span>
                        </div>
                        <h3 className="font-headline text-2xl md:text-5xl font-black uppercase tracking-tighter text-zinc-100 group-hover:text-primary transition-colors truncate">
                            {beat.title}
                        </h3>
                     </div>

                     <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex flex-col items-end pr-8 border-r border-zinc-900 hidden md:flex">
                            <span className="font-headline text-3xl font-black">${beat.price_basic || '29.99'}</span>
                            <span className="font-mono text-[9px] text-zinc-600 uppercase">BASIC_LICENSE</span>
                        </div>
                        
                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => togglePlay(beat)}
                                className={`w-14 h-14 md:w-20 md:h-20 flex items-center justify-center transition-all ${
                                    playingId === beat.id ? "bg-primary text-zinc-50" : "bg-zinc-900 text-zinc-50 hover:bg-zinc-50 hover:text-zinc-950"
                                }`}
                            >
                                {playingId === beat.id ? (
                                    <Pause size={32} className="fill-current" />
                                ) : (
                                    <Play size={32} className="fill-current ml-1" />
                                )}
                            </button>
                            <Link 
                                href={`/catalog/${beat.id}`}
                                className="flex-1 md:flex-none h-14 md:h-20 bg-zinc-50 text-zinc-950 px-6 md:px-12 flex items-center justify-center font-headline font-black text-xs md:text-xl uppercase tracking-widest hover:invert transition-all active:scale-95"
                            >
                                <ShoppingBag size={20} className="md:hidden" />
                                <span className="hidden md:block">ACQUIRE</span>
                            </Link>
                        </div>
                     </div>
                  </div>

                  {/* Waveform Visualization (Dynamic Simulation) */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 overflow-hidden">
                     {playingId === beat.id && (
                        <div className="h-full bg-primary animate-[uploadProgress_45s_linear_forwards] shadow-[0_0_10px_#f43f5e]"></div>
                     )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 flex flex-col items-center justify-center italic opacity-20">
                <Filter size={48} className="mb-4" />
                <p className="font-mono text-sm uppercase tracking-widest">No_Signals_Match_The_Filter</p>
            </div>
          )}
        </section>

        <Footer />
      </main>
      <BottomNav />
    </>
  );
}
