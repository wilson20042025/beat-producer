"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Play } from "lucide-react";

interface Beat {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
}

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch Categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('name')
          .order('name');
        
        if (catData) setCategories(catData.map(c => c.name));
        if (catError) console.error("Error fetching categories:", catError);

        // Fetch Beats
        const { data: beatData, error: beatError } = await supabase
          .from('beats')
          .select('*')
          .order('created_at', { ascending: false });

        if (beatData) {
          setBeats(beatData as Beat[]);
        }
        if (beatError) console.error("Error fetching beats:", beatError);
        
      } catch (err) {
        console.error("Critical fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredBeats = selectedCategory 
    ? beats.filter(b => b.tags?.includes(selectedCategory))
    : beats;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-32 debug-grid overflow-x-hidden">
        {/* --- Header Section --- */}
        <header className="px-4 md:px-12 mb-8 border-l-4 md:border-l-2 border-primary ml-4 md:ml-12 pl-4">
          <p className="font-body text-sm md:text-base text-zinc-400 leading-tight md:leading-normal max-w-2xl">
            Premium beats for your next hit. Easy licensing. Professional sound for every artist.
          </p>
        </header>

        {/* Categories Grid */}
        <div className="px-4 md:px-12 border-t border-zinc-900 pt-8 pb-4">
          <p className="font-headline text-[10px] tracking-[0.4em] text-zinc-600 mb-5 uppercase">
            {selectedCategory ? `CATEGORY: ${selectedCategory}` : "SELECT_A_CATEGORY_TO_VIEW_BEATS"}
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 border text-xs font-mono tracking-widest transition-all font-bold ${
                selectedCategory === null 
                ? "bg-zinc-50 text-zinc-950 border-zinc-50" 
                : "border-zinc-800 text-zinc-500 hover:text-zinc-50 hover:border-zinc-50"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 border text-xs font-mono tracking-widest transition-all font-bold ${
                  selectedCategory === cat 
                  ? "bg-zinc-50 text-zinc-950 border-zinc-50" 
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-50 hover:border-zinc-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- Catalog List / Grid --- */}
        <section className={`border-t-2 border-zinc-800 grid grid-cols-2 lg:grid-cols-1 gap-px bg-zinc-800 ${!selectedCategory ? 'hidden md:grid' : 'grid'}`}>
          {loading ? (
            <div className="col-span-full py-24 flex items-center justify-center bg-zinc-950">
               <p className="font-mono text-xs uppercase tracking-[0.5em] animate-pulse">Initializing_Catalog_Data...</p>
            </div>
          ) : filteredBeats.length > 0 ? (
            filteredBeats.map((beat) => (
              <div key={beat.id} className="group bg-zinc-950 hover:bg-zinc-900/50 transition-colors duration-150">
                <div className="flex flex-col lg:flex-row items-stretch lg:min-h-[180px]">
                  <div className="hidden lg:flex w-32 items-center justify-center border-r border-zinc-800 py-8">
                    <span className="font-headline text-2xl font-black text-zinc-100 opacity-20 group-hover:opacity-100 transition-opacity uppercase truncate px-2">
                        {beat.title.slice(0, 3)}
                    </span>
                  </div>
                  
                  <Link 
                    href={`/catalog/${beat.id}`}
                    className="flex-grow flex flex-col items-center justify-between px-4 py-6 md:px-8 md:py-8 gap-4 text-center lg:text-left lg:flex-row hover:bg-zinc-900 transition-all cursor-pointer group/data"
                  >
                    <div className="w-full">
                      <h3 className="font-headline text-sm md:text-3xl font-bold uppercase tracking-tight text-zinc-100 truncate group-hover/data:text-primary transition-colors">{beat.title}</h3>
                      <p className="font-mono text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{beat.genre}</p>
                      <div className="lg:hidden mt-2 font-headline text-xs font-bold text-zinc-400">{beat.bpm} BPM</div>
                    </div>
                    
                    <div className="hidden lg:flex flex-col items-end w-32">
                      <span className="font-headline text-2xl font-bold text-zinc-100">{beat.bpm}</span>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">BPM</span>
                    </div>
                  </Link>
  
                  <div className="w-full lg:w-64 flex flex-row items-stretch border-t lg:border-t-0 lg:border-l border-zinc-800">
                    <button className="flex-1 flex items-center justify-center p-3 md:p-6 border-r border-zinc-800 hover:bg-zinc-800 transition-colors">
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-zinc-50 fill-current" />
                    </button>
                    <Link 
                      href={`/catalog/${beat.id}`}
                      className="flex-[2] bg-zinc-50 text-zinc-950 font-black uppercase text-[10px] md:text-xs tracking-widest px-4 md:px-8 py-3 md:py-6 active:scale-95 transition-all text-center flex items-center justify-center"
                    >
                      BUY
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 flex items-center justify-center bg-zinc-950">
               <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-600">No_Beats_Found_In_This_Sector</p>
            </div>
          )}
        </section>

        {/* --- Licensing & Packs --- */}
        <section className="mt-16 md:mt-24 px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800 border-y-2 border-zinc-800 text-zinc-100">
          {/* Licensing - Hidden on Mobile */}
          <div className="hidden md:flex bg-zinc-950 p-8 md:p-12 flex-col gap-8">
            <h4 className="font-headline text-3xl md:text-4xl font-black uppercase italic tracking-tighter">LICENSING</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-zinc-900 pb-2">
                <span className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase">Basic Lease</span>
                <span className="font-headline font-bold text-zinc-100">$29.99</span>
              </div>
              <div className="flex justify-between items-end border-b border-zinc-900 pb-2">
                <span className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase">Premium Lease</span>
                <span className="font-headline font-bold text-zinc-100">$79.99</span>
              </div>
              <div className="flex justify-between items-end border-b border-zinc-900 pb-2">
                <span className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase">Exclusive</span>
                <span className="font-headline font-bold text-zinc-100">$499.00+</span>
              </div>
            </div>
            <button className="w-full border-2 border-zinc-50 py-4 font-bold uppercase tracking-widest hover:bg-zinc-50 hover:text-zinc-950 transition-all">Read Full Contract</button>
          </div>

          <div className="bg-zinc-900 p-8 md:p-12 relative overflow-hidden flex flex-col justify-between group">
            <div className="z-10">
              <span className="bg-zinc-50 text-zinc-950 px-2 py-1 text-[10px] font-black uppercase mb-4 inline-block tracking-tighter">DRUM_KIT_01</span>
              <h4 className="font-headline text-2xl md:text-5xl font-black uppercase leading-none mb-4 md:mb-6">PREMIUM_SAMPLES</h4>
              <p className="text-xs md:text-sm text-zinc-400 max-w-xs">High-quality drum hits and melody loops for professional production.</p>
            </div>
            <div className="mt-8 md:mt-12 z-10">
              <button className="bg-zinc-50 text-zinc-950 font-black uppercase px-10 md:px-12 py-3 md:py-4 tracking-tighter text-base md:text-lg hover:scale-105 transition-transform">Get Here</button>
            </div>
            <div className="absolute -right-16 -bottom-16 md:-right-20 md:-bottom-20 opacity-10 group-hover:opacity-20 transition-opacity">
               <div className="w-[200px] md:w-[300px] h-[200px] md:h-[300px] border-8 border-zinc-50 rounded-full animate-[spin_10s_linear_infinite]"></div>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
