import AppShell from '../components/layout/AppShell';
import MusicPlayer from '../components/music/MusicPlayer';
import MusicCategories from '../components/music/MusicCategories';
import TrackList from '../components/music/TrackList';
import Card from '../components/ui/Card';
import { useMusic } from '../hooks/useMusic';

export default function Music() {
  const { tracks, currentTrack, musicPlaying, progress, currentCategory, setCurrentCategory, toggle, next, prev, selectTrack } = useMusic();

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Music</h1>
          <p className="text-text-secondary text-sm mt-1">Curated for your wellness state</p>
        </div>

        <MusicPlayer
          track={currentTrack}
          playing={musicPlaying}
          progress={progress}
          onToggle={toggle}
          onNext={next}
          onPrev={prev}
        />

        <MusicCategories active={currentCategory} onChange={setCurrentCategory} />

        <Card>
          <TrackList
            tracks={tracks}
            currentTrack={currentTrack}
            playing={musicPlaying}
            onSelect={selectTrack}
          />
        </Card>
      </div>
    </AppShell>
  );
}
