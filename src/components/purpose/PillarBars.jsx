import Progress from '../ui/Progress';

const PILLARS = [
  { key: 'mood', label: 'Mood & Happiness', color: 'green', icon: '😊' },
  { key: 'stress', label: 'Stress Management', color: 'purple', icon: '🧘' },
  { key: 'sleep', label: 'Sleep Quality', color: 'blue', icon: '🌙' },
  { key: 'energy', label: 'Physical Energy', color: 'gold', icon: '⚡' },
  { key: 'finance', label: 'Financial Health', color: 'gold', icon: '💰' },
  { key: 'purpose', label: 'Life Purpose', color: 'purple', icon: '🎯' },
  { key: 'squad', label: 'Social Connections', color: 'green', icon: '👥' },
  { key: 'body', label: 'Body & Movement', color: 'blue', icon: '💪' },
];

export default function PillarBars({ pillarScores = {} }) {
  return (
    <div className="space-y-4">
      {PILLARS.map((p) => {
        const score = pillarScores[p.key] || 0;
        return (
          <div key={p.key} className="flex items-center gap-3">
            <span className="text-lg w-7 text-center flex-shrink-0">{p.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-medium text-text-secondary">{p.label}</span>
                <span className="text-xs font-bold text-text-primary">{score}</span>
              </div>
              <Progress value={score} max={100} color={p.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
