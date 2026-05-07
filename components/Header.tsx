"use client";

export function Header() {
  return (
    <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c8ff00] flex items-center justify-center">
            <span className="text-black font-black text-sm" style={{ fontFamily: "var(--font-syne)" }}>AI</span>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
              Content Studio
            </h1>
            <p className="text-[10px] text-white/30 leading-none">Powered by Claude AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c8ff00] pulse-dot inline-block" />
          <span className="text-xs text-white/40">AI Ready</span>
        </div>
      </div>
    </header>
  );
}
