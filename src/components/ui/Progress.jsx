import clsx from 'clsx';

const gradients = {
  green: 'from-primary-green to-primary-blue',
  blue: 'from-primary-blue to-accent-purple',
  purple: 'from-accent-purple to-primary-blue',
  gold: 'from-accent-gold to-primary-green',
};

export default function Progress({ value = 0, max = 100, color = 'green', className = '', showLabel = false }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={clsx('w-full', className)}>
      <div className="w-full bg-bg-raised rounded-full h-2 overflow-hidden">
        <div
          className={clsx('h-full rounded-full bg-gradient-to-r transition-all duration-700', gradients[color] || gradients.green)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text-dim mt-1">{Math.round(pct)}%</span>
      )}
    </div>
  );
}
