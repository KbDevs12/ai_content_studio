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
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          {(["generate", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#c8ff00] text-black"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab === "generate"
                ? "✦ Generate"
                : `⏱ History (${history.length})`}
            </button>
          ))}
        </div>

        {activeTab === "generate" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
            <ContentForm
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              onStop={handleStop}
            />
            <OutputPanel
              output={output}
              isGenerating={isGenerating}
              error={error}
              activeModel={activeModel}
              fallbackModels={fallbackModels}
              meta={currentMeta}
            />
          </div>
        ) : (
          <HistoryPanel
            history={history}
            onLoad={handleLoadHistory}
            onClear={handleClearHistory}
          />
        )}
      </div>
    </main>
  );
}
