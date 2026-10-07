import React from 'react';
import { ArrowRight, ArrowUpRight, Layers, Wrench, Shield, Cpu, Factory } from 'lucide-react';

interface CategoryShowcaseProps {
  onSelectCategory: (sampleQuery: string) => void;
}

const CATEGORIES = [
  {
    id: 'metals',
    title: 'Structural Metals',
    subtitle: 'Rebar, Sheet, Beams',
    sampleQuery: 'stainless steel pipe 2 inch',
    icon: Factory,
    benchmarkNote: 'Sch 40, 304, ASTM A36',
    medianPrice: '$218 / length',
    sourcesCount: '8 suppliers',
  },
  {
    id: 'timber',
    title: 'Construction Timber',
    subtitle: 'Plywood, Framing, CDX',
    sampleQuery: '12mm marine plywood',
    icon: Layers,
    benchmarkNote: 'BS1088, ACX, Pressure Treated',
    medianPrice: '$36.20 / sheet',
    sourcesCount: '12 suppliers',
  },
  {
    id: 'piping',
    title: 'Process Piping',
    subtitle: 'PVC, Copper, Valves',
    sampleQuery: 'cement board 1/2 inch',
    icon: Wrench,
    benchmarkNote: 'ANSI Flanges, Schedule 80',
    medianPrice: '$14.80 / board',
    sourcesCount: '9 suppliers',
  },
  {
    id: 'safety',
    title: 'Industrial Safety',
    subtitle: 'PPE, Helmets, Harnesses',
    sampleQuery: 'industrial safety helmet',
    icon: Shield,
    benchmarkNote: 'OSHA & ANSI Z89.1 Type 1',
    medianPrice: '$42.50 / unit',
    sourcesCount: '15 suppliers',
  },
  {
    id: 'hardware',
    title: 'Commercial Hardware',
    subtitle: 'Chips, Motors, Devices',
    sampleQuery: 'Samsung A55 128GB',
    icon: Cpu,
    benchmarkNote: 'STM32, 5G Modems, Industrial',
    medianPrice: '$349.00 / unit',
    sourcesCount: '14 suppliers',
  },
];

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  return (
    <section id="categories" className="py-16 max-w-6xl mx-auto px-4 text-left">
      {/* Header matching "Shop By Category" and "View All Categories →" from the reference image */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#ccff00] font-mono block mb-1">
            TAXONOMY EXPLORER
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Benchmark By Category
          </h2>
        </div>

        <button
          onClick={() => onSelectCategory('12mm marine plywood')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ccff00] hover:text-white transition-colors cursor-pointer group"
        >
          <span>View All 180+ Classifications</span>
          <div className="w-5 h-5 rounded-full bg-[#ccff00] text-[#06130c] flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1">
            <ArrowRight className="w-3 h-3 stroke-[3]" />
          </div>
        </button>
      </div>

      {/* 5 Vertical Rounded Cards Grid (Direct translation of the 5 product cards in reference image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.sampleQuery)}
              className="p-5 rounded-[22px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/25 hover:border-[#ccff00]/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_35px_rgba(204,255,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left relative overflow-hidden"
            >
              {/* Subtle top radial lighting */}
              <div className="absolute top-0 inset-x-0 h-28 bg-[radial-gradient(circle_at_50%_0%,rgba(204,255,0,0.12)_0%,transparent_75%)] pointer-events-none" />

              <div>
                {/* 3D Visual on Dark Pedestal (Translation of the headphone/phone/watch visual) */}
                <div className="w-full h-32 rounded-2xl bg-[#05110a] border border-white/5 relative flex flex-col items-center justify-center mb-5 overflow-hidden">
                  {/* Concentric rings behind icon */}
                  <div className="absolute w-20 h-20 rounded-full border border-emerald-500/20 scale-90" />
                  <div className="absolute w-28 h-28 rounded-full border border-[#ccff00]/10 scale-95" />
                  
                  {/* Glowing center icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0a2316] to-[#123623] border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.2)] group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  {/* Dark pedestal base at bottom of visual */}
                  <div className="absolute -bottom-4 w-32 h-8 rounded-[100%] bg-[#0f2d1e] border-t border-[#ccff00]/30 shadow-inner" />
                </div>

                {/* Category Title & Subtitle */}
                <h3 className="text-sm font-bold text-white group-hover:text-[#ccff00] transition-colors leading-snug">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {cat.subtitle}
                </p>

                {/* Benchmark Tag & Median preview */}
                <div className="mt-3 py-1.5 px-2 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-emerald-300 flex items-center justify-between">
                  <span>Median:</span>
                  <span className="font-bold text-white">{cat.medianPrice}</span>
                </div>
              </div>

              {/* Action link matching "Shop Now →" */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#ccff00]">
                <span>Explore Prices</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
