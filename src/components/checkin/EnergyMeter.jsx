import { Zap } from 'lucide-react';

export default function EnergyMeter({ value, onChange }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(10)].map((_, i) => (
            <Zap
              key={i}
              size={24}
              className="transition-all duration-200"
              fill={i < value ? '#F5C842' : 'transparent'}
              color={i < value ? '#F5C842' : '#4A5270'}
            />
          ))}
        </div>
        <div className="text-4xl font-display font-bold text-accent-gold">{value}</div>
        <div className="text-text-secondary mt-1">
          {value <= 2 ? 'Drained' : value <= 4 ? 'Low energy' : value <= 6 ? 'Normal' : value <= 8 ? 'Energized' : 'Supercharged!'}
        </div>
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
          <span>1 — Exhausted</span>
          <span>10 — Supercharged</span>
        </div>
      </div>
    </div>
  );
}
