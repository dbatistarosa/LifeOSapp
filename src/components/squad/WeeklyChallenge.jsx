import { Trophy } from 'lucide-react';
import Progress from '../ui/Progress';
import Card from '../ui/Card';

export default function WeeklyChallenge({ challenge = {} }) {
  const pct = challenge.total ? (challenge.progress / challenge.total) * 100 : 0;
  const daysLeft = challenge.ends_at
    ? Math.max(0, Math.ceil((new Date(challenge.ends_at) - new Date()) / 86400000))
    : 0;

  return (
    <Card glow="gold">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-accent-gold/15 rounded-lg">
          <Trophy size={18} className="text-accent-gold" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-text-primary">{challenge.title}</p>
            <span className="text-xs text-text-dim">{daysLeft}d left</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">{challenge.description}</p>
          <Progress value={challenge.progress} max={challenge.total} color="gold" />
          <div className="flex justify-between text-xs text-text-dim mt-1.5">
            <span>{challenge.progress}/{challenge.total} days</span>
            <span>{Math.round(pct)}% complete</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
