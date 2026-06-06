import { create } from 'zustand';

const useUiStore = create((set) => ({
  activeTab: 'home',
  musicPlaying: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setMusicPlaying: (playing) => set({ musicPlaying: playing }),
}));

export default useUiStore;
