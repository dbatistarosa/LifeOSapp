import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp, signInWithMagicLink } = useAuth();
  const { loading: storeLoading } = useAuthStore();
  const [tab, setTab] = useState('login');
  const [mode, setMode] = useState('password'); // 'password' | 'magic'
  const [showPass, setShowPass] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  // Redirect after successful magic link verification
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (user) return <Navigate to="/dashboard" replace />;

  if (storeLoading || loading) {
    return (
      <div className="min-h-screen bg-bg-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-aurora-green animate-pulse" />
          <p className="text-text-secondary text-sm">Authenticating...</p>
        </div>
      </div>
    );

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormLoading(true);
    try {
      if (mode === 'magic') {
        const { error } = await signInWithMagicLink(form.email);
        if (error) throw error;
        setSuccess('Check your email for the magic link!');
      } else if (tab === 'login') {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await signUp(form.email, form.password, form.name);
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-void flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-8"
      >
        <div className="w-10 h-10 rounded-xl bg-aurora-green flex items-center justify-center shadow-glow-green">
          <Zap size={20} className="text-bg-void" />
        </div>
        <span className="font-display font-bold text-2xl gradient-text">LifeOS</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm"
      >
        <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-bg-raised rounded-xl p-1 mb-6">
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === t ? 'bg-primary-green text-bg-void' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Your name"
                required
              />
            )}

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="you@example.com"
              required
            />

            {mode === 'password' && (
              <div className="relative">
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-9 text-text-dim hover:text-text-secondary transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}

            {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</p>}
            {success && <p className="text-primary-green text-sm bg-primary-green/10 rounded-lg px-3 py-2">{success}</p>}

            <Button type="submit" fullWidth size="lg" loading={formLoading}>
              {mode === 'magic' ? 'Send Magic Link' : tab === 'login' ? 'Log In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-bg-surface px-3 text-xs text-text-dim">or</span>
            </div>
          </div>

          <button
            onClick={() => setMode((m) => m === 'magic' ? 'password' : 'magic')}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:border-white/20 transition-all"
          >
            <Mail size={15} />
            {mode === 'magic' ? 'Use password instead' : 'Continue with Magic Link'}
          </button>
        </div>

        <p className="text-xs text-text-dim text-center mt-6">
          By continuing, you agree to LifeOS Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
