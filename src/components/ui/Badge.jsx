import clsx from 'clsx';

const variants = {
  green: 'bg-primary-green/15 text-primary-green border border-primary-green/20',
  blue: 'bg-primary-blue/15 text-primary-blue border border-primary-blue/20',
  purple: 'bg-accent-purple/15 text-accent-purple border border-accent-purple/20',
  gold: 'bg-accent-gold/15 text-accent-gold border border-accent-gold/20',
  default: 'bg-white/10 text-text-secondary border border-white/10',
  mindfulness: 'bg-accent-purple/15 text-accent-purple border border-accent-purple/20',
  movement: 'bg-primary-green/15 text-primary-green border border-primary-green/20',
  sleep: 'bg-primary-blue/15 text-primary-blue border border-primary-blue/20',
  finance: 'bg-accent-gold/15 text-accent-gold border border-accent-gold/20',
  social: 'bg-pink-400/15 text-pink-400 border border-pink-400/20',
  purpose: 'bg-accent-purple/15 text-accent-purple border border-accent-purple/20',
  nutrition: 'bg-primary-green/15 text-primary-green border border-primary-green/20',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  );
}
