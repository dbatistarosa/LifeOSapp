import { AlertTriangle } from 'lucide-react';

export default function PatternAlert({ message }) {
  return (
    <div className="flex items-start gap-3 bg-accent-gold/10 border border-accent-gold/20 rounded-xl p-4">
      <AlertTriangle size={16} className="text-accent-gold flex-shrink-0 mt-0.5" />
      <p className="text-sm text-text-primary">{message}</p>
    </div>
  );
}
