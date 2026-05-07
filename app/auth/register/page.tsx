"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

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
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#c8ff00]/10 border border-[#c8ff00]/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-[#c8ff00] text-2xl">✓</span>
          </div>
          <h2
            className="text-xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Cek email kamu!
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Kami mengirim link konfirmasi ke{" "}
            <span className="text-white/80">{email}</span>. Klik link tersebut
            untuk mengaktifkan akun.
          </p>
          <Link
            href="/auth/login"
            className="text-[#c8ff00] text-sm hover:underline"
          >
            ← Kembali ke login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c8ff00]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-[#c8ff00] flex items-center justify-center mb-4">
            <span
              className="text-black font-black text-lg"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              AI
            </span>
          </div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Buat Akun Gratis
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Mulai generate konten AI sekarang
          </p>
        </div>

        <div className="bg-[#111118] border border-white/8 rounded-2xl p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs text-white/50 mb-2 font-medium tracking-wider uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="kamu@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c8ff00]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-2 font-medium tracking-wider uppercase">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 karakter"
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c8ff00]/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8ff00] text-black font-bold py-3 rounded-xl text-sm hover:bg-[#d4ff33] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Membuat akun..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="mt-4 text-white/30 text-xs text-center">
            Dengan mendaftar, kamu menyetujui ketentuan penggunaan kami.
          </p>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-white/40 text-sm">
              Sudah punya akun?{" "}
              <Link
                href="/auth/login"
                className="text-[#c8ff00] hover:underline font-medium"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
