import { Moon } from 'lucide-react';

const QUALITY_LABELS = ['Terrible', 'Very poor', 'Poor', 'Fair', 'OK', 'Good', 'Good', 'Great', 'Excellent', 'Perfect'];

export default function SleepInput({ hours, quality, onHoursChange, onQualityChange }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Moon size={48} className="mx-auto mb-3 text-primary-blue" />
        <div className="text-4xl font-display font-bold text-primary-blue">{hours}h</div>
        <div className="text-text-secondary mt-1">hours of sleep</div>
      </div>

      <div>
        <p className="text-sm font-medium text-text-secondary mb-3">Sleep Duration</p>
        <input
          type="range"
          min={0}
          max={12}
          step={0.5}
          value={hours}
          onChange={(e) => onHoursChange(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-text-dim mt-2">
          <span>0h</span>
          <span>12h</span>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-text-secondary mb-3">Sleep Quality</p>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
            <button
              key={q}
              onClick={() => onQualityChange(q)}
              className={`h-10 rounded-lg font-medium text-sm transition-all duration-200 ${
                quality === q
                  ? 'bg-primary-blue text-bg-void scale-105'
                  : 'bg-bg-raised text-text-secondary hover:bg-bg-raised/80'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
        <p className="text-center text-text-secondary mt-3 text-sm">
          {quality ? QUALITY_LABELS[quality - 1] : 'Rate your sleep quality'}
        </p>
      </div>
    </div>
  );
}
