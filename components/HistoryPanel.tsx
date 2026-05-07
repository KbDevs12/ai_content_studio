"use client";

import { HistoryItem } from "@/types";

interface Props {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onClear: () => void;
}

const TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  "blog-post": { label: "Blog Post", icon: "✍️" },
  "social-media": { label: "Social", icon: "📱" },
  "email": { label: "Email", icon: "📧" },
  "product-description": { label: "Product", icon: "🛍️" },
  "brainstorm": { label: "Brainstorm", icon: "💡" },
  "press-release": { label: "Press", icon: "📰" },
};

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export function HistoryPanel({ history, onLoad, onClear }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center text-2xl">
          ⏱
        </div>
        <div>
          <p className="text-white/20 text-sm font-medium">No history yet</p>
          <p className="text-white/10 text-xs mt-1">Your generated content will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-white/40">{history.length} item{history.length !== 1 ? "s" : ""} saved locally</p>
        <button
          onClick={onClear}
          className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {history.map((item) => {
          const meta = TYPE_LABELS[item.contentType] || { label: item.contentType, icon: "📄" };
          const preview = item.output.replace(/#+\s/g, "").replace(/\*+/g, "").slice(0, 150);
          const words = item.output.trim().split(/\s+/).length;

          return (
            <div
              key={item.id}
              className="bg-[#111118] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group cursor-pointer"
              onClick={() => onLoad(item)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meta.icon}</span>
                  <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {meta.label}
                  </span>
                </div>
                <span className="text-[10px] text-white/20">{timeAgo(item.createdAt)}</span>
              </div>

              <p className="text-sm font-semibold text-white/80 mb-2 leading-snug line-clamp-2" style={{ fontFamily: "var(--font-syne)" }}>
                {item.topic}
              </p>

              <p className="text-xs text-white/30 line-clamp-3 leading-relaxed mb-4">
                {preview}...
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full">
                    {item.tone}
                  </span>
                  <span className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full">
                    {item.language === "id" ? "🇮🇩" : "🇺🇸"}
                  </span>
                </div>
                <span className="text-[10px] text-white/20">{words} words</span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-[#c8ff00]/0 group-hover:text-[#c8ff00]/80 transition-all duration-200">
                  Load this →
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(item.output);
                  }}
                  className="text-[10px] text-white/20 hover:text-white/60 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
