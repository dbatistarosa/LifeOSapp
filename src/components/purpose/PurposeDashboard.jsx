import Card from '../ui/Card';
import LifeScoreRing from './LifeScoreRing';
import PillarBars from './PillarBars';
import { useCheckin } from '../../hooks/useCheckin';
import { useLifeScore } from '../../hooks/useLifeScore';

export default function PurposeDashboard() {
  const { checkins } = useCheckin();
  const { score, pillarScores } = useLifeScore(checkins);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <Card>
        <h2 className="font-display font-bold text-text-primary text-center mb-2">Your Life Score</h2>
        <p className="text-xs text-text-dim text-center mb-6">Based on your 7-day average across all pillars</p>
        <div className="flex justify-center">
          <LifeScoreRing score={score} />
        </div>
      </Card>

      <Card>
        <h2 className="font-display font-bold text-text-primary mb-4">Life Pillars Breakdown</h2>
        <PillarBars pillarScores={pillarScores} />
      </Card>
    </div>
  );
}
