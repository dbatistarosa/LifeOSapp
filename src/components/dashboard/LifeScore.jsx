import { motion } from 'framer-motion';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getScoreColor(score) {
  if (score >= 80) return '#00F5A0';
  if (score >= 60) return '#00C2FF';
  if (score >= 40) return '#F5C842';
  return '#ef4444';
}

function getScoreLabel(score) {
  if (score >= 85) return 'Thriving';
  if (score >= 70) return 'Flourishing';
  if (score >= 55) return 'Growing';
  if (score >= 40) return 'Recovering';
  return 'Struggling';
}

export default function LifeScore({ score = 72 }) {
  const color = getScoreColor(score);
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r={RADIUS} fill="none" stroke="#141C30" strokeWidth="10" />
          <motion.circle
            cx="64" cy="64" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-display font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-text-dim mt-0.5">Life Score</span>
        </div>
      </div>
      <p className="text-sm font-medium mt-2" style={{ color }}>{getScoreLabel(score)}</p>
    </div>
  );
}
