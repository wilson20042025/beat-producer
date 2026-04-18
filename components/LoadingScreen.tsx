"use client";

import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, ChevronRight } from "lucide-react";

/**
 * LoadingScreen Component
 * 
 * A cinematic entry gate for the Luxbeatz portfolio.
 */
export function LoadingScreen() {
  const [hasStarted, setHasStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isWhiteTransition, setIsWhiteTransition] = useState(false);
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  
  // Skip for admin workstation
  const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  
  const fullText = '"Healing Your Pain Through Music"';
  const typewriterSpeed = 150; 

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);

    const lastSession = localStorage.getItem("lux_last_session");
    const sessionTimeout = 30 * 60 * 1000;

    if (lastSession) {
      if (Date.now() - parseInt(lastSession) < sessionTimeout) {
        setLoading(false);
        return;
      }
    }

    const audio = new Audio("/Iloveluxbeatz.mp3");
    audio.volume = 0.6;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const handleStart = () => {
    if (!audioRef.current || hasStarted) return;
    
    setHasStarted(true);
    localStorage.setItem("lux_last_session", Date.now().toString());
    audioRef.current.play().catch(err => console.error("Playback failed:", err));

    // Cinematic Timer: 6 seconds of waveform animation
    setTimeout(() => {
      setShowTypewriter(true);
      startTypewriter();
    }, 6000);
  };

  const startTypewriter = () => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTypingFinished(true);
      }
    }, typewriterSpeed);
  };

  const triggerExit = () => {
    if (!isTypingFinished) return;
    
    setIsWhiteTransition(true);
    
    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1;
        } else {
          clearInterval(fadeOut);
          audio.pause();
        }
      }, 50);
    }

    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  if (!mounted || !loading || isAdminPath) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-[1100] bg-white transition-opacity duration-700 pointer-events-none ${isWhiteTransition ? "opacity-100" : "opacity-0"}`}
      ></div>

      <div className="fixed inset-0 z-[1000] bg-zinc-950 flex flex-col items-center justify-center font-['Space_Grotesk'] text-zinc-50 overflow-hidden text-center">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0 debug-grid"></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-50 animate-[scanline_8s_linear_infinite]"></div>
        </div>

        {!hasStarted ? (
          /* PHASE 1: Interaction Gate */
          <div
            className="group cursor-pointer flex flex-col items-center justify-center gap-8 px-6"
            onClick={handleStart}
          >
            <div className="text-center w-full">
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic uppercase glitch-text mb-4">
                LUXBEATZ
              </h1>
              <p className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-zinc-500 uppercase">
                EST_2024 // SYSTEM_INITIALIZING
              </p>
            </div>
            <button className="relative border-2 border-zinc-50 px-12 py-5 font-headline font-black text-lg md:text-xl tracking-widest uppercase hover:bg-zinc-50 hover:text-zinc-950 transition-all group-hover:scale-105 active:scale-95">
              Continue
            </button>
          </div>
        ) : (
          /* PHASE 2: Cinematic Intro */
          <div 
            onClick={triggerExit}
            className={`relative w-full h-full flex flex-col items-center justify-center gap-12 px-6 ${isTypingFinished ? "cursor-pointer" : "cursor-default"}`}
          >
            
            {/* Waveform Animation */}
            {!showTypewriter && (
              <div className="h-32 md:h-48 flex items-center justify-center gap-[3px] md:gap-2 w-full overflow-hidden transition-opacity duration-500">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[3px] md:w-[6px] bg-zinc-50 transition-all duration-300"
                    style={{
                      height: `${20 + Math.random() * 80}%`,
                      animation: `waveform ${0.5 + Math.random()}s ease-in-out infinite`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  ></div>
                ))}
              </div>
            )}

            {/* Quoted Typewriter Message */}
            {showTypewriter && (
              <div className="flex flex-col items-center gap-8 md:gap-12 w-full max-w-2xl">
                <div className="min-h-[60px] md:min-h-[100px] flex items-center justify-center">
                  <h2 className="text-xl md:text-4xl font-mono text-center tracking-tight text-zinc-300 italic px-4">
                    {displayText}
                    {!isTypingFinished && (
                      <span className="inline-block w-2 h-6 md:h-10 bg-zinc-50 ml-2 animate-pulse align-middle"></span>
                    )}
                  </h2>
                </div>
                
                {/* Instruction - Appears after typewriter finishes */}
                {isTypingFinished && (
                  <div className="flex flex-col items-center gap-8 animate-[fadeIn_1s_ease-out_forwards]">
                    <p className="text-[10px] md:text-xs font-mono tracking-[0.4em] text-zinc-400 uppercase animate-pulse">
                      tap anywhere to enter studio
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
