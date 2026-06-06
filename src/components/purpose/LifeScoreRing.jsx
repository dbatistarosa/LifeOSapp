import { motion } from 'framer-motion';

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getColor(score) {
  if (score >= 80) return '#00F5A0';
  if (score >= 60) return '#00C2FF';
  if (score >= 40) return '#F5C842';
  return '#ef4444';
}

export default function LifeScoreRing({ score = 72 }) {
  const color = getColor(score);
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 192 192" className="w-full h-full -rotate-90">
          <circle cx="96" cy="96" r={RADIUS} fill="none" stroke="#141C30" strokeWidth="12" />
          <motion.circle
            cx="96" cy="96" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 12px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-display font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            {score}
          </motion.span>
          <span className="text-sm text-text-secondary mt-1">Life Score</span>
        </div>
      </div>
    </div>
  );
}
