import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';

const MOCK_SQUAD = {
  id: '1',
  name: 'Wellness Warriors',
  members: [
    { id: '1', name: 'Alex K.', avatar: null, streak: 14, score: 78, online: true },
    { id: '2', name: 'Sam R.', avatar: null, streak: 7, score: 82, online: false },
    { id: '3', name: 'Jordan M.', avatar: null, streak: 21, score: 91, online: true },
    { id: '4', name: 'Casey L.', avatar: null, streak: 3, score: 65, online: false },
  ],
  challenge: {
    title: '7-Day Sleep Challenge',
    description: 'Get 7+ hours of sleep every night this week',
    progress: 5,
    total: 7,
    ends_at: new Date(Date.now() + 2 * 86400000).toISOString(),
  },
  messages: [
    { id: '1', user: 'Jordan M.', content: 'Day 5 done! Feeling amazing 🌟', time: '2h ago' },
    { id: '2', user: 'Alex K.', content: 'This sleep challenge is really working for me', time: '4h ago' },
    { id: '3', user: 'Sam R.', content: 'Struggled last night but back on track today 💪', time: '6h ago' },
  ],
};

export function useSquad() {
  const { user } = useAuthStore();

  const { data: squad = MOCK_SQUAD, isLoading } = useQuery({
    queryKey: ['squad', user?.id],
    queryFn: async () => {
      if (!user) return MOCK_SQUAD;
      return MOCK_SQUAD; // Mock for Phase 1
    },
  });

  return { squad, isLoading };
}
