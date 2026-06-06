import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/authStore';

const MOCK_TRANSACTIONS = [
  { id: '1', amount: -45.00, category: 'Food & Drink', description: 'Lunch delivery', date: new Date().toISOString(), type: 'expense' },
  { id: '2', amount: -120.00, category: 'Shopping', description: 'Online shopping', date: new Date(Date.now() - 86400000).toISOString(), type: 'expense' },
  { id: '3', amount: 3500.00, category: 'Income', description: 'Salary', date: new Date(Date.now() - 2 * 86400000).toISOString(), type: 'income' },
  { id: '4', amount: -85.00, category: 'Entertainment', description: 'Streaming + going out', date: new Date(Date.now() - 3 * 86400000).toISOString(), type: 'expense' },
  { id: '5', amount: -200.00, category: 'Health', description: 'Gym + pharmacy', date: new Date(Date.now() - 4 * 86400000).toISOString(), type: 'expense' },
  { id: '6', amount: -1200.00, category: 'Housing', description: 'Rent', date: new Date(Date.now() - 5 * 86400000).toISOString(), type: 'expense' },
  { id: '7', amount: -65.00, category: 'Transport', description: 'Gas + Uber', date: new Date(Date.now() - 6 * 86400000).toISOString(), type: 'expense' },
];

export function useFinance() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: transactions = MOCK_TRANSACTIONS, isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return MOCK_TRANSACTIONS;
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(50);
      if (error || !data?.length) return MOCK_TRANSACTIONS;
      return data;
    },
  });

  const addTransaction = useMutation({
    mutationFn: async (txData) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...txData, user_id: user.id })
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] }),
  });

  const spendingByCategory = transactions
    .filter((t) => t.type === 'expense' || t.amount < 0)
    .reduce((acc, t) => {
      const cat = t.category || 'Other';
      acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const categoryData = Object.entries(spendingByCategory).map(([name, value]) => ({ name, value }));
  const totalSpend = categoryData.reduce((s, c) => s + c.value, 0);
  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return { transactions, isLoading, addTransaction, categoryData, totalSpend, totalIncome };
}
