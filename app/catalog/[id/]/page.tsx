"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Play, Pause, ChevronLeft, Download, ShoppingCart, Info, Activity } from "lucide-react";

export default function BeatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [beat, setBeat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchBeat() {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('beats')
          .select('*')
          .eq('id', id)
          .single();

        if (data) setBeat(data);
        else if (error) console.error("Beat fetch error:", error);
      } catch (err) {
        console.error("Critical fetch failure:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBeat();

    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, [id]);

  const togglePlay = () => {
    if (!beat?.audio_url) return;

    if (!audioRef.current) {
        audioRef.current = new Audio(beat.audio_url);
        audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
    } else {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
        setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-50 font-mono">
        <Activity className="animate-spin mb-4 text-primary" size={40} />
        <p className="text-xl uppercase tracking-[0.5em]">Establishing_Stream...</p>
      </div>
    );
  }

  if (!beat) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-50 font-mono p-4">
        <p className="text-xl animate-pulse uppercase tracking-[0.5em] text-red-500 mb-8 text-center">Protocol_Error: Beat_Not_Identified</p>
        <button onClick={() => router.push('/catalog')} className="border border-zinc-700 px-8 py-3 hover:bg-zinc-50 hover:text-zinc-950 transition-all uppercase text-xs tracking-widest font-bold">
            Return_to_Store
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-32 px-4 md:px-12 flex flex-col items-center bg-zinc-950 text-zinc-50 font-['Space_Grotesk']">
        {/* Navigation Breadcrumb */}
        <div className="w-full max-w-6xl mb-12">
            <button 
                onClick={() => router.push('/catalog')} 
                className="font-mono text-[10px] text-zinc-500 hover:text-zinc-50 transition-colors uppercase tracking-[0.3em] flex items-center gap-2 group"
            >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                BACK_TO_ARCHIVE
            </button>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left Column: Visual & Header */}
            <div className="space-y-8">
                <div className="relative aspect-square bg-zinc-900 border-2 border-zinc-800 overflow-hidden group">
                    <img 
                      src={beat.art_url || beat.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNSL-EO87Ki8QEsSFlSmmNR-f96avl0e_6rfenj4vMjJUpHVwR3Hm5D0JhmH_zBtmR7fIsNXQR_0FNkuzWBoQsuvVm1SYguKBHFswuBn79OkpyQPj2d8AkIXZN4FlSeKgizLbd882BlDgYSgFe2jLME5MN5qlTwsnl-0JK9PZBzTclQuGcdeUyErMQjvtxARMH5n5n_9NY9Wr5ZlzuQsolspZyXBYhmfI_XeWeb3VCicf1weQilaiGbEAdeHqP9daWMBrYKEA_b2o'} 
                      alt={beat.title} 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                    />
                    <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur px-3 py-1 font-mono text-[10px] border border-zinc-800 uppercase italic font-black">
                        {beat.genre}
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic leading-[0.8] text-primary">
                        {beat.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 pt-4">
                        {beat.tags?.map((tag: string) => (
                            <span key={tag} className="font-mono text-[10px] border border-zinc-800 px-3 py-1 uppercase text-zinc-500 font-bold tracking-widest">#{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Integration & Purchase */}
            <div className="flex flex-col justify-center gap-12">
                <div className="space-y-8">
                    <div className="flex items-center gap-6 pb-8 border-b border-zinc-900">
                        <button 
                            onClick={togglePlay}
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl group ${
                                isPlaying ? "bg-primary text-zinc-50" : "bg-zinc-50 text-zinc-950 hover:bg-primary hover:text-zinc-50"
                            }`}
                        >
                            {isPlaying ? (
                                <Pause size={40} className="fill-current" />
                            ) : (
                                <Play size={40} className="fill-current ml-1 group-hover:scale-110 transition-transform" />
                            )}
                        </button>
                        <div className="flex-1 space-y-2">
                             <div className="flex justify-between font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                                <span>{isPlaying ? "STREAMING_SIGNAL" : "PREVIEW_IDLE"}</span>
                                <span>{beat.bpm} BPM</span>
                            </div>
                            <div className="h-1 bg-zinc-900 overflow-hidden relative">
                                {isPlaying && (
                                    <div className="absolute inset-y-0 left-0 bg-primary w-full animate-[uploadProgress_45s_linear_forwards] shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="border border-zinc-800 p-6 bg-zinc-900/30 hover:border-zinc-50 transition-all cursor-pointer group">
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-black">Standard_Lease</span>
                                <span className="font-headline text-2xl font-black group-hover:text-primary transition-colors">${beat.price_basic || '29.99'}</span>
                             </div>
                             <p className="text-[10px] text-zinc-600 uppercase font-mono tracking-tighter italic">High-Quality MP3 // No Vocals // Social Proof</p>
                        </div>
                        <div className="border-2 border-zinc-50 p-6 bg-zinc-50 text-zinc-950 cursor-pointer flex justify-between items-center group hover:invert">
                             <div>
                                <span className="font-mono text-[10px] text-zinc-950/60 uppercase tracking-widest font-black">Professional_Lease</span>
                                <p className="text-[10px] text-zinc-950/60 uppercase font-mono tracking-tighter italic font-bold">WAV Stems // Track-outs Included // Industry Grade</p>
                             </div>
                             <span className="font-headline text-2xl font-black">${beat.price_premium || '79.99'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button className="bg-primary text-zinc-50 py-6 font-headline font-black text-2xl uppercase tracking-tighter hover:invert transition-all flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                        <ShoppingCart size={24} />
                        PURCHASE_LICENSE
                    </button>
                    <button className="border border-zinc-800 text-zinc-500 py-4 font-mono text-[10px] uppercase tracking-widest hover:border-zinc-50 hover:text-zinc-50 transition-all flex items-center justify-center gap-3">
                        <Download size={14} />
                        DOWNLOAD_FREE_TAGGED_TEST
                    </button>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 flex items-start gap-4">
                    <Info size={16} className="text-primary shrink-0 mt-1" />
                    <p className="text-[10px] text-zinc-500 font-mono leading-relaxed uppercase">
                        Digital Signal Transfer: High-fidelity 48kHz / 24-bit masters delivered within 300ms of payment verification. Secure Cloud Gateway active.
                    </p>
                </div>
            </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
