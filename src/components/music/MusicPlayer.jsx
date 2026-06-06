import { SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import Progress from '../ui/Progress';
import Waveform from './Waveform';

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayer({ track, playing, progress, onPrev, onToggle, onNext }) {
  const elapsed = track ? Math.floor((progress / 100) * track.duration) : 0;

  return (
    <div className="bg-bg-raised rounded-2xl p-5 border border-white/5">
      {/* Vinyl disc */}
      <div className="flex flex-col items-center mb-6">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-br from-bg-surface to-bg-raised border-4 border-white/10 flex items-center justify-center relative ${playing ? 'animate-spin-slow' : ''}`}
        >
          <div className="w-10 h-10 rounded-full bg-bg-void border-2 border-white/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary-green/40" />
          </div>
          {/* Record grooves */}
          {[40, 48, 56].map((r) => (
            <div
              key={r}
              className="absolute rounded-full border border-white/5"
              style={{ width: r * 2, height: r * 2 }}
            />
          ))}
        </div>
      </div>

      {/* Track info */}
      <div className="text-center mb-4">
        <h3 className="font-display font-bold text-text-primary text-lg">{track?.title || 'No track selected'}</h3>
        <p className="text-text-secondary text-sm mt-0.5">{track?.artist || ''}</p>
        <div className="flex justify-center mt-3">
          <Waveform playing={playing} />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <Progress value={progress} max={100} color="green" />
        <div className="flex justify-between text-xs text-text-dim mt-1.5">
          <span>{formatTime(elapsed)}</span>
          <span>{track ? formatTime(track.duration) : '0:00'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button onClick={onPrev} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors">
          <SkipBack size={20} />
        </button>
        <button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-aurora-green flex items-center justify-center text-bg-void shadow-glow-green hover:opacity-90 transition-opacity active:scale-95"
        >
          {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>
        <button onClick={onNext} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors">
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
}
