import { create } from 'zustand';

const useCheckinStore = create((set) => ({
  todayCheckin: null,
  setCheckin: (checkin) => set({ todayCheckin: checkin }),
  clearCheckin: () => set({ todayCheckin: null }),
}));

export default useCheckinStore;
