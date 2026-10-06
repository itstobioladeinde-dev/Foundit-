import React from 'react';
import { Search, Compass, ShieldCheck, Database } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset }) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onReset}
          className="flex items-center gap-3 text-left group focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
            <Search className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-base tracking-tight">MarketProbe</span>
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded text-xs">
                Prototype Preview
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Product & Material Price Intelligence</p>
          </div>
        </button>

        {/* Quiet Nav Links & Context */}
        <nav className="flex items-center gap-6 text-sm text-slate-600">
          <div className="hidden md:flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Text-Search Only (No Image Upload)</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Evidence-Anchored Pricing</span>
            </span>
          </div>

          <button
            onClick={onReset}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            New Search
          </button>
        </nav>
      </div>
    </header>
  );
};
