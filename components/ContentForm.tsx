"use client";

import { useState } from "react";
import {
  Sparkle,
  Article,
  DeviceMobile,
  EnvelopeSimple,
  ShoppingBagOpen,
  Lightbulb,
  Newspaper,
  Globe,
  TextAlignLeft,
  Lightning,
  Stop,
} from "@phosphor-icons/react";

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
  {
    value: "blog-post",
    label: "Blog Post",
    icon: Article,
  },
  {
    value: "social-media",
    label: "Social Media",
    icon: DeviceMobile,
  },
  {
    value: "email",
    label: "Email",
    icon: EnvelopeSimple,
  },
  {
    value: "product-description",
    label: "Product Desc",
    icon: ShoppingBagOpen,
  },
  {
    value: "brainstorm",
    label: "Brainstorm",
    icon: Lightbulb,
  },
  {
    value: "press-release",
    label: "Press Release",
    icon: Newspaper,
  },
];

const TONES = [
  "Formal",
  "Casual",
  "Persuasive",
  "Humorous",
  "Inspirational",
  "Technical",
];

const LENGTHS = [
  {
    value: "short",
    label: "Short",
    desc: "~400 words",
  },
  {
    value: "medium",
    label: "Medium",
    desc: "~800 words",
  },
  {
    value: "long",
    label: "Long",
    desc: "~1500 words",
  },
];

export function ContentForm({ onGenerate, isGenerating, onStop }: Props) {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("blog-post");
  const [tone, setTone] = useState("Casual");
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState("medium");
  const [language, setLanguage] = useState("en");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) return;

    onGenerate({
      topic,
      contentType,
      tone,
      keywords,
      length,
      language,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Topic */}
      <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/35">
              Main Prompt
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              Topic / Subject
            </h3>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c8ff00]/10 text-[#c8ff00]">
            <Sparkle size={20} weight="fill" />
          </div>
        </div>

        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Describe your content idea..."
          rows={5}
          maxLength={500}
          className="w-full resize-none rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm leading-relaxed text-white placeholder:text-white/20 outline-none transition-all focus:border-[#c8ff00]/30 focus:bg-white/[0.05]"
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-white/25">
            More detailed prompts produce better AI output.
          </p>

          <div
            className={`text-xs ${
              topic.length > 450 ? "text-red-400" : "text-white/25"
            }`}
          >
            {topic.length}/500
          </div>
        </div>
      </div>

      {/* Content Type */}
      <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/35">
            Format
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">Content Type</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {CONTENT_TYPES.map((type) => {
            const Icon = type.icon;
            const active = contentType === type.value;

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setContentType(type.value)}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                  active
                    ? "border-[#c8ff00]/30 bg-[#c8ff00]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                    active
                      ? "bg-[#c8ff00] text-black"
                      : "bg-white/[0.04] text-white/60 group-hover:text-white"
                  }`}
                >
                  <Icon size={22} weight="fill" />
                </div>

                <h4
                  className={`text-sm font-semibold transition-colors ${
                    active
                      ? "text-[#c8ff00]"
                      : "text-white/70 group-hover:text-white"
                  }`}
                >
                  {type.label}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone */}
      <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/35">
            Writing Style
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">Tone</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => {
            const active = tone === t;

            return (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  active
                    ? "border-[#c8ff00] bg-[#c8ff00] text-black"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Length */}
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white/35">
              Output Size
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">Length</h3>
          </div>

          <div className="space-y-2">
            {LENGTHS.map((item) => {
              const active = length === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setLength(item.value)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                    active
                      ? "border-[#c8ff00]/30 bg-[#c8ff00]/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        active ? "text-[#c8ff00]" : "text-white"
                      }`}
                    >
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs text-white/35">{item.desc}</p>
                  </div>

                  {active && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#c8ff00]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language */}
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white/35">
              Localization
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">Language</h3>
          </div>

          <div className="space-y-2">
            {[
              {
                value: "en",
                label: "English",
                icon: "🇺🇸",
              },
              {
                value: "id",
                label: "Bahasa Indonesia",
                icon: "🇮🇩",
              },
            ].map((lang) => {
              const active = language === lang.value;

              return (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setLanguage(lang.value)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-200 ${
                    active
                      ? "border-[#c8ff00]/30 bg-[#c8ff00]/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{lang.icon}</div>

                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          active ? "text-[#c8ff00]" : "text-white"
                        }`}
                      >
                        {lang.label}
                      </p>
                    </div>
                  </div>

                  {active && (
                    <Globe size={18} weight="fill" className="text-[#c8ff00]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/35">
              SEO & Optimization
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">Keywords</h3>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/35">
            Optional
          </div>
        </div>

        <div className="relative">
          <TextAlignLeft
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="productivity, AI tools, automation..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#c8ff00]/30 focus:bg-white/[0.05]"
          />
        </div>
      </div>

      {/* Submit */}
      {isGenerating ? (
        <button
          type="button"
          onClick={onStop}
          className="group flex w-full items-center justify-center gap-3 rounded-[24px] border border-red-500/20 bg-red-500/10 py-4 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/15"
        >
          <Stop size={18} weight="fill" />
          Stop Generating
        </button>
      ) : (
        <button
          type="submit"
          disabled={!topic.trim()}
          className="group relative overflow-hidden rounded-[24px] bg-[#c8ff00] py-5 text-sm font-bold text-black transition-all duration-300 hover:scale-[1.01] hover:bg-[#d7ff4d] disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            fontFamily: "var(--font-syne)",
          }}
        >
          <span className="relative px-4 z-10 flex items-center justify-center gap-2">
            <Lightning size={18} weight="fill" />
            Generate Content
          </span>

          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-y-0 left-[-120px] w-[120px] rotate-12 bg-white/30 blur-2xl transition-all duration-700 group-hover:left-[120%]" />
          </div>
        </button>
      )}
    </form>
  );
}
