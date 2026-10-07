import React from 'react';
import { ShieldCheck, Radar } from 'lucide-react';

const SOURCES = [
  { name: 'McMaster-Carr', category: 'Industrial & Hardware' },
  { name: 'Grainger Supply', category: 'MRO & Facilities' },
  { name: 'Home Depot Pro', category: 'Building Materials' },
  { name: 'Fastenal', category: 'Fasteners & Tooling' },
  { name: 'Lowe’s Pro', category: 'Lumber & Structural' },
  { name: 'Ferguson', category: 'Commercial Plumbing' },
  { name: '84 Lumber', category: 'Timber & Sheet Goods' },
  { name: 'Amazon Business', category: 'Commercial Equipment' },
];

export const TrustedSourcesStrip: React.FC = () => {
  return (
    <section className="py-8 border-y border-emerald-950/80 bg-[#07160e]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300 uppercase tracking-widest font-mono">
            <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
            <span>Empirical Intelligence Sourced From Verified Commercial Catalogs</span>
          </div>
          <span className="text-xs text-[#ccff00]/80 font-mono">120+ Merchant Networks Crawled</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {SOURCES.map((source) => (
            <div
              key={source.name}
              className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-[#ccff00]/40 transition-all duration-200 text-center flex flex-col justify-center min-h-[64px] group"
            >
              <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                {source.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">
                {source.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
