import { Moon, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';

export default function SleepInsight({ avgHours, avgQuality }) {
  const hoursGood = avgHours >= 7;
  const qualityGood = avgQuality >= 6;

  return (
    <Card glow={hoursGood && qualityGood ? 'blue' : undefined}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary-blue/15 rounded-lg">
          <Moon size={18} className="text-primary-blue" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary mb-1">AI Sleep Insight</p>
          <p className="text-xs text-text-secondary leading-relaxed">
            {hoursGood && qualityGood
              ? `Your sleep this week is excellent! Averaging ${avgHours.toFixed(1)}h with ${avgQuality.toFixed(1)}/10 quality. Keep your current bedtime routine — it's working.`
              : !hoursGood
              ? `You're averaging only ${avgHours.toFixed(1)}h this week, below the recommended 7h. Try going to bed 30 minutes earlier tonight.`
              : `Your sleep duration is good (${avgHours.toFixed(1)}h) but quality is ${avgQuality.toFixed(1)}/10. Consider reducing screen time 1h before bed.`}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              {hoursGood ? <TrendingUp size={12} className="text-primary-green" /> : <TrendingDown size={12} className="text-red-400" />}
              <span className="text-xs text-text-dim">{avgHours.toFixed(1)}h avg</span>
            </div>
            <div className="flex items-center gap-1.5">
              {qualityGood ? <TrendingUp size={12} className="text-primary-green" /> : <TrendingDown size={12} className="text-red-400" />}
              <span className="text-xs text-text-dim">{avgQuality.toFixed(1)}/10 quality</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
