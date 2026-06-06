const STRESS_COLORS = ['#00F5A0', '#00F5A0', '#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#dc2626', '#b91c1c', '#991b1b'];
const LABELS = ['Zen', 'Calm', 'Relaxed', 'Mild', 'Moderate', 'Elevated', 'High', 'Very high', 'Extreme', 'Crisis'];

export default function StressScale({ value, onChange }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl font-display font-bold mb-2" style={{ color: STRESS_COLORS[value - 1] }}>
          {value}
        </div>
        <div className="text-text-secondary text-lg">{LABELS[value - 1]}</div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className="h-12 rounded-xl font-bold text-lg transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: value === v ? STRESS_COLORS[v - 1] : 'transparent',
              border: `2px solid ${STRESS_COLORS[v - 1]}`,
              color: value === v ? '#03040A' : STRESS_COLORS[v - 1],
              transform: value === v ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs text-text-dim">
        <span>1 — No stress</span>
        <span>10 — Max stress</span>
      </div>
    </div>
  );
}
