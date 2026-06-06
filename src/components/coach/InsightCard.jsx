import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../ui/Card';

export default function InsightCard({ insight }) {
  const Icon = insight.trend === 'up' ? TrendingUp : insight.trend === 'down' ? TrendingDown : Minus;
  const color = insight.trend === 'up' ? 'text-primary-green' : insight.trend === 'down' ? 'text-red-400' : 'text-text-secondary';

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">{insight.title}</p>
          <p className="text-xs text-text-secondary mt-1">{insight.description}</p>
        </div>
      </div>
    </Card>
  );
}
