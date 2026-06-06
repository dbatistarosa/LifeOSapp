import { Link, useLocation } from 'react-router-dom';
import { Home, Brain, Music, Users, User } from 'lucide-react';
import clsx from 'clsx';

const tabs = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/coach', icon: Brain, label: 'Coach' },
  { path: '/music', icon: Music, label: 'Music' },
  { path: '/squad', icon: Users, label: 'Squad' },
  { path: '/settings', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-deep border-t border-white/5 lg:hidden">
      <div className="flex items-center justify-around h-16 safe-area-inset-bottom">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = pathname === path || (path !== '/dashboard' && pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center px-3 rounded-xl transition-all duration-200',
                active ? 'text-primary-green' : 'text-text-dim hover:text-text-secondary'
              )}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-primary-green" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
