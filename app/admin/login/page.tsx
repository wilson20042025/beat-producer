"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already logged in, skip login
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push("/admin");
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-['Space_Grotesk'] text-zinc-50 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 debug-grid opacity-[0.03] pointer-events-none"></div>

      <div className="w-full max-w-sm z-10">
        <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-zinc-800 mb-6 group-hover:border-zinc-50 transition-colors">
                <Lock className="text-zinc-500 group-hover:text-zinc-50" size={32} />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">ADMIN_LOGIN</h1>
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.4em] mt-2">RESTRICTED_ACCESS // PROTOCOL_V3.2</p>
        </div>

        {error && (
            <div className="bg-red-900/10 border border-red-900/50 p-4 mb-6 flex items-start gap-3 animate-shake">
                <ShieldAlert className="text-red-500 shrink-0" size={16} />
                <p className="text-[10px] font-mono text-red-500 uppercase leading-relaxed">{error}</p>
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">IDENTIFIER (EMAIL)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 p-4 font-mono text-sm focus:border-zinc-50 outline-none transition-all placeholder:text-zinc-800 uppercase"
              placeholder="ENTER_ADMIN_EMAIL"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">PASSCODE</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 p-4 font-mono text-sm focus:border-zinc-50 outline-none transition-all placeholder:text-zinc-800 uppercase"
              placeholder="ENTER_PASSCODE"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-50 text-zinc-950 p-6 font-headline font-black uppercase text-xl flex items-center justify-between hover:invert transition-all active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? "AUTHENTICATING..." : "INITIATE_SESSION"}</span>
            <ArrowRight size={24} />
          </button>
        </form>

        <p className="mt-12 text-center font-mono text-[8px] text-zinc-700 uppercase tracking-[0.5em]">
            SYSTEM_SECURED_BY_SUPABASE_SHIELD
        </p>
      </div>
    </main>
  );
}
