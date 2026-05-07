"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  DiscordLogo,
  EnvelopeSimple,
  Lock,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const loginWithDiscord = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        scopes: "identify email",
        redirectTo: `${window.location.origin}/api/callback`,
      },
    });
  };

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
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#050507] relative overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#c8ff00]/10 blur-[140px] rounded-full" />

        <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#c8ff00] flex items-center justify-center shadow-[0_0_40px_rgba(200,255,0,0.35)]">
              <Sparkle size={30} weight="fill" className="text-black" />
            </div>

            <h1
              className="mt-5 text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Content Studio
            </h1>

            <p className="text-white/45 text-sm mt-2 leading-relaxed max-w-xs">
              Masuk dan lanjutkan workflow AI content creation kamu.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">
                Email
              </label>

              <div className="relative">
                <EnvelopeSimple
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  type="email"
                  placeholder="kamu@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#c8ff00]/50 focus:bg-white/[0.06]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#c8ff00]/50 focus:bg-white/[0.06]"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8ff00] py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.01] hover:bg-[#d7ff4d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Masuk..." : "Masuk"}

              {!loading && (
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-[#0b0b10] px-4 text-xs uppercase tracking-[0.2em] text-white/30">
                atau
              </span>
            </div>
          </div>

          {/* Discord */}
          <button
            onClick={loginWithDiscord}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-[#5865F2]/30 bg-[#5865F2]/15 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#5865F2]/50 hover:bg-[#5865F2]/25"
          >
            <DiscordLogo
              size={22}
              weight="fill"
              className="transition-transform group-hover:scale-110"
            />
            Masuk dengan Discord
          </button>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-white/35">
            Belum punya akun?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-[#c8ff00] hover:text-[#d7ff4d]"
            >
              Daftar gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
