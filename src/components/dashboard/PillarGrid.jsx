import clsx from 'clsx';

const PILLARS = [
  { key: 'mood', label: 'Mood', icon: '😊', color: 'text-primary-green' },
  { key: 'stress', label: 'Calm', icon: '🧘', color: 'text-accent-purple' },
  { key: 'sleep', label: 'Sleep', icon: '🌙', color: 'text-primary-blue' },
  { key: 'energy', label: 'Energy', icon: '⚡', color: 'text-accent-gold' },
  { key: 'finance', label: 'Finance', icon: '💰', color: 'text-accent-gold' },
  { key: 'purpose', label: 'Purpose', icon: '🎯', color: 'text-accent-purple' },
  { key: 'squad', label: 'Social', icon: '👥', color: 'text-primary-green' },
  { key: 'body', label: 'Body', icon: '💪', color: 'text-primary-blue' },
];

function scoreColor(score) {
  if (score >= 75) return '#00F5A0';
  if (score >= 55) return '#F5C842';
  return '#ef4444';
}

export default function PillarGrid({ pillarScores = {} }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {PILLARS.map((p) => {
        const score = pillarScores[p.key] || 0;
        const color = scoreColor(score);
        return (
          <div key={p.key} className="bg-bg-raised rounded-xl p-3 flex flex-col items-center gap-1.5 border border-white/5">
            <span className="text-xl">{p.icon}</span>
            <span className="text-xs text-text-dim text-center leading-tight">{p.label}</span>
            <span className="text-sm font-bold font-display" style={{ color }}>{score}</span>
          </div>
        );
      })}
    </div>
  );
}
