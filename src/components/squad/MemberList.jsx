import { Flame } from 'lucide-react';

function MemberAvatar({ name }) {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase();
  const colors = ['from-primary-green to-primary-blue', 'from-accent-purple to-primary-blue', 'from-accent-gold to-primary-green', 'from-pink-500 to-accent-purple'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-bg-void text-sm font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function MemberList({ members = [] }) {
  return (
    <div className="space-y-3">
      {members.map((m) => (
        <div key={m.id} className="flex items-center gap-3 py-1">
          <div className="relative">
            <MemberAvatar name={m.name} />
            {m.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary-green rounded-full border-2 border-bg-surface" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">{m.name}</p>
            <p className="text-xs text-text-dim">Score: {m.score}</p>
          </div>
          <div className="flex items-center gap-1 bg-accent-gold/10 border border-accent-gold/20 rounded-full px-2 py-1">
            <Flame size={12} className="text-accent-gold" />
            <span className="text-xs font-semibold text-accent-gold">{m.streak}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
