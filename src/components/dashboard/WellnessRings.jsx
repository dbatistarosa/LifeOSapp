import { motion } from 'framer-motion';

const R = 22;
const CIRC = 2 * Math.PI * R;

function Ring({ value, color, label, icon }) {
  const offset = CIRC - (value / 100) * CIRC;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
          <circle cx="28" cy="28" r={R} fill="none" stroke="#141C30" strokeWidth="5" />
          <motion.circle
            cx="28" cy="28" r={R}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color }}>{value}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs text-text-secondary">{icon} {label}</div>
      </div>
    </div>
  );
}

export default function WellnessRings({ pillarScores = {} }) {
  const rings = [
    { key: 'mood', label: 'Mood', color: '#00F5A0', icon: '😊' },
    { key: 'sleep', label: 'Sleep', color: '#00C2FF', icon: '🌙' },
    { key: 'stress', label: 'Calm', color: '#A78BFA', icon: '🧘' },
    { key: 'energy', label: 'Energy', color: '#F5C842', icon: '⚡' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {rings.map((r) => (
        <Ring
          key={r.key}
          value={pillarScores[r.key] || 70}
          color={r.color}
          label={r.label}
          icon={r.icon}
        />
      ))}
    </div>
  );
}
