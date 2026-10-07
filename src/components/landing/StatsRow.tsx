import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { Database, Percent, Zap, Globe2 } from 'lucide-react';

interface StatCardProps {
  label: string;
  targetNumber: number;
  suffix: string;
  prefix?: string;
  description: string;
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  targetNumber,
  suffix,
  prefix = '',
  description,
  icon: Icon,
}) => {
  const { elementRef, count } = useCountUp(targetNumber, 1600);

  return (
    <div
      ref={elementRef}
      className="p-6 rounded-[22px] bg-gradient-to-b from-[#0a1e13] to-[#07160e] border border-emerald-500/20 hover:border-[#ccff00]/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-300 transition-colors font-mono">
            {label}
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 text-[#ccff00] flex items-center justify-center border border-[#ccff00]/25">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono tabular-nums">
            {prefix}
            {count.toLocaleString()}
            <span className="text-[#ccff00]">{suffix}</span>
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-white/10 pt-3">
        {description}
      </p>
    </div>
  );
};

export const StatsRow: React.FC = () => {
  return (
    <section className="py-12 max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Catalog Records"
          targetNumber={50}
          suffix="M+"
          description="Physical dimensions, ASTM standards, thicknesses, and grades indexed."
          icon={Database}
        />
        <StatCard
          label="Source Attribution"
          targetNumber={98}
          suffix=".4%"
          description="Every price observation links directly to live vendor catalog URLs."
          icon={Percent}
        />
        <StatCard
          label="Search-To-Quote"
          targetNumber={3}
          suffix=".2s"
          prefix="< "
          description="Autonomous query understanding, web research, and price analysis."
          icon={Zap}
        />
        <StatCard
          label="Verified Suppliers"
          targetNumber={120}
          suffix="+"
          description="Industrial supply depots, regional lumber yards, and online merchants."
          icon={Globe2}
        />
      </div>
    </section>
  );
};
