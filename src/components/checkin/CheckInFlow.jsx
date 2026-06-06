import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import MoodSlider from './MoodSlider';
import SleepInput from './SleepInput';
import StressScale from './StressScale';
import EnergyMeter from './EnergyMeter';
import FinanceSnap from './FinanceSnap';
import Button from '../ui/Button';
import { useCheckin } from '../../hooks/useCheckin';

const STEPS = [
  { id: 'mood', title: 'How are you feeling?', subtitle: 'Rate your overall mood today', color: '#00F5A0' },
  { id: 'sleep', title: 'How did you sleep?', subtitle: 'Hours and quality matter', color: '#00C2FF' },
  { id: 'stress', title: 'Stress check-in', subtitle: 'How stressed do you feel right now?', color: '#A78BFA' },
  { id: 'energy', title: 'Energy levels', subtitle: "How's your energy today?", color: '#F5C842' },
  { id: 'finance', title: 'Financial wellness', subtitle: 'How stressed are you about money?', color: '#F5C842' },
  { id: 'note', title: "Anything else?", subtitle: 'Optional note about your day', color: '#00F5A0' },
];

export default function CheckInFlow({ onComplete }) {
  const navigate = useNavigate();
  const { saveCheckin } = useCheckin();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    mood: 7,
    sleep_hours: 7,
    sleep_quality: 7,
    stress: 4,
    energy: 7,
    finance_stress: 4,
    purpose: 7,
    squad: 7,
    note: '',
  });

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await saveCheckin.mutateAsync(data);
    } catch (e) {
      // Continue even if save fails
    } finally {
      setSaving(false);
      if (onComplete) onComplete(data);
      else navigate('/dashboard');
    }
  };

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const variants = {
    enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="fixed inset-0 z-50 bg-bg-void flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-safe">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/5 text-text-dim">
          <X size={20} />
        </button>
        <span className="text-sm text-text-secondary">{step + 1} / {STEPS.length}</span>
        <div className="w-8" />
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-2">
        <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${currentStep.color}, ${currentStep.color}88)` }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden relative px-4">
        <div className="mb-6 pt-4">
          <h1 className="text-2xl font-display font-bold text-text-primary">{currentStep.title}</h1>
          <p className="text-text-secondary mt-1">{currentStep.subtitle}</p>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            {currentStep.id === 'mood' && (
              <MoodSlider value={data.mood} onChange={(v) => setData((d) => ({ ...d, mood: v }))} />
            )}
            {currentStep.id === 'sleep' && (
              <SleepInput
                hours={data.sleep_hours}
                quality={data.sleep_quality}
                onHoursChange={(v) => setData((d) => ({ ...d, sleep_hours: v }))}
                onQualityChange={(v) => setData((d) => ({ ...d, sleep_quality: v }))}
              />
            )}
            {currentStep.id === 'stress' && (
              <StressScale value={data.stress} onChange={(v) => setData((d) => ({ ...d, stress: v }))} />
            )}
            {currentStep.id === 'energy' && (
              <EnergyMeter value={data.energy} onChange={(v) => setData((d) => ({ ...d, energy: v }))} />
            )}
            {currentStep.id === 'finance' && (
              <FinanceSnap value={data.finance_stress} onChange={(v) => setData((d) => ({ ...d, finance_stress: v }))} />
            )}
            {currentStep.id === 'note' && (
              <div className="space-y-4">
                <textarea
                  value={data.note}
                  onChange={(e) => setData((d) => ({ ...d, note: e.target.value }))}
                  placeholder="What's on your mind today? (optional)"
                  rows={5}
                  className="w-full bg-bg-raised border border-white/10 rounded-xl p-4 text-text-primary placeholder-text-dim focus:outline-none focus:border-primary-green/50 resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-text-dim mb-2">Purpose score</p>
                    <input type="range" min={1} max={10} value={data.purpose} onChange={(e) => setData((d) => ({ ...d, purpose: parseInt(e.target.value) }))} className="w-full" />
                    <div className="flex justify-between text-xs text-text-dim"><span>1</span><span className="text-primary-green font-medium">{data.purpose}</span><span>10</span></div>
                  </div>
                  <div>
                    <p className="text-xs text-text-dim mb-2">Social connection</p>
                    <input type="range" min={1} max={10} value={data.squad} onChange={(e) => setData((d) => ({ ...d, squad: parseInt(e.target.value) }))} className="w-full" />
                    <div className="flex justify-between text-xs text-text-dim"><span>1</span><span className="text-primary-green font-medium">{data.squad}</span><span>10</span></div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="p-4 flex gap-3 pb-safe">
        {step > 0 && (
          <Button variant="secondary" onClick={goPrev} className="flex-1">
            Back
          </Button>
        )}
        <Button onClick={goNext} loading={saving} className="flex-1" fullWidth={step === 0}>
          {step === STEPS.length - 1 ? 'Complete Check-in ✓' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
