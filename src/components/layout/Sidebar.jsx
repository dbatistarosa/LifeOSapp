import { Link, useLocation } from 'react-router-dom';
import { Home, Brain, Music, Users, User, DollarSign, Moon, Target, Settings, Zap } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/coach', icon: Brain, label: 'AI Coach' },
  { path: '/finance', icon: DollarSign, label: 'Finance' },
  { path: '/music', icon: Music, label: 'Music' },
  { path: '/sleep', icon: Moon, label: 'Sleep' },
  { path: '/squad', icon: Users, label: 'Squad' },
  { path: '/purpose', icon: Target, label: 'Purpose' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-bg-deep border-r border-white/5 min-h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-aurora-green flex items-center justify-center">
            <Zap size={16} className="text-bg-void" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">LifeOS</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = pathname === path || (path !== '/dashboard' && pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium min-h-[44px]',
                active
                  ? 'bg-primary-green/15 text-primary-green border border-primary-green/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-bg-surface rounded-xl p-3 border border-white/5">
          <p className="text-xs font-medium text-text-secondary mb-2">LifeOS Pro</p>
          <p className="text-xs text-text-dim mb-3">Unlock AI coaching, advanced analytics & more</p>
          <Link to="/settings" className="block w-full text-center text-xs font-semibold bg-aurora-green text-bg-void py-2 rounded-lg">
            Upgrade
          </Link>
        </div>
      </div>
    </aside>
  );
}
