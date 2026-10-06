import React from 'react';
import { ShieldCheck } from 'lucide-react';

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
    <section className="py-10 border-y border-slate-200/70 bg-white/50 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Empirical Intelligence Sourced From Verified Commercial Catalogs</span>
          </div>
          <span className="text-xs text-slate-400">120+ Merchant Networks Crawled</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {SOURCES.map((source) => (
            <div
              key={source.name}
              className="p-3 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-200/70 hover:border-slate-300 hover:shadow-2xs transition-all duration-200 text-center flex flex-col justify-center min-h-[64px] group"
            >
              <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                {source.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 truncate">
                {source.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
