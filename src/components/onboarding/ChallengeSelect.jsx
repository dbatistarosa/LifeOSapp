import clsx from 'clsx';

const CHALLENGES = [
  { id: 'stress', label: 'Stress & Anxiety', icon: '🧠', desc: 'Learn to manage overwhelm' },
  { id: 'work_life', label: 'Work-Life Balance', icon: '⚖️', desc: 'Reclaim your personal time' },
  { id: 'tech', label: 'Tech Addiction', icon: '📱', desc: 'Break the scroll cycle' },
  { id: 'loneliness', label: 'Loneliness', icon: '🤝', desc: 'Build meaningful connections' },
  { id: 'finance', label: 'Financial Instability', icon: '💸', desc: 'Gain control of your money' },
  { id: 'self_esteem', label: 'Low Self-Esteem', icon: '🌟', desc: 'Build confidence & worth' },
  { id: 'purpose', label: 'Lack of Purpose', icon: '🎯', desc: 'Find your why' },
  { id: 'health', label: 'Poor Health Habits', icon: '💪', desc: 'Build a body you love' },
  { id: 'relationships', label: 'Unhealthy Relationships', icon: '❤️', desc: 'Set boundaries, attract better' },
  { id: 'fear', label: 'Fear of Change', icon: '🚀', desc: 'Embrace growth & new starts' },
];

export default function ChallengeSelect({ selected, onChange }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < 3) {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">Choose 1–3 challenges you want to work on</p>
      <div className="grid grid-cols-1 gap-2">
        {CHALLENGES.map((c) => {
          const active = selected.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              disabled={!active && selected.length >= 3}
              className={clsx(
                'flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 min-h-[64px]',
                active
                  ? 'bg-primary-green/10 border-primary-green/40 text-text-primary'
                  : 'bg-bg-raised border-white/5 text-text-secondary hover:border-white/10',
                !active && selected.length >= 3 && 'opacity-40 cursor-not-allowed'
              )}
            >
              <span className="text-2xl flex-shrink-0">{c.icon}</span>
              <div>
                <p className="text-sm font-semibold">{c.label}</p>
                <p className="text-xs text-text-dim">{c.desc}</p>
              </div>
              {active && (
                <span className="ml-auto w-5 h-5 rounded-full bg-primary-green flex items-center justify-center text-bg-void text-xs font-bold flex-shrink-0">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
