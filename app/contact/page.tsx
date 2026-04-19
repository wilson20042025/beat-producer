"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export default function ContactPage() {
  const [selectedScope, setSelectedScope] = useState("Mixing_Mastering");

  const scopes = [
    "Custom_Production",
    "Mixing_Mastering",
    "Sound_Design",
    "Licensing",
    "Consultation",
    "Other"
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-32 px-4 md:px-6 lg:px-24 max-w-7xl mx-auto">
        {/* Technical Breadcrumb / Meta */}
        <div className="flex justify-between items-end mb-12 border-b-4 border-zinc-50 pb-4">
          <div>
            <p className="font-headline text-[10px] tracking-[0.2em] text-outline uppercase">TERMINAL_ID: LXB-2024-X</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="font-headline text-[10px] tracking-[0.2em] text-outline uppercase">STATUS: READY_FOR_TRANSMISSION</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Form Canvas */}
          <section className="lg:col-span-12">
            <form className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block font-headline text-xs font-bold tracking-[0.3em] text-outline mb-4 group-focus-within:text-zinc-50 transition-colors uppercase">01_SENDER_IDENTITY</label>
                  <input 
                    className="w-full bg-transparent border-4 border-zinc-50 p-4 font-headline text-lg focus:bg-zinc-50 focus:text-zinc-950 outline-none transition-all placeholder:text-zinc-800 uppercase" 
                    placeholder="ENTER_NAME_OR_ENTITY" 
                    type="text" 
                  />
                </div>
                <div className="group">
                  <label className="block font-headline text-xs font-bold tracking-[0.3em] text-outline mb-4 group-focus-within:text-zinc-50 transition-colors uppercase">02_CONTACT_UPLINK</label>
                  <input 
                    className="w-full bg-transparent border-4 border-zinc-50 p-4 font-headline text-lg focus:bg-zinc-50 focus:text-zinc-950 outline-none transition-all placeholder:text-zinc-800 uppercase" 
                    placeholder="ENTER_CONTACT_NUMBER" 
                    type="tel" 
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="block font-headline text-xs font-bold tracking-[0.3em] text-outline mb-4 group-focus-within:text-zinc-50 transition-colors uppercase">03_PROJECT_SCOPE</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border-2 border-zinc-50">
                  {scopes.map((scope) => (
                    <button 
                      key={scope}
                      onClick={() => setSelectedScope(scope)}
                      className={`border-2 border-zinc-50 p-3 font-headline text-xs font-bold transition-colors uppercase ${
                        selectedScope === scope 
                        ? "bg-zinc-50 text-zinc-950" 
                        : "hover:bg-zinc-50 hover:text-zinc-950"
                      }`} 
                      type="button"
                    >
                      {scope.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="group">
                <label className="block font-headline text-xs font-bold tracking-[0.3em] text-outline mb-4 group-focus-within:text-zinc-50 transition-colors uppercase">04_DATA_PAYLOAD</label>
                <textarea 
                  className="w-full bg-transparent border-4 border-zinc-50 p-4 font-headline text-lg focus:bg-zinc-50 focus:text-zinc-950 outline-none transition-all placeholder:text-zinc-800 uppercase resize-none font-headline" 
                  placeholder="DESCRIBE_PROJECT_PARAMETERS_AND_REQUIREMENTS" 
                  rows={4}
                ></textarea>
              </div>
              
              <div className="pt-8">
                <button className="w-full bg-zinc-50 text-zinc-950 py-5 px-10 font-headline text-xl md:text-2xl font-black tracking-tighter hover:bg-zinc-950 hover:text-zinc-50 border-4 border-zinc-50 transition-all flex justify-between items-center group" type="submit">
                  <span>SEND_LUXBEATZ</span>
                  <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
