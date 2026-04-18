"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const getTitle = () => {
    switch (pathname) {
      case "/catalog": return "LUXBEATZ_STORE";
      case "/projects": return "LUXBEATZ_PROJECTS";
      case "/contact": return "ENQUIRY";
      default: return "@LUXBEATZ";
    }
  };

  return (
    <>
      <header className="bg-zinc-950 text-zinc-50 font-['Space_Grotesk'] uppercase tracking-tighter font-bold flex justify-between items-center w-full px-4 md:px-6 py-3 md:py-4 z-[60] fixed top-0 border-b-2 border-zinc-50">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/">
            <h1 className="text-lg md:text-2xl font-black tracking-[-0.04em] text-zinc-50 uppercase truncate">
              {getTitle()}
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-4 text-sm items-center">
            <Link
              className={`transition-colors duration-100 px-2 py-1 ${
                pathname === "/" 
                ? "text-zinc-50 underline decoration-2 underline-offset-4" 
                : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
              href="/"
            >
              HOME
            </Link>
            <Link
              className={`transition-colors duration-100 px-2 py-1 ${
                pathname === "/catalog" 
                ? "text-zinc-50 underline decoration-2 underline-offset-4" 
                : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
              href="/catalog"
            >
              LUX BEAT STORE
            </Link>
            <Link
              className={`transition-colors duration-100 px-2 py-1 ${
                pathname === "/projects" 
                ? "text-zinc-50 underline decoration-2 underline-offset-4" 
                : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
              href="/projects"
            >
              PROJECTS
            </Link>
            <Link
              className={`transition-colors duration-100 px-2 py-1 ${
                pathname === "/contact" 
                ? "text-zinc-50 underline decoration-2 underline-offset-4" 
                : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
              href="/contact"
            >
              CONTACT
            </Link>
          </nav>
          <Activity className="w-5 h-5 text-zinc-50" strokeWidth={3} />
        </div>
      </header>
    </>
  );
}
