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
    examples: ['12mm plywood', 'cement board'],
  },
  {
    title: 'Industrial Hardware & Piping',
    description: 'Stainless pipe, valves, structural fasteners, metals by schedule and gauge.',
    icon: Wrench,
    examples: ['stainless steel pipe 2 inch'],
  },
  {
    title: 'Safety Equipment & PPE',
    description: 'Hard hats, respiratory gear, eye protection, harnesses.',
    icon: Shield,
    examples: ['industrial safety helmet'],
  },
  {
    title: 'Electronics & Commercial Gear',
    description: 'Unlocked devices, ergonomic seating, appliances, workshop tools.',
    icon: Smartphone,
    examples: ['Samsung A55', 'office chair'],
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
    <div className="max-w-5xl mx-auto my-8 px-4 space-y-6">
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.title}
              className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{cat.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{cat.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 mr-1">Try:</span>
                {cat.examples.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onSelectQuery(item)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 px-2.5 py-1 rounded border border-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Database Persisted Search History */}
      {recentSearches.length > 0 && (
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs text-left">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
            <History className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Persisted Search History (Database Records)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {recentSearches.map((item) => {
              const formattedTime = new Date(item.search.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <button
                  key={item.search.id}
                  onClick={() => onSelectQuery(item.search.original_query)}
                  className="p-3 bg-slate-50 hover:bg-slate-100/90 rounded-lg border border-slate-200/80 transition-colors text-left flex items-start justify-between gap-3 group focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-900 block truncate group-hover:text-indigo-600 transition-colors">
                      {item.search.original_query}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                      {item.finalResult
                        ? `${item.finalResult.product_name} · ${item.finalResult.currency === 'USD' ? '$' : item.finalResult.currency === 'NGN' ? '₦' : ''}${item.finalResult.benchmark_price?.toLocaleString() || 'Unlisted'}`
                        : 'Completed'}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1 mt-0.5 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{formattedTime}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Methodology & Safety Guarantees */}
      <div className="p-5 bg-slate-50/70 rounded-xl border border-slate-200 text-left">
        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
          Methodology & Pricing Integrity
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 font-medium block">Source-Backed Quotes</strong>
              <span>Prices are referenced from actual retail and distributor listings.</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 font-medium block">Variance Spreads</strong>
              <span>Always displays a low-to-high price range rather than an arbitrary single point.</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 font-medium block">Persistent Audit Trail</strong>
              <span>Every query, interpretation, source quote, and benchmark is stored with relational links.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
