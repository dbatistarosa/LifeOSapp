import { Play, Pause, Music } from 'lucide-react';

function formatDuration(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TrackList({ tracks, currentTrack, playing, onSelect }) {
  return (
    <div className="space-y-1">
      {tracks.map((track) => {
        const isCurrent = currentTrack?.id === track.id;
        return (
          <button
            key={track.id}
            onClick={() => onSelect(track.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left min-h-[56px] ${
              isCurrent ? 'bg-primary-green/10 border border-primary-green/20' : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isCurrent ? 'bg-primary-green/20' : 'bg-bg-raised'}`}>
              {isCurrent && playing ? (
                <Pause size={16} className="text-primary-green" />
              ) : isCurrent ? (
                <Play size={16} className="text-primary-green ml-0.5" />
              ) : (
                <Music size={16} className="text-text-dim" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isCurrent ? 'text-primary-green' : 'text-text-primary'}`}>{track.title}</p>
              <p className="text-xs text-text-dim">{track.artist} · {track.category}</p>
            </div>
            <span className="text-xs text-text-dim flex-shrink-0">{formatDuration(track.duration)}</span>
          </button>
        );
      })}
    </div>
  );
}
