import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function OnboardingDone() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center py-8 space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-aurora-green flex items-center justify-center shadow-glow-green"
      >
        <span className="text-4xl">🚀</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <h2 className="text-2xl font-display font-bold text-text-primary">You're all set!</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
          LifeOS is ready to help you build a life you love. Start with your first daily check-in to get your Life Score.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full space-y-3"
      >
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '📊', label: 'Daily\nCheck-ins' },
            { icon: '🧠', label: 'AI\nCoaching' },
            { icon: '🏆', label: 'Squad\nChallenges' },
          ].map((f) => (
            <div key={f.label} className="bg-bg-raised rounded-xl p-3 border border-white/5">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-xs text-text-secondary whitespace-pre-line">{f.label}</div>
            </div>
          ))}
        </div>

        <Button fullWidth size="lg" onClick={() => navigate('/dashboard')}>
          Go to Dashboard →
        </Button>
      </motion.div>
    </div>
  );
}
