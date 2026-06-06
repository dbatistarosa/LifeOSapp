const PHASES = [
  { key: 'deep_pct', label: 'Deep', color: '#00C2FF' },
  { key: 'rem_pct', label: 'REM', color: '#A78BFA' },
  { key: 'light_pct', label: 'Light', color: '#00F5A0' },
  { key: 'awake_pct', label: 'Awake', color: '#4A5270' },
];

export default function SleepPhaseBar({ record = {} }) {
  return (
    <div className="space-y-3">
      <div className="flex h-6 rounded-full overflow-hidden gap-0.5">
        {PHASES.map((p) => {
          const pct = record[p.key] || 25;
          return (
            <div
              key={p.key}
              className="transition-all duration-700 rounded-sm"
              style={{ width: `${pct}%`, background: p.color, opacity: 0.85 }}
            />
          );
        })}
      </div>
      <div className="flex gap-4 flex-wrap">
        {PHASES.map((p) => (
          <div key={p.key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-xs text-text-secondary">{p.label} {record[p.key] || 25}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
