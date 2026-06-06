import clsx from 'clsx';

const CATEGORIES = ['All', 'Focus', 'Relax', 'Sleep', 'Nature', 'Energy'];

export default function MusicCategories({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={clsx(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            active === cat
              ? 'bg-primary-green text-bg-void shadow-glow-green'
              : 'bg-bg-raised border border-white/10 text-text-secondary hover:text-text-primary'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
