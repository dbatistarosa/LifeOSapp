import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Globe, Download, Trash2, LogOut, Crown, User } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';

export default function Settings() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user, profile } = useAuthStore();
  const [lang, setLang] = useState('en');
  const [notifTime, setNotifTime] = useState('09:00');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const initials = (profile?.full_name || user?.email || 'U').substring(0, 2).toUpperCase();

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <h1 className="text-2xl font-display font-bold text-text-primary">Settings</h1>

        {/* Profile */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-aurora-green flex items-center justify-center text-bg-void text-lg font-display font-bold">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-text-primary">{profile?.full_name || 'User'}</p>
              <p className="text-sm text-text-secondary">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Subscription */}
        <Card glow="gold">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown size={20} className="text-accent-gold" />
              <div>
                <p className="font-semibold text-text-primary">Free Plan</p>
                <p className="text-xs text-text-secondary">Upgrade for AI coaching, advanced analytics</p>
              </div>
            </div>
            <Button size="sm" variant="secondary">Upgrade</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <h2 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <Bell size={14} /> Notifications
          </h2>
          <div>
            <label className="text-sm text-text-secondary">Daily check-in reminder</label>
            <input
              type="time"
              value={notifTime}
              onChange={(e) => setNotifTime(e.target.value)}
              className="mt-2 w-full bg-bg-raised border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary-green/50"
            />
          </div>
        </Card>

        {/* Language */}
        <Card>
          <h2 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <Globe size={14} /> Language
          </h2>
          <div className="flex gap-2">
            {[{ code: 'en', label: 'English' }, { code: 'es', label: 'Español' }].map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  lang === l.code ? 'bg-primary-green text-bg-void' : 'bg-bg-raised text-text-secondary border border-white/10'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Data */}
        <Card>
          <h2 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <Download size={14} /> Data & Privacy
          </h2>
          <div className="space-y-3">
            <Button variant="secondary" fullWidth onClick={() => alert('Export feature coming soon')}>
              <Download size={14} />
              Export My Data
            </Button>
            <Button variant="danger" fullWidth onClick={() => setShowDeleteModal(true)}>
              <Trash2 size={14} />
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Sign out */}
        <Button variant="ghost" fullWidth onClick={handleSignOut}>
          <LogOut size={14} />
          Sign Out
        </Button>

        <p className="text-xs text-text-dim text-center pb-4">LifeOS v1.0.0 · Phase 1 MVP</p>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <p className="text-sm text-text-secondary mb-6">
          Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" fullWidth>Delete Forever</Button>
        </div>
      </Modal>
    </AppShell>
  );
}
