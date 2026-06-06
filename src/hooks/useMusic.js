import { useState, useRef, useCallback } from 'react';
import useUiStore from '../store/uiStore';

export const MOCK_TRACKS = [
  { id: '1', title: 'Forest Morning', artist: 'Nature Sounds', category: 'Nature', duration: 180, url: null },
  { id: '2', title: 'Deep Focus Flow', artist: 'Ambient Works', category: 'Focus', duration: 240, url: null },
  { id: '3', title: 'Ocean Drift', artist: 'Calm Waves', category: 'Relax', duration: 210, url: null },
  { id: '4', title: 'Sleep Sanctuary', artist: 'Dream Sounds', category: 'Sleep', duration: 300, url: null },
  { id: '5', title: 'Morning Energy', artist: 'Boost Studio', category: 'Energy', duration: 195, url: null },
  { id: '6', title: 'Rain & Thunder', artist: 'Nature Sounds', category: 'Nature', duration: 360, url: null },
  { id: '7', title: 'Zen Garden', artist: 'Meditation Co', category: 'Relax', duration: 225, url: null },
  { id: '8', title: 'Code Mode', artist: 'Focus Lab', category: 'Focus', duration: 270, url: null },
  { id: '9', title: 'Power Hour', artist: 'Energy Mix', category: 'Energy', duration: 180, url: null },
  { id: '10', title: 'Delta Waves', artist: 'Sleep Lab', category: 'Sleep', duration: 480, url: null },
];

export function useMusic() {
  const { musicPlaying, setMusicPlaying } = useUiStore();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [progress, setProgress] = useState(0);
  const howlRef = useRef(null);
  const progressTimerRef = useRef(null);

  const filteredTracks = currentCategory === 'All'
    ? MOCK_TRACKS
    : MOCK_TRACKS.filter((t) => t.category === currentCategory);

  const currentTrack = filteredTracks[currentTrackIndex] || filteredTracks[0];

  const play = useCallback(() => {
    setMusicPlaying(true);
    // In a real app, Howler would be initialized here with the track URL
    progressTimerRef.current = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.5));
    }, 500);
  }, [setMusicPlaying]);

  const pause = useCallback(() => {
    setMusicPlaying(false);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  }, [setMusicPlaying]);

  const toggle = useCallback(() => {
    if (musicPlaying) pause();
    else play();
  }, [musicPlaying, play, pause]);

  const next = useCallback(() => {
    setCurrentTrackIndex((i) => (i + 1) % filteredTracks.length);
    setProgress(0);
  }, [filteredTracks.length]);

  const prev = useCallback(() => {
    setCurrentTrackIndex((i) => (i - 1 + filteredTracks.length) % filteredTracks.length);
    setProgress(0);
  }, [filteredTracks.length]);

  const selectTrack = useCallback((trackId) => {
    const idx = filteredTracks.findIndex((t) => t.id === trackId);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
      setProgress(0);
      play();
    }
  }, [filteredTracks, play]);

  return {
    tracks: filteredTracks,
    allTracks: MOCK_TRACKS,
    currentTrack,
    musicPlaying,
    progress,
    currentCategory,
    setCurrentCategory,
    play,
    pause,
    toggle,
    next,
    prev,
    selectTrack,
  };
}
