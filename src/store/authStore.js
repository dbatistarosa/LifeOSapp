import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  signOut: () => set({ user: null, session: null, profile: null }),
}));

export default useAuthStore;
