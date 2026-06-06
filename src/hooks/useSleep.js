import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/authStore';

const MOCK_SLEEP = [
  { id: '1', date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], total_hours: 7.5, quality: 7, deep_pct: 20, rem_pct: 25, light_pct: 45, awake_pct: 10 },
  { id: '2', date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], total_hours: 6.0, quality: 5, deep_pct: 15, rem_pct: 20, light_pct: 50, awake_pct: 15 },
  { id: '3', date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], total_hours: 8.0, quality: 8, deep_pct: 23, rem_pct: 27, light_pct: 42, awake_pct: 8 },
  { id: '4', date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], total_hours: 5.5, quality: 4, deep_pct: 12, rem_pct: 18, light_pct: 55, awake_pct: 15 },
  { id: '5', date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], total_hours: 7.0, quality: 7, deep_pct: 19, rem_pct: 24, light_pct: 47, awake_pct: 10 },
  { id: '6', date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], total_hours: 8.5, quality: 9, deep_pct: 25, rem_pct: 28, light_pct: 40, awake_pct: 7 },
  { id: '7', date: new Date().toISOString().split('T')[0], total_hours: 7.0, quality: 7, deep_pct: 20, rem_pct: 25, light_pct: 45, awake_pct: 10 },
];

export function useSleep() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: sleepRecords = MOCK_SLEEP, isLoading } = useQuery({
    queryKey: ['sleep', user?.id],
    queryFn: async () => {
      if (!user) return MOCK_SLEEP;
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(14);
      if (error || !data?.length) return MOCK_SLEEP;
      return data;
    },
  });

  const addSleepRecord = useMutation({
    mutationFn: async (sleepData) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('sleep_records')
        .insert({ ...sleepData, user_id: user.id })
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sleep', user?.id] }),
  });

  const avgHours = sleepRecords.slice(0, 7).reduce((s, r) => s + r.total_hours, 0) / Math.max(sleepRecords.slice(0, 7).length, 1);
  const avgQuality = sleepRecords.slice(0, 7).reduce((s, r) => s + r.quality, 0) / Math.max(sleepRecords.slice(0, 7).length, 1);
  const latestRecord = sleepRecords[0] || MOCK_SLEEP[MOCK_SLEEP.length - 1];

  return { sleepRecords, isLoading, addSleepRecord, avgHours, avgQuality, latestRecord };
}
