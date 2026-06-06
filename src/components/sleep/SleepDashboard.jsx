import { Moon, Clock, Star } from 'lucide-react';
import Card from '../ui/Card';
import SleepPhaseBar from './SleepPhaseBar';
import SleepChart from './SleepChart';
import SleepInsight from './SleepInsight';
import { useSleep } from '../../hooks/useSleep';

export default function SleepDashboard() {
  const { sleepRecords, avgHours, avgQuality, latestRecord } = useSleep();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Avg Hours', value: `${avgHours.toFixed(1)}h`, icon: Clock, color: 'text-primary-blue' },
          { label: 'Avg Quality', value: `${avgQuality.toFixed(1)}/10`, icon: Star, color: 'text-accent-gold' },
          { label: 'Goal', value: '7h+', icon: Moon, color: 'text-primary-green' },
        ].map((s) => (
          <Card key={s.label}>
            <s.icon size={16} className={`${s.color} mb-2`} />
            <p className="text-lg font-display font-bold text-text-primary">{s.value}</p>
            <p className="text-xs text-text-dim mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Last night's phases */}
      <Card>
        <h2 className="font-display font-bold text-text-primary mb-4">Last Night's Phases</h2>
        <SleepPhaseBar record={latestRecord} />
      </Card>

      {/* Weekly chart */}
      <Card>
        <h2 className="font-display font-bold text-text-primary mb-1">7-Day Sleep</h2>
        <p className="text-xs text-text-dim mb-4">Green line = 7h goal</p>
        <SleepChart records={sleepRecords} />
      </Card>

      {/* Insight */}
      <SleepInsight avgHours={avgHours} avgQuality={avgQuality} />
    </div>
  );
}
