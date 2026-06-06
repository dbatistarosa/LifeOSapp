import clsx from 'clsx';

const glowMap = {
  green: 'border-primary-green/30 shadow-glow-green',
  blue: 'border-primary-blue/30 shadow-glow-blue',
  purple: 'border-accent-purple/30 shadow-glow-purple',
  gold: 'border-accent-gold/30 shadow-glow-gold',
};

export default function Card({ children, className = '', glow, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-bg-surface border border-white/5 rounded-2xl p-4',
        glow && glowMap[glow],
        onClick && 'cursor-pointer hover:border-white/10 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}
