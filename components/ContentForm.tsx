"use client";

import { useState } from "react";

interface Props {
  onGenerate: (params: {
    topic: string;
    contentType: string;
    tone: string;
    keywords: string;
    length: string;
    language: string;
  }) => void;
  isGenerating: boolean;
  onStop: () => void;
}

const CONTENT_TYPES = [
  { value: "blog-post", label: "Blog Post", icon: "✍️" },
  { value: "social-media", label: "Social Media", icon: "📱" },
  { value: "email", label: "Email", icon: "📧" },
  { value: "product-description", label: "Product Desc", icon: "🛍️" },
  { value: "brainstorm", label: "Brainstorm", icon: "💡" },
  { value: "press-release", label: "Press Release", icon: "📰" },
];

const TONES = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "persuasive", label: "Persuasive" },
  { value: "humorous", label: "Humorous" },
  { value: "inspirational", label: "Inspirational" },
  { value: "technical", label: "Technical" },
];

const LENGTHS = [
  { value: "short", label: "Short", desc: "~400 words" },
  { value: "medium", label: "Medium", desc: "~800 words" },
  { value: "long", label: "Long", desc: "~1500 words" },
];

export function ContentForm({ onGenerate, isGenerating, onStop }: Props) {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("blog-post");
  const [tone, setTone] = useState("casual");
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState("medium");
  const [language, setLanguage] = useState("en");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({ topic, contentType, tone, keywords, length, language });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Topic */}
      <div className="bg-[#111118] rounded-2xl p-5 border border-white/5">
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
          Topic / Subject
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. The future of remote work in Southeast Asia"
          rows={3}
          className="w-full bg-transparent text-white placeholder-white/20 text-sm leading-relaxed resize-none outline-none"
          required
        />
        <div className="mt-2 flex justify-between">
          <span className="text-[10px] text-white/20">Be specific for better results</span>
          <span className={`text-[10px] ${topic.length > 400 ? "text-red-400" : "text-white/20"}`}>
            {topic.length}/500
          </span>
        </div>
      </div>

      {/* Content Type */}
      <div className="bg-[#111118] rounded-2xl p-5 border border-white/5">
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
          Content Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => setContentType(ct.value)}
              className={`p-3 rounded-xl text-center transition-all duration-150 border ${
                contentType === ct.value
                  ? "bg-[#c8ff00]/10 border-[#c8ff00]/40 text-[#c8ff00]"
                  : "border-white/5 text-white/40 hover:border-white/15 hover:text-white/70"
              }`}
            >
              <div className="text-lg mb-1">{ct.icon}</div>
              <div className="text-[10px] font-semibold leading-tight">{ct.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div className="bg-[#111118] rounded-2xl p-5 border border-white/5">
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
          Tone
        </label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTone(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
                tone === t.value
                  ? "bg-[#c8ff00] text-black border-[#c8ff00]"
                  : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Length + Language */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111118] rounded-2xl p-5 border border-white/5">
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            Length
          </label>
          <div className="space-y-2">
            {LENGTHS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLength(l.value)}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-xs transition-all border ${
                  length === l.value
                    ? "bg-[#c8ff00]/10 border-[#c8ff00]/30 text-[#c8ff00]"
                    : "border-transparent text-white/40 hover:text-white/70 hover:border-white/10"
                }`}
              >
                <span className="font-semibold">{l.label}</span>
                <span className="text-[10px] opacity-60">{l.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#111118] rounded-2xl p-5 border border-white/5">
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            Language
          </label>
          <div className="space-y-2">
            {[
              { value: "en", label: "🇺🇸 English" },
              { value: "id", label: "🇮🇩 Bahasa Indonesia" },
            ].map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => setLanguage(lang.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                  language === lang.value
                    ? "bg-[#c8ff00]/10 border-[#c8ff00]/30 text-[#c8ff00]"
                    : "border-transparent text-white/40 hover:text-white/70 hover:border-white/10"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-[#111118] rounded-2xl p-5 border border-white/5">
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
          Keywords <span className="text-white/20 normal-case font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g. productivity, AI tools, automation"
          className="w-full bg-transparent text-white placeholder-white/20 text-sm outline-none"
        />
      </div>

      {/* Submit */}
      {isGenerating ? (
        <button
          type="button"
          onClick={onStop}
          className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all"
        >
          ⏹ Stop Generating
        </button>
      ) : (
        <button
          type="submit"
          disabled={!topic.trim()}
          className="w-full py-4 rounded-2xl bg-[#c8ff00] text-black text-sm font-bold hover:bg-[#d4ff33] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[#c8ff00]/10"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          ✦ Generate Content
        </button>
      )}
    </form>
  );
}
