"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c8ff00] flex items-center justify-center">
            <span
              className="text-black font-black text-sm"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              AI
            </span>
          </div>
          <div>
            <h1
              className="text-base font-bold leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Nulisin
            </h1>
            <p className="text-[10px] text-white/30 leading-none">
              Powered by OpenRouter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c8ff00] pulse-dot inline-block" />
            <span className="text-xs text-white/40 hidden sm:inline">
              AI Ready
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40 hidden md:inline truncate max-w-[160px]">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-all border border-white/5 disabled:opacity-50"
              >
                {loggingOut ? "..." : "Keluar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
