import React from 'react';
import { Search, Radar, Globe2, ArrowUp, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-emerald-950/80 bg-[#05110a] text-slate-300 text-left">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#ccff00] text-[#06130c] flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                <Radar className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-base tracking-[0.2em] uppercase text-white font-display">
                MARKETPROBE
              </span>
              <span className="text-[10px] font-semibold text-[#ccff00] bg-emerald-950 border border-[#ccff00]/30 px-2 py-0.5 rounded-full font-mono">
                Live Intelligence
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Empirical market discovery engine for physical commodities, industrial materials, commercial hardware, and electronics. Zero speculative projections.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400/90 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
              <span>All crawlers operational · Google Search Grounding active</span>
            </div>
          </div>

          {/* Coverage Col */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono">
              Catalog Domains
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Building & Structural Materials</li>
              <li className="hover:text-white transition-colors cursor-pointer">Industrial Piping & Fittings</li>
              <li className="hover:text-white transition-colors cursor-pointer">Safety & PPE Gear</li>
              <li className="hover:text-white transition-colors cursor-pointer">Electrical & Telecommunications</li>
              <li className="hover:text-white transition-colors cursor-pointer">Commercial Workspace Hardware</li>
            </ul>
          </div>

          {/* Integrity Col */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono">
              Procurement Integrity
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">100% Attributed Merchant URLs</li>
              <li className="hover:text-white transition-colors cursor-pointer">IQR Anomaly Outlier Rejection</li>
              <li className="hover:text-white transition-colors cursor-pointer">Multi-Currency Normalization (NGN/USD)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Untrusted Web Quarantine Protocol</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            MarketProbe © 2026. Built with strict factual grounding. Prices reflect observed distributor catalog quotes and are subject to supplier revision.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-300 hover:text-[#ccff00] font-semibold transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
