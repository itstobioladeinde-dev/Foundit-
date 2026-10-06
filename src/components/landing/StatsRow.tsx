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
      className="p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {prefix}
            {count.toLocaleString()}
            {suffix}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
        {description}
      </p>
    </div>
  );
};

export const StatsRow: React.FC = () => {
  return (
    <section className="py-16 max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Indexed Specifications"
          targetNumber={50}
          suffix="M+"
          description="Physical dimensions, ASTM standards, thicknesses, and grades recorded."
          icon={Database}
        />
        <StatCard
          label="Attribution Accuracy"
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
          label="Supplier Coverage"
          targetNumber={120}
          suffix="+"
          description="Industrial supply depots, regional lumber yards, and online merchants."
          icon={Globe2}
        />
      </div>
    </section>
  );
};
