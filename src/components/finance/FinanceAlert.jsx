import { AlertTriangle } from 'lucide-react';

export default function FinanceAlert({ stressLevel = 5 }) {
  if (stressLevel < 7) return null;
  return (
    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
      <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-red-400">Impulsive Spend Risk</p>
        <p className="text-xs text-text-secondary mt-1">
          Your stress is elevated ({stressLevel}/10). High stress often leads to impulsive spending. Pause before any non-essential purchases today.
        </p>
      </div>
    </div>
  );
}
