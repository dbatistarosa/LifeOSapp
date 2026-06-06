import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LifeScore from './LifeScore';
import WellnessRings from './WellnessRings';
import MicroAction from './MicroAction';
import WeeklyChart from './WeeklyChart';
import PillarGrid from './PillarGrid';
import { useCheckin } from '../../hooks/useCheckin';
import { useLifeScore } from '../../hooks/useLifeScore';
import useCheckinStore from '../../store/checkinStore';

export default function Dashboard() {
  const { checkins } = useCheckin();
  const { todayCheckin } = useCheckinStore();
  const { score, pillarScores } = useLifeScore(checkins);

  const stagger = {
    animate: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div className="max-w-2xl mx-auto px-4 py-6 space-y-5" variants={stagger} initial="initial" animate="animate">
      {/* Check-in CTA */}
      {!todayCheckin && (
        <motion.div variants={item}>
          <Card glow="green">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-text-primary">Daily Check-in</p>
                <p className="text-sm text-text-secondary mt-0.5">Start your day with a quick wellness check</p>
              </div>
              <Link to="/checkin">
                <Button size="sm">
                  <Plus size={14} />
                  Check in
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Life Score + Wellness Rings */}
      <motion.div variants={item}>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-text-primary">Today's Wellness</h2>
            <Link to="/purpose" className="text-xs text-primary-green flex items-center gap-1 hover:opacity-80">
              <TrendingUp size={12} />
              Details
            </Link>
          </div>
          <div className="flex flex-col items-center gap-5">
            <LifeScore score={score} />
            <WellnessRings pillarScores={pillarScores} />
          </div>
        </Card>
      </motion.div>

      {/* Micro Action */}
      <motion.div variants={item}>
        <MicroAction />
      </motion.div>

      {/* Weekly trend */}
      <motion.div variants={item}>
        <Card>
          <h2 className="font-display font-bold text-text-primary mb-4">7-Day Trends</h2>
          <WeeklyChart checkins={checkins} />
          <div className="flex gap-4 mt-3 flex-wrap">
            {[
              { label: 'Mood', color: '#00F5A0' },
              { label: 'Energy', color: '#F5C842' },
              { label: 'Sleep', color: '#00C2FF' },
              { label: 'Calm', color: '#A78BFA' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className="text-xs text-text-dim">{l.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Pillars */}
      <motion.div variants={item}>
        <Card>
          <h2 className="font-display font-bold text-text-primary mb-4">Life Pillars</h2>
          <PillarGrid pillarScores={pillarScores} />
        </Card>
      </motion.div>
    </motion.div>
  );
}
