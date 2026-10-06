import React from 'react';
import { Search, ShieldCheck, Database, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onNewSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, onNewSearchClick }) => {
  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onReset}
          className="flex items-center gap-3 text-left group focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded-lg p-1 -ml-1 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-slate-800 transition-colors">
            <Search className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight font-display">
                MarketProbe
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-full">
                Live Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              AI Physical Product & Material Radar
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#how-it-works"
              className="hover:text-slate-900 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/60">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Text-Search Only</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewSearchClick}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
            >
              <span>Search a Product</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
