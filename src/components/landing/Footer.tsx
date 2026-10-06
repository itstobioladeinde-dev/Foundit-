import React from 'react';
import { Search, Shield, Globe2, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-white text-left">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                M
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                MarketProbe
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Text-Search Only
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Empirical market discovery engine for physical commodities, industrial materials, commercial hardware, and electronics. Zero speculative projections.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All crawlers operational · Google Search Grounding active</span>
            </div>
          </div>

          {/* Coverage Col */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider">
              Catalog Domains
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>Building & Structural Materials</li>
              <li>Industrial Piping & Fittings</li>
              <li>Safety & PPE Gear</li>
              <li>Electrical & Telecommunications</li>
              <li>Commercial Workspace Furniture</li>
            </ul>
          </div>

          {/* Integrity Col */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider">
              Procurement Integrity
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>100% Attributed Merchant URLs</li>
              <li>IQR Anomaly Outlier Rejection</li>
              <li>Multi-Currency Normalization (NGN/USD)</li>
              <li>Untrusted Web Quarantine Protocol</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            MarketProbe © 2026. Built with strict factual grounding. Prices reflect observed distributor catalog quotes and are subject to supplier revision.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
