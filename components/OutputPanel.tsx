"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  output: string;
  isGenerating: boolean;
  error?: string | null;
  activeModel?: string | null;
  fallbackModels?: string[];
  meta: { type: string; tone: string; topic: string } | null;
}

export function OutputPanel({
  output,
  isGenerating,
  error,
  activeModel,
  fallbackModels = [],
  meta,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");

  useEffect(() => {
    if (output) {
      const words = output.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [output]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isEmpty = !output && !isGenerating && !error;

  // Shorten model name for display: "meta-llama/llama-4-scout:free" → "llama-4-scout"
  const shortModelName = (model: string) =>
    model.split("/").pop()?.replace(":free", "") ?? model;

  return (
    // Fixed height container — adjust h-[600px] to your layout needs
    <div className="bg-[#111118] rounded-2xl border border-white/5 flex flex-col h-[600px]">
      {/* Panel header — flex-shrink-0 so it never compresses */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${
              error
                ? "bg-red-500"
                : isGenerating
                  ? "bg-[#c8ff00] pulse-dot"
                  : output
                    ? "bg-green-400"
                    : "bg-white/15"
            }`}
          />
          <span className="text-xs font-semibold text-white/40">
            {error
              ? "Error"
              : isGenerating
                ? "Generating..."
                : output
                  ? "Output Ready"
                  : "Waiting for input"}
          </span>
          {wordCount > 0 && (
            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-white/30">
              {wordCount} words
            </span>
          )}
        </div>

        {output && (
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex bg-white/5 rounded-lg p-0.5">
              {(["preview", "raw"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    viewMode === mode
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {mode === "preview" ? "Preview" : "Raw"}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                copied
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "border-white/10 text-white/50 hover:border-white/25 hover:text-white"
              }`}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 text-white/50 hover:border-white/25 hover:text-white transition-all"
            >
              ↓ .md
            </button>
          </div>
        )}
      </div>

      {/* Meta info — flex-shrink-0 */}
      {meta && (output || isGenerating) && !error && (
        <div className="flex-shrink-0 px-5 py-3 border-b border-white/5 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] bg-[#c8ff00]/10 text-[#c8ff00] px-2 py-1 rounded-md font-semibold">
            {meta.type.replace("-", " ").toUpperCase()}
          </span>
          <span className="text-[10px] bg-white/5 text-white/40 px-2 py-1 rounded-md">
            {meta.tone}
          </span>
          <span className="text-[10px] text-white/20 py-1 truncate max-w-xs">
            "{meta.topic}"
          </span>
          {activeModel && (
            <span className="ml-auto text-[10px] bg-white/3 text-white/25 px-2 py-1 rounded-md font-mono">
              ⚡ {shortModelName(activeModel)}
            </span>
          )}
        </div>
      )}

      {/* Fallback notice — flex-shrink-0, shown during generation if we had to fall back */}
      {fallbackModels.length > 0 && isGenerating && (
        <div className="flex-shrink-0 px-5 py-2 border-b border-yellow-500/10 bg-yellow-500/5 flex items-center gap-2">
          <span className="text-yellow-400/70 text-[10px]">
            ⚠ Rate-limited:
          </span>
          <span className="text-[10px] text-white/30 font-mono">
            {fallbackModels.map(shortModelName).join(" → ")}
          </span>
        </div>
      )}

      {/* Content area — flex-1 + overflow-y-auto makes this the only scrollable zone */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Error state */}
        {error && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 fade-in">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl">
              ✕
            </div>
            <div>
              <p className="text-red-400 text-sm font-semibold mb-1">
                Generation Failed
              </p>
              <p className="text-white/30 text-xs leading-relaxed max-w-xs">
                {error}
              </p>
            </div>
            {fallbackModels.length > 0 && (
              <div className="text-[10px] text-white/20 bg-white/3 px-3 py-2 rounded-lg">
                Tried {fallbackModels.length} model
                {fallbackModels.length > 1 ? "s" : ""}:{" "}
                {fallbackModels.map(shortModelName).join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 select-none">
            <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center text-2xl">
              ✦
            </div>
            <div>
              <p className="text-white/20 text-sm font-medium">
                Your content will appear here
              </p>
              <p className="text-white/10 text-xs mt-1">
                Fill in the form and click Generate
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              {["Blog Post", "Email", "Social Media", "Brainstorm"].map((t) => (
                <span
                  key={t}
                  className="text-[10px] bg-white/3 text-white/15 px-2 py-1 rounded-full border border-white/5"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Loading skeleton (generating but no text yet) */}
        {isGenerating && !output && !error && (
          <div className="space-y-3 fade-in">
            {[70, 90, 55, 80, 40].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded-full shimmer"
                style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {/* Output content */}
        {output && !error && (
          <div className={`fade-in ${isGenerating ? "cursor-blink" : ""}`}>
            {viewMode === "preview" ? (
              <div className="prose-output text-sm">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <pre className="text-xs text-white/70 font-mono whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
