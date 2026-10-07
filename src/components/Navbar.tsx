import React from 'react';
import { Search, Radar, Database, ArrowUpRight, Activity, Bookmark, Sparkles } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onNewSearchClick: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, onNewSearchClick }) => {
  return (
    <header className="sticky top-0 z-50 pt-3 pb-2 px-4 backdrop-blur-md bg-[#06130c]/80 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand Logo - Styled matching ODDAWORLD top-center aesthetic */}
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-[#ccff00] text-[#06130c] flex items-center justify-center font-black shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-transform duration-300 group-hover:scale-105">
            <Radar className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-[0.2em] uppercase text-white font-display">
              MARKETPROBE
            </span>
            <span className="text-[9px] font-semibold tracking-wider uppercase text-lime-400/90 -mt-0.5">
              AI Price Intelligence
            </span>
          </div>
        </button>

        {/* Floating Pill Navigation Container (Inspired directly by the reference image's white pill navbar) */}
        <nav className="inline-flex items-center gap-1 p-1 bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 rounded-full backdrop-blur-xl shadow-lg transition-all duration-200">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#ccff00] text-[#06130c] shadow-[0_0_12px_rgba(204,255,0,0.35)] transition-all duration-200"
          >
            <span className="text-sm leading-none">⌂</span>
            <span>Radar</span>
          </button>

          <a
            href="#categories"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Categories
          </a>

          <a
            href="#how-it-works"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden md:inline-block"
          >
            How It Works
          </a>

          <a
            href="#features"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:inline-block"
          >
            Architecture
          </a>

          <a
            href="#history"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Database
          </a>
        </nav>

        {/* Right Action Pill Strip (Reference image's cart/heart badge translated into live radar & CTA) */}
        <div className="flex items-center gap-2">
          {/* Status badge with lime indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/25 text-[11px] font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            <span>LIVE WEB GROUNDING</span>
          </div>

          <button
            onClick={onNewSearchClick}
            className="px-4 py-1.5 rounded-full bg-[#ccff00] hover:bg-[#bbf246] active:scale-95 text-[#06130c] font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(204,255,0,0.25)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Search Prices</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </header>
  );
};
