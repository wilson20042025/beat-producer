"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Search, Filter, Play, Pause, ShoppingBag, Equal, X, ShieldCheck, ChevronLeft, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Beat {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  audio_url: string;
  price_basic: number;
  price_premium: number;
  price_exclusive: number;
}

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Audio State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
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
        <Hero title={"BEATS_\nFOR SALE"} />

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

                  <div className="flex-1 flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-6">
                     <div className="flex-1 min-w-0 w-full mb-4 md:mb-0">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-[8px] md:text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 uppercase">{beat.genre}</span>
                            <span className="font-mono text-[8px] md:text-[10px] text-zinc-600">{beat.bpm} BPM</span>
                        </div>
                        <h3 className="font-headline text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter text-zinc-100 group-hover:text-primary transition-colors truncate">
                            {beat.title}
                        </h3>

                        {/* Density Pricing Grid (Desktop & Mobile viewable) */}
                        <div className="flex items-center gap-3 md:gap-6 mt-3 md:mt-4 overflow-x-auto custom-scrollbar pb-1">
                            <div className="flex flex-col border-l-2 border-zinc-700 pl-2 md:pl-3 shrink-0">
                                <span className="font-mono text-[8px] md:text-[9px] text-zinc-500 uppercase tracking-widest">BASIC</span>
                                <span className="font-bold text-xs md:text-sm text-zinc-300 group-hover:text-zinc-50 transition-colors">${beat.price_basic || '29.99'}</span>
                            </div>
                            <div className="flex flex-col border-l-2 border-primary/50 pl-2 md:pl-3 shrink-0">
                                <span className="font-mono text-[8px] md:text-[9px] text-primary uppercase tracking-widest">PREMIUM</span>
                                <span className="font-bold text-xs md:text-sm text-zinc-300 group-hover:text-zinc-50 transition-colors">${beat.price_premium || '79.99'}</span>
                            </div>
                            <div className="flex flex-col border-l-2 border-zinc-700 pl-2 md:pl-3 shrink-0">
                                <span className="font-mono text-[8px] md:text-[9px] text-zinc-500 uppercase tracking-widest">EXCLSV</span>
                                <span className="font-bold text-xs md:text-sm text-zinc-300 group-hover:text-zinc-50 transition-colors">${beat.price_exclusive || '499.00'}</span>
                            </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => togglePlay(beat)}
                                className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all ${
                                    playingId === beat.id ? "bg-primary text-zinc-50" : "bg-zinc-900 text-zinc-50 hover:bg-zinc-50 hover:text-zinc-950"
                                }`}
                            >
                                {playingId === beat.id ? (
                                    <Pause size={24} className="fill-current" />
                                ) : (
                                    <Play size={24} className="fill-current ml-1" />
                                )}
                            </button>
                            <button 
                                onClick={() => setSelectedBeat(beat)}
                                className="flex-1 md:flex-none md:w-48 h-12 md:h-16 bg-zinc-50 text-zinc-950 flex items-center justify-center font-headline font-black text-xs md:text-sm uppercase tracking-widest hover:invert transition-all active:scale-95 gap-2"
                            >
                                <ShoppingBag size={18} />
                                <span>ACQUIRE</span>
                            </button>
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

        {/* --- Beat Acquisition Terminal (Overlay) --- */}
        {selectedBeat && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 animate-[fadeIn_0.3s_ease-out]">
                {/* Background Blur */}
                <div 
                    className="absolute inset-0 bg-zinc-950/95 backdrop-blur-xl"
                    onClick={() => setSelectedBeat(null)}
                ></div>
                <div className="absolute inset-0 debug-grid opacity-[0.05]"></div>

                {/* Modal Container */}
                <div className="relative w-full h-full md:h-auto max-w-5xl bg-zinc-900 border-x md:border-2 border-zinc-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-y-auto">
                    
                    {/* Header Station */}
                    <header className="flex justify-between items-start p-6 md:p-12 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 uppercase tracking-widest font-black">
                                    {selectedBeat.genre}
                                </span>
                                <span className="font-mono text-[10px] text-zinc-500 uppercase flex items-center gap-2">
                                    <ShieldCheck size={12} />
                                    SECURE_PROTOCOL
                                </span>
                            </div>
                            <h2 className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter text-zinc-50 italic">
                                {selectedBeat.title}
                            </h2>
                            <p className="font-mono text-xs text-zinc-400 mt-2 tracking-widest">BPM: {selectedBeat.bpm} // ID: {selectedBeat.id.slice(0,8)}</p>
                        </div>
                        
                        <button 
                            onClick={() => setSelectedBeat(null)}
                            className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-50 hover:border-zinc-50 transition-all active:scale-95 shrink-0"
                        >
                            <X size={20} />
                        </button>
                    </header>

                    {/* Acquisition Grid */}
                    <div className="p-6 md:p-12 flex-1">
                        <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6">SELECT_LICENSE_TIER</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                            {/* Basic */}
                            <div 
                                onClick={() => setSelectedTier('BASIC')}
                                className={`p-6 md:p-8 transition-colors cursor-pointer group flex flex-col justify-between bg-zinc-950 ${selectedTier === 'BASIC' ? 'border-2 border-zinc-50' : 'border border-zinc-800 hover:border-zinc-50'}`}
                            >
                                <div>
                                    <p className={`font-mono text-[10px] uppercase mb-4 tracking-widest ${selectedTier === 'BASIC' ? 'text-zinc-50' : 'text-zinc-500'}`}>BASIC_LEASE</p>
                                    <div className="flex items-baseline gap-2 mb-6 border-b border-zinc-900 pb-4">
                                        <p className="font-headline text-4xl font-black group-hover:text-zinc-50 transition-colors">${selectedBeat.price_basic || '29.99'}</p>
                                    </div>
                                    <ul className="space-y-3 font-mono text-[9px] text-zinc-400 uppercase tracking-widest">
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-500 rounded-full"></div> HIGH_QUALITY MP3</li>
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-500 rounded-full"></div> 10,000 STREAMS MAX</li>
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-500 rounded-full"></div> NON_PROFIT OR LIVE</li>
                                    </ul>
                                </div>
                                <button className={`w-full py-3 mt-8 font-mono text-[10px] uppercase font-bold tracking-widest transition-all ${selectedTier === 'BASIC' ? 'bg-zinc-50 text-zinc-950' : 'border border-zinc-800 group-hover:bg-zinc-50 group-hover:text-zinc-950'}`}>
                                    {selectedTier === 'BASIC' ? 'SELECTED' : 'SELECT'}
                                </button>
                            </div>

                            {/* Premium */}
                            <div 
                                onClick={() => setSelectedTier('PREMIUM')}
                                className={`p-6 md:p-8 transition-colors cursor-pointer group flex flex-col justify-between bg-zinc-950 relative overflow-hidden ${selectedTier === 'PREMIUM' ? 'border-2 border-primary' : 'border border-zinc-800 hover:border-primary/50'}`}
                            >
                                <div className="absolute top-0 right-0 bg-primary text-zinc-50 pb-1 pt-1.5 px-4 font-mono text-[8px] uppercase font-black tracking-widest">RECOMMENDED</div>
                                <div>
                                    <p className={`font-mono text-[10px] uppercase mb-4 tracking-widest ${selectedTier === 'PREMIUM' ? 'text-primary' : 'text-zinc-500'}`}>PREMIUM_LEASE</p>
                                    <div className="flex items-baseline gap-2 mb-6 border-b border-zinc-900 pb-4">
                                        <p className="font-headline text-4xl font-black text-zinc-50">${selectedBeat.price_premium || '79.99'}</p>
                                    </div>
                                    <ul className="space-y-3 font-mono text-[9px] text-zinc-300 uppercase tracking-widest">
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> UNTAGGED WAV + MP3</li>
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> 500,000 STREAMS MAX</li>
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> PROFIT USE CLEARED</li>
                                    </ul>
                                </div>
                                <button className={`w-full py-3 mt-8 font-mono text-[10px] uppercase font-bold tracking-widest transition-all ${selectedTier === 'PREMIUM' ? 'bg-primary text-zinc-50' : 'border border-zinc-800 text-zinc-500 group-hover:bg-primary group-hover:text-zinc-50'}`}>
                                    {selectedTier === 'PREMIUM' ? 'SELECTED' : 'SELECT'}
                                </button>
                            </div>

                            {/* Exclusive */}
                            <div 
                                onClick={() => setSelectedTier('EXCLUSIVE')}
                                className={`p-6 md:p-8 transition-colors cursor-pointer group flex flex-col justify-between bg-zinc-950 ${selectedTier === 'EXCLUSIVE' ? 'border-2 border-zinc-50' : 'border border-zinc-800 hover:border-zinc-50'}`}
                            >
                                <div>
                                    <p className={`font-mono text-[10px] uppercase mb-4 tracking-widest ${selectedTier === 'EXCLUSIVE' ? 'text-zinc-50' : 'text-zinc-500'}`}>EXCLUSIVE_RIGHTS</p>
                                    <div className="flex items-baseline gap-2 mb-6 border-b border-zinc-900 pb-4">
                                        <p className="font-headline text-4xl font-black group-hover:text-zinc-50 transition-colors">${selectedBeat.price_exclusive || '499.00'}</p>
                                    </div>
                                    <ul className="space-y-3 font-mono text-[9px] text-zinc-400 uppercase tracking-widest">
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-500 rounded-full"></div> STEMS + WAV + MP3</li>
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-500 rounded-full"></div> UNLIMITED STREAMS</li>
                                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-500 rounded-full"></div> LISTING REMOVED</li>
                                    </ul>
                                </div>
                                <button className={`w-full py-3 mt-8 font-mono text-[10px] uppercase font-bold tracking-widest transition-all ${selectedTier === 'EXCLUSIVE' ? 'bg-zinc-50 text-zinc-950' : 'border border-zinc-800 group-hover:bg-zinc-50 group-hover:text-zinc-950'}`}>
                                    {selectedTier === 'EXCLUSIVE' ? 'SELECTED' : 'NEGOTIATE'}
                                </button>
                            </div>
                        </div>

                        {/* Secure Action Footer */}
                        <div className="bg-zinc-800 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest text-center md:text-left">
                                SIGNAL SECURED VIA 256-BIT ENCRYPTION.<br /> ASSETS DELIVERED INSTANTLY POST-SYNC.
                            </p>
                            <a 
                                href={`https://wa.me/231770904328?text=${encodeURIComponent(
                                    selectedTier 
                                    ? `Yo Luxxbeatz! I'm interested in purchasing the beat "${selectedBeat.title}" with a ${selectedTier.charAt(0) + selectedTier.slice(1).toLowerCase()} license.`
                                    : `Yo Luxxbeatz! I'm interested in the beat "${selectedBeat.title}" and would like to discuss licensing options.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="w-full md:w-auto bg-zinc-50 text-zinc-950 py-4 px-12 font-headline font-black text-sm md:text-xs uppercase tracking-widest hover:invert transition-all flex items-center justify-center gap-3"
                            >
                                NEGOTIATE_WITH_LUXXBEATZ
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <Footer />
      </main>
      <BottomNav />
    </>
  );
}
