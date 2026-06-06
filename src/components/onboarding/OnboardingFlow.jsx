import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import ChallengeSelect from './ChallengeSelect';
import WatchConnect from './WatchConnect';
import OnboardingDone from './OnboardingDone';
import Button from '../ui/Button';

const STEPS = [
  { title: "What's your biggest challenge?", subtitle: 'LifeOS will personalize your experience' },
  { title: 'Connect your wearable', subtitle: 'Get automatic sleep & activity data' },
  { title: "You're ready!", subtitle: '' },
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [challenges, setChallenges] = useState([]);
  const [watch, setWatch] = useState(null);

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete?.({ challenges, watch });
    }
  };

  const canContinue = step === 0 ? challenges.length > 0 : step === 1 ? watch !== null : true;

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-bg-void flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 pt-12 pb-6">
        <div className="w-9 h-9 rounded-xl bg-aurora-green flex items-center justify-center">
          <Zap size={18} className="text-bg-void" />
        </div>
        <span className="font-display font-bold text-xl gradient-text">LifeOS</span>
      </div>

      {/* Progress */}
      <div className="px-6 mb-6">
        <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-aurora-green rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-dim mt-2">
          {STEPS.map((_, i) => (
            <span key={i} className={i === step ? 'text-primary-green' : ''}>{i + 1}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        {step < STEPS.length - 1 && (
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-text-primary">{STEPS[step].title}</h1>
            {STEPS[step].subtitle && <p className="text-text-secondary mt-1 text-sm">{STEPS[step].subtitle}</p>}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && <ChallengeSelect selected={challenges} onChange={setChallenges} />}
            {step === 1 && <WatchConnect selected={watch} onChange={setWatch} />}
            {step === 2 && <OnboardingDone />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      {step < STEPS.length - 1 && (
        <div className="p-6">
          <Button fullWidth size="lg" disabled={!canContinue} onClick={goNext}>
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
