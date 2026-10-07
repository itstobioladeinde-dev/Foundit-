import React, { useState, useEffect } from 'react';
import { Layers, Wrench, Shield, Smartphone, ArrowUpRight, CheckCircle, History, Clock } from 'lucide-react';
import { SearchWithFullRelations } from '../../server/db/schema';

interface EmptyStateProps {
  onSelectQuery: (query: string) => void;
}

const CATEGORIES = [
  {
    title: 'Building & Construction Materials',
    description: 'Sheet goods, cementitious substrates, lumber, insulation, masonry.',
    icon: Layers,
    examples: ['12mm marine plywood', 'cement board 1/2"'],
  },
  {
    title: 'Industrial Hardware & Piping',
    description: 'Stainless pipe, valves, structural fasteners, metals by schedule and gauge.',
    icon: Wrench,
    examples: ['stainless steel pipe 2 inch', 'schedule 40 pvc valve'],
  },
  {
    title: 'Safety Equipment & PPE',
    description: 'Hard hats, respiratory gear, eye protection, harnesses.',
    icon: Shield,
    examples: ['industrial safety helmet', 'n95 respirator 3m'],
  },
  {
    title: 'Electronics & Commercial Gear',
    description: 'Unlocked devices, ergonomic seating, appliances, workshop tools.',
    icon: Smartphone,
    examples: ['Samsung A55 128GB', 'commercial mesh task chair'],
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectQuery }) => {
  const [recentSearches, setRecentSearches] = useState<SearchWithFullRelations[]>([]);

  useEffect(() => {
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setRecentSearches(data.data.slice(0, 4));
        }
      })
      .catch(() => {
        // Quiet fallback if offline or no previous history
      });
  }, []);

  return (
    <div id="history" className="max-w-6xl mx-auto my-12 px-4 space-y-6 text-left">
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.title}
              className="p-6 rounded-[22px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/20 hover:border-[#ccff00]/40 transition-all duration-300 shadow-md text-left"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-[#ccff00] flex items-center justify-center shrink-0 border border-[#ccff00]/30 shadow-inner">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{cat.title}</h3>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{cat.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 mr-1">Quick Run:</span>
                {cat.examples.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onSelectQuery(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/5 hover:bg-[#ccff00] hover:text-[#06130c] px-3 py-1.5 rounded-full border border-white/10 hover:border-[#ccff00] transition-all cursor-pointer"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Database Persisted Search History */}
      {recentSearches.length > 0 && (
        <div className="p-6 rounded-[24px] bg-gradient-to-b from-[#0a1e14] to-[#07160e] border border-emerald-500/20 shadow-md text-left">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#ccff00]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Persisted Search History (Database Records)
              </h4>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">SQLite / Relational Schema</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentSearches.map((item) => {
              const formattedTime = new Date(item.search.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <button
                  key={item.search.id}
                  onClick={() => onSelectQuery(item.search.original_query)}
                  className="p-3.5 bg-black/40 hover:bg-[#0e2c1c] rounded-xl border border-white/5 hover:border-[#ccff00]/40 transition-all text-left flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate group-hover:text-[#ccff00] transition-colors">
                      {item.search.original_query}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate mt-0.5 font-mono">
                      {item.finalResult
                        ? `${item.finalResult.product_name} · ${item.finalResult.currency === 'USD' ? '$' : item.finalResult.currency === 'NGN' ? '₦' : ''}${item.finalResult.benchmark_price?.toLocaleString() || 'Unlisted'}`
                        : 'Completed'}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1 mt-0.5 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{formattedTime}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Methodology & Safety Guarantees */}
      <div className="p-6 rounded-[22px] bg-[#05110a] border border-emerald-500/20 text-left">
        <h4 className="text-xs font-bold text-[#ccff00] uppercase tracking-wider mb-3 font-mono">
          Methodology & Pricing Integrity
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-semibold block">Source-Backed Quotes</strong>
              <span>Prices are referenced from actual retail and distributor listings.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-semibold block">Variance Spreads</strong>
              <span>Always displays a low-to-high price range rather than an arbitrary single point.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-semibold block">Persistent Audit Trail</strong>
              <span>Every query, interpretation, source quote, and benchmark is stored with relational links.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
