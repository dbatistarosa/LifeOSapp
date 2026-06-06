import { Users } from 'lucide-react';
import Card from '../ui/Card';
import MemberList from './MemberList';
import WeeklyChallenge from './WeeklyChallenge';
import SquadChat from './SquadChat';
import { useSquad } from '../../hooks/useSquad';

export default function SquadDashboard() {
  const { squad } = useSquad();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <Card glow="purple">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-purple/15 flex items-center justify-center">
            <Users size={22} className="text-accent-purple" />
          </div>
          <div>
            <h2 className="font-display font-bold text-text-primary">{squad.name}</h2>
            <p className="text-sm text-text-secondary">{squad.members?.length} members · Active</p>
          </div>
        </div>
      </Card>

      {/* Challenge */}
      {squad.challenge && <WeeklyChallenge challenge={squad.challenge} />}

      {/* Members */}
      <Card>
        <h2 className="font-display font-bold text-text-primary mb-4">Members</h2>
        <MemberList members={squad.members} />
      </Card>

      {/* Chat */}
      <Card>
        <h2 className="font-display font-bold text-text-primary mb-4">Squad Chat</h2>
        <SquadChat messages={squad.messages} />
        <div className="mt-4 flex gap-2">
          <input
            placeholder="Send a message..."
            className="flex-1 bg-bg-raised border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder-text-dim focus:outline-none focus:border-accent-purple/50"
          />
          <button className="px-4 py-2.5 bg-accent-purple/20 border border-accent-purple/30 text-accent-purple rounded-xl text-sm font-medium hover:bg-accent-purple/30 transition-colors">
            Send
          </button>
        </div>
      </Card>
    </div>
  );
}
