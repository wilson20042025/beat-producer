"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Play, ChevronLeft, ShieldCheck, Download } from "lucide-react";

interface Beat {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  price_basic: number;
  price_premium: number;
  price_exclusive: number;
  audio_url: string;
}

export default function BeatDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [beat, setBeat] = useState<Beat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBeat() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('beats')
          .select('*')
          .eq('id', id)
          .single();

        if (data) setBeat(data as Beat);
        if (error) console.error("Error fetching beat details:", error);
      } catch (err) {
        console.error("Critical beat fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchBeat();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-50 font-mono gap-4">
        <p className="text-xl animate-pulse uppercase tracking-[0.5em]">Establishing_Signal_Link...</p>
      </div>
    );
  }

  if (!beat) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-50 font-mono">
        <p className="text-xl animate-pulse uppercase tracking-[0.5em]">Beat_Archive_Error</p>
        <Link href="/catalog" className="mt-8 border border-zinc-700 px-6 py-2 hover:bg-zinc-50 hover:text-zinc-950 transition-all uppercase text-[10px] tracking-widest flex items-center gap-2">
            <ChevronLeft size={14} />
            Return_to_Catalog
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-32 px-4 md:px-12 flex flex-col items-center">
        {/* Simple Header */}
        <div className="w-full max-w-4xl border-b-2 border-zinc-800 pb-8 mb-12">
            <Link href="/catalog" className="font-mono text-[10px] text-zinc-500 hover:text-zinc-50 transition-colors uppercase tracking-[0.3em] mb-4 inline-flex items-center gap-2">
                <ChevronLeft size={12} />
                [ BACK_TO_CATALOG ]
            </Link>
            <h1 className="font-headline text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">{beat.title}</h1>
            <p className="font-mono text-xs text-zinc-400 mt-4 tracking-[0.2em]">{beat.genre} // {beat.bpm} BPM</p>
        </div>

        {/* Simplified Player */}
        <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 p-6 md:p-12 mb-12 flex items-center gap-8">
            <button className="w-16 h-16 md:w-24 md:h-24 bg-zinc-50 text-zinc-950 rounded-full flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all">
                <Play className="w-8 h-8 md:w-12 md:h-12 fill-current" />
            </button>
            <div className="flex-1 space-y-4">
                <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                    <span>0:00</span>
                    <span className="animate-pulse">STREAMING_FROM_CLOUDINARY</span>
                    <span>--:--</span>
                </div>
                <div className="h-1 bg-zinc-800 relative w-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-zinc-50 w-0"></div>
                </div>
            </div>
        </div>

        {/* Simplified Options */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="border border-zinc-800 p-6 hover:border-zinc-50 transition-colors cursor-pointer group">
                <p className="font-mono text-[10px] text-zinc-500 uppercase mb-2">Basic Lease</p>
                <div className="flex items-baseline gap-2">
                    <p className="font-headline text-2xl font-black group-hover:text-primary transition-colors">${beat.price_basic || '29.99'}</p>
                    <span className="font-mono text-[8px] text-zinc-600">MP3</span>
                </div>
            </div>
            <div className="border-2 border-zinc-50 p-6 bg-zinc-50 text-zinc-950 cursor-pointer">
                <p className="font-mono text-[10px] text-zinc-950/60 uppercase mb-2">Premium Lease</p>
                <div className="flex items-baseline gap-2">
                    <p className="font-headline text-2xl font-black">${beat.price_premium || '79.99'}</p>
                    <span className="font-mono text-[8px] text-zinc-900/60">WAV + MP3</span>
                </div>
            </div>
            <div className="border border-zinc-800 p-6 hover:border-zinc-50 transition-colors cursor-pointer group">
                <p className="font-mono text-[10px] text-zinc-500 uppercase mb-2">Exclusive</p>
                <div className="flex items-baseline gap-2">
                    <p className="font-headline text-2xl font-black group-hover:text-primary transition-colors">${beat.price_exclusive || '499.00'}</p>
                    <span className="font-mono text-[8px] text-zinc-600">STEMS + ALL</span>
                </div>
            </div>
        </div>

        <button className="w-full max-w-4xl bg-zinc-50 text-zinc-950 py-6 font-headline font-black text-xl md:text-2xl uppercase tracking-tighter hover:invert transition-all flex items-center justify-center gap-4">
            <ShieldCheck size={28} />
            SECURE_LICENSE_&_DOWNLOAD
        </button>
      </main>
      <BottomNav />
    </>
  );
}
