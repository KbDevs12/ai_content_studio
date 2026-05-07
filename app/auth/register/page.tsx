"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Sparkle,
  EnvelopeSimple,
  Lock,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react";

export default function RegisterPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  // Success State
  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-4">
        {/* Glow */}
        <div className="absolute top-[-150px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#c8ff00]/10 blur-[140px]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#c8ff00]/10 border border-[#c8ff00]/20">
            <CheckCircle size={40} weight="fill" className="text-[#c8ff00]" />
          </div>

          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Check Your Email
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-white/45">
            Kami sudah mengirim link verifikasi ke:
          </p>

          <p className="mt-2 break-all text-sm font-medium text-white">
            {email}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-white/35">
            Klik link verifikasi di email untuk mengaktifkan akun kamu.
          </p>

          <Link
            href="/auth/login"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#c8ff00] px-5 py-3 text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-[#d7ff4d]"
          >
            Kembali ke Login
            <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-150px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#c8ff00]/10 blur-[140px]" />

        <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c8ff00] shadow-[0_0_40px_rgba(200,255,0,0.35)]">
              <Sparkle size={30} weight="fill" className="text-black" />
            </div>

            <h1
              className="mt-5 text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Create Account
            </h1>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/45">
              Mulai workflow AI content creation kamu sekarang.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
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
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
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
              {loading ? "Creating Account..." : "Create Account"}

              {!loading && (
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-5 text-center text-xs leading-relaxed text-white/25">
            Dengan membuat akun, kamu menyetujui Terms of Service dan Privacy
            Policy kami.
          </p>

          {/* Footer */}
          <div className="mt-6 border-t border-white/5 pt-6 text-center text-sm text-white/35">
            Sudah punya akun?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#c8ff00] hover:text-[#d7ff4d]"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
