import { DollarSign } from 'lucide-react';

const LABELS = ['Thriving', 'Stable', 'Comfortable', 'Managing', 'Tight', 'Worried', 'Stressed', 'Very stressed', 'Desperate', 'Crisis'];

export default function FinanceSnap({ value, onChange }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(10)].map((_, i) => (
            <DollarSign
              key={i}
              size={20}
              className={i < value ? 'text-red-400' : 'text-text-dim'}
            />
          ))}
        </div>
        <div className="text-4xl font-display font-bold text-accent-gold">{value}</div>
        <div className="text-text-secondary mt-1">{LABELS[value - 1]}</div>
      </div>

      <div className="px-2">
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-text-dim mt-2">
          <span>1 — No stress</span>
          <span>10 — Very stressed</span>
        </div>
      </div>
    </div>
  );
}
