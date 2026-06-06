import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/authStore';
import useCheckinStore from '../store/checkinStore';

const MOCK_CHECKINS = [
  { id: '1', date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], mood: 7, stress: 5, sleep_quality: 7, sleep_hours: 7.5, energy: 7, finance_stress: 4, purpose: 7, squad: 8 },
  { id: '2', date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], mood: 6, stress: 7, sleep_quality: 5, sleep_hours: 6, energy: 5, finance_stress: 6, purpose: 6, squad: 7 },
  { id: '3', date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], mood: 8, stress: 4, sleep_quality: 8, sleep_hours: 8, energy: 8, finance_stress: 3, purpose: 8, squad: 9 },
  { id: '4', date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], mood: 5, stress: 8, sleep_quality: 4, sleep_hours: 5.5, energy: 4, finance_stress: 7, purpose: 5, squad: 6 },
  { id: '5', date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], mood: 7, stress: 5, sleep_quality: 7, sleep_hours: 7, energy: 7, finance_stress: 5, purpose: 7, squad: 8 },
  { id: '6', date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], mood: 8, stress: 3, sleep_quality: 8, sleep_hours: 8.5, energy: 9, finance_stress: 3, purpose: 8, squad: 9 },
];

export function useCheckin() {
  const { user } = useAuthStore();
  const { setCheckin } = useCheckinStore();
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split('T')[0];

  const { data: checkins = MOCK_CHECKINS, isLoading } = useQuery({
    queryKey: ['checkins', user?.id],
    queryFn: async () => {
      if (!user) return MOCK_CHECKINS;
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);
      if (error) return MOCK_CHECKINS;
      return data?.length ? data : MOCK_CHECKINS;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: todayCheckin } = useQuery({
    queryKey: ['checkin-today', user?.id, today],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      if (error) return null;
      if (data) setCheckin(data);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const saveCheckin = useMutation({
    mutationFn: async (checkinData) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('checkins')
        .upsert({ ...checkinData, user_id: user.id, date: today })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setCheckin(data);
      queryClient.invalidateQueries({ queryKey: ['checkins', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['checkin-today', user?.id, today] });
    },
  });

  return { checkins, todayCheckin, isLoading, saveCheckin };
}
