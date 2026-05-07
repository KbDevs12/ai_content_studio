"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ContentForm } from "@/components/ContentForm";
import { OutputPanel } from "@/components/OutputPanel";
import { HistoryPanel } from "@/components/HistoryPanel";
import { Header } from "@/components/Header";
import { HistoryItem, normalizeHistoryItem } from "@/types";

export default function Home() {
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [fallbackModels, setFallbackModels] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"generate" | "history">(
    "generate",
  );
  const [currentMeta, setCurrentMeta] = useState<{
    type: string;
    tone: string;
    topic: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // ── Load history from Supabase on mount ─────────────────────────────────
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const { data } = await res.json();
        setHistory((data ?? []).map(normalizeHistoryItem));
      }
    } catch {
      // silently fail — history just shows empty
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchHistory();
  }, [fetchHistory]);

  // ── Save to Supabase ─────────────────────────────────────────────────────
  const saveToHistory = async (item: Omit<HistoryItem, "id" | "createdAt">) => {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const { data } = await res.json();
        setHistory((prev) =>
          [normalizeHistoryItem(data), ...prev].slice(0, 50),
        );
      }
    } catch {
      // silently fail
    }
  };

  const handleGenerate = async (params: {
    topic: string;
    contentType: string;
    tone: string;
    keywords: string;
    length: string;
    language: string;
  }) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setOutput("");
    setError(null);
    setActiveModel(null);
    setFallbackModels([]);
    setIsGenerating(true);
    setCurrentMeta({
      type: params.contentType,
      tone: params.tone,
      topic: params.topic,
    });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        setError(`Request failed (HTTP ${res.status}). Coba lagi.`);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;

          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) {
              setError(parsed.error);
              return;
            }
            if (parsed._model) setActiveModel(parsed._model);
            if (parsed._fallback)
              setFallbackModels((prev) => [...prev, parsed._fallback]);
            if (parsed.text) {
              fullText += parsed.text;
              setOutput(fullText);
            }
          } catch {
            /* skip malformed chunk */
          }
        }
      }

      if (fullText) {
        await saveToHistory({
          topic: params.topic,
          contentType: params.contentType,
          tone: params.tone,
          language: params.language,
          output: fullText,
        });
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError("Koneksi gagal. Periksa jaringan dan coba lagi.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsGenerating(false);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setOutput(item.output);
    setError(null);
    setActiveModel(null);
    setFallbackModels([]);
    setCurrentMeta({
      type: item.contentType,
      tone: item.tone,
      topic: item.topic,
    });
    setActiveTab("generate");
  };

  const handleClearHistory = async () => {
    await fetch("/api/history", { method: "DELETE" });
    setHistory([]);
  };

  // ── Skeleton while mounting ──────────────────────────────────────────────
  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-2 mb-8">
            <div className="px-6 py-2.5 rounded-full bg-[#c8ff00] text-black text-sm font-semibold">
              Generate
            </div>
            <div className="px-6 py-2.5 rounded-full bg-white/5 text-white/50 text-sm font-semibold">
              History (0)
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
            <div className="space-y-5">
              {[120, 180, 100, 80, 60].map((h, i) => (
                <div
                  key={i}
                  className="bg-[#111118] rounded-2xl border border-white/5 shimmer"
                  style={{ height: h }}
                />
              ))}
            </div>
            <div className="bg-[#111118] rounded-2xl border border-white/5 min-h-[600px]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-[-250px] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-[#c8ff00]/10 blur-[180px]" />

        <div className="absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[140px]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />

        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light [background-image:url('/noise.png')]" />
      </div>

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Content */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-8">
        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/50 backdrop-blur-xl">
            ✦ AI Content Studio
          </div>

          <h1
            className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Generate Content
            <span className="block text-[#c8ff00]">Faster Than Ever.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/45 sm:text-base">
            Generate high quality AI content dengan multiple models, streaming
            realtime output, dan smart history management.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {(["generate", "history"] as const).map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative overflow-hidden rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "border-[#c8ff00]/30 bg-[#c8ff00] text-black shadow-[0_0_50px_rgba(200,255,0,0.15)]"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {tab === "generate" ? (
                    <>✦ Generate</>
                  ) : (
                    <>
                      ⏱ History
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          active
                            ? "bg-black/10 text-black"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {history.length}
                      </span>
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Layout */}
        {activeTab === "generate" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[430px_1fr]">
            {/* Left Panel */}
            <div className="relative">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/[0.06] to-transparent opacity-60" />

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl">
                {/* Panel Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                      Content Builder
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                      AI Generator
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c8ff00]/10 text-[#c8ff00]">
                    ✦
                  </div>
                </div>

                <ContentForm
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  onStop={handleStop}
                />
              </div>
            </div>

            {/* Right Panel */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
              {/* Top Glow */}
              <div className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-[#c8ff00]/5 to-transparent" />

              {/* Header */}
              <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/5 px-6 py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                    Live Output
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    Generated Result
                  </h2>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <div className="flex items-center gap-2 rounded-full border border-[#c8ff00]/20 bg-[#c8ff00]/10 px-4 py-2 text-xs font-medium text-[#c8ff00]">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-[#c8ff00]" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                      Ready
                    </div>
                  )}
                </div>
              </div>

              {/* Meta */}
              {currentMeta && (
                <div className="flex flex-wrap gap-2 border-b border-white/5 px-6 py-4">
                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
                    {currentMeta.type}
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
                    {currentMeta.tone}
                  </div>

                  <div className="rounded-full border border-[#c8ff00]/15 bg-[#c8ff00]/5 px-3 py-1 text-xs text-[#c8ff00]">
                    {currentMeta.topic}
                  </div>
                </div>
              )}

              {/* Output */}
              <div className="relative min-h-[700px] p-6">
                <OutputPanel
                  output={output}
                  isGenerating={isGenerating}
                  error={error}
                  activeModel={activeModel}
                  fallbackModels={fallbackModels}
                  meta={currentMeta}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
            {/* Glow */}
            <div className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-[#c8ff00]/5 to-transparent" />

            <div className="relative border-b border-white/5 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                Saved Data
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                History Library
              </h2>
            </div>

            <div className="p-6">
              <HistoryPanel
                history={history}
                onLoad={handleLoadHistory}
                onClear={handleClearHistory}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
