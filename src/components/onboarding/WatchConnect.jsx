import clsx from 'clsx';

const WATCHES = [
  { id: 'apple', label: 'Apple Watch', icon: '⌚', desc: 'Import health & sleep data' },
  { id: 'galaxy', label: 'Galaxy Watch', icon: '⌚', desc: 'Samsung Health integration' },
  { id: 'wear_os', label: 'Wear OS', icon: '⌚', desc: 'Google Fit integration' },
  { id: 'skip', label: 'Skip for now', icon: '⏭️', desc: 'Enter data manually' },
];

export default function WatchConnect({ selected, onChange }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">Connect your wearable for automatic tracking</p>
      <div className="grid grid-cols-1 gap-2">
        {WATCHES.map((w) => (
          <button
            key={w.id}
            onClick={() => onChange(w.id)}
            className={clsx(
              'flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 min-h-[72px]',
              selected === w.id
                ? 'bg-primary-blue/10 border-primary-blue/40 text-text-primary'
                : 'bg-bg-raised border-white/5 text-text-secondary hover:border-white/15'
            )}
          >
            <span className="text-3xl flex-shrink-0">{w.icon}</span>
            <div>
              <p className="text-sm font-semibold">{w.label}</p>
              <p className="text-xs text-text-dim">{w.desc}</p>
            </div>
            {selected === w.id && (
              <span className="ml-auto w-5 h-5 rounded-full bg-primary-blue flex items-center justify-center text-bg-void text-xs font-bold flex-shrink-0">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
