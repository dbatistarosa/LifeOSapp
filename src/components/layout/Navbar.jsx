import { Link } from 'react-router-dom';
import { Bell, Zap } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const { profile, user } = useAuthStore();
  const initials = (profile?.full_name || user?.email || 'U').substring(0, 1).toUpperCase();

  return (
    <header className="h-16 bg-bg-deep border-b border-white/5 flex items-center px-4 lg:px-6 sticky top-0 z-40">
      <Link to="/dashboard" className="flex items-center gap-2 mr-auto">
        <div className="w-8 h-8 rounded-lg bg-aurora-green flex items-center justify-center">
          <Zap size={16} className="text-bg-void" />
        </div>
        <span className="font-display font-bold text-lg gradient-text">LifeOS</span>
      </Link>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-green rounded-full" />
        </button>
        <Link to="/settings" className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-green to-primary-blue flex items-center justify-center text-bg-void text-sm font-bold font-display">
          {initials}
        </Link>
      </div>
    </header>
  );
}
