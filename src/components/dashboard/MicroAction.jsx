import { useState } from 'react';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const DEFAULT_ACTION = {
  action_text: 'Take a 10-minute mindful walk outside. Focus on your breathing and notice 5 things you can see, 4 you can hear, 3 you can feel.',
  category: 'mindfulness',
  duration_mins: 10,
};

export default function MicroAction({ action = DEFAULT_ACTION }) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Card glow="green">
        <div className="flex items-center gap-3">
          <CheckCircle size={24} className="text-primary-green flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary-green">Action completed!</p>
            <p className="text-xs text-text-secondary mt-0.5">Great job taking care of yourself today.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary-green" />
          <span className="text-xs font-medium text-text-secondary">Today's Micro-Action</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={action.category}>{action.category}</Badge>
          <div className="flex items-center gap-1 text-xs text-text-dim">
            <Clock size={12} />
            {action.duration_mins}min
          </div>
        </div>
      </div>
      <p className="text-text-primary text-sm leading-relaxed mb-4">{action.action_text}</p>
      <Button size="sm" onClick={() => setDone(true)}>
        <CheckCircle size={14} />
        Mark Done
      </Button>
    </Card>
  );
}
