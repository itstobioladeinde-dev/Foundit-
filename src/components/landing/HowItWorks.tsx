import React from 'react';
import { Search, Compass, Calculator, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Enter Specification in Natural Text',
      subtitle: 'Dimensions, units & standards preserved',
      description:
        'Type what you need in plain text—like "12mm marine plywood", "2 inch Schedule 40 pipe", or "Samsung A55 128GB". The query engine isolates dimensions, materials, and regional targets without guessing.',
      icon: Search,
      badge: 'Zero Image Overhead',
      features: [
        'Preserves exact metric & imperial dimensions',
        'Extracts grades (ASTM, BS, Marine, Sch 40)',
        'Supports regional queries (e.g. Nigeria, US, UK)',
      ],
    },
    {
      number: '02',
      title: 'Autonomous Web Catalog Research',
      subtitle: 'Untrusted content isolation active',
      description:
        'The research layer searches live commercial distributor networks, marketplaces, and manufacturer catalogs. All extracted web text is strictly quarantined as untrusted observation data to prevent prompt injection.',
      icon: Compass,
      badge: 'SSRF & Code Protected',
      features: [
        'Collects direct product listing links',
        'Filters out duplicate & irrelevant listings',
        'Extracts current listed prices and stock status',
      ],
    },
    {
      number: '03',
      title: 'Statistical Pricing Intelligence',
      subtitle: 'Never invents or hallucinates prices',
      description:
        'The pricing engine segregates bulk packaging from single units, filters out statistical outliers via IQR deviation, normalizes multi-currency quotes, and calculates a defensible floor, median, and ceiling range.',
      icon: Calculator,
      badge: 'Empirical Evidence Only',
      features: [
        'Separates single units from packs of 50',
        'Transparent high, medium, or low confidence rating',
        'Price-unavailable state when RFQ is required',
      ],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-4 text-left">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-emerald-950/80 text-[#ccff00] border border-[#ccff00]/30 mb-4 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>THREE-STAGE PROCUREMENT ARCHITECTURE</span>
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
          How MarketProbe Turns Plain Text into Verified Pricing
        </h2>
        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
          From query submission to empirical price synthesis in under 4 seconds. No speculative AI hallucinations.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="p-8 rounded-[24px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/25 hover:border-[#ccff00]/60 shadow-[0_10px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_35px_rgba(204,255,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-mono font-bold text-white/20 group-hover:text-[#ccff00] transition-colors">
                    {step.number}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-950/90 text-[#ccff00] flex items-center justify-center border border-[#ccff00]/30 shadow-inner group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>

                <div className="inline-block text-[10px] font-bold text-[#ccff00] uppercase tracking-wider mb-1 font-mono">
                  {step.subtitle}
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {step.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <ul className="space-y-2 text-xs text-slate-300">
                  {step.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#ccff00] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
