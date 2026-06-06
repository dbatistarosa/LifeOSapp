import { useState } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { useFinance } from '../../hooks/useFinance';

const CATEGORIES = ['Food & Drink', 'Shopping', 'Entertainment', 'Health', 'Housing', 'Transport', 'Income', 'Other'];

export default function TransactionList({ transactions = [] }) {
  const { addTransaction } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Food & Drink', type: 'expense' });

  const handleAdd = async () => {
    await addTransaction.mutateAsync({
      ...form,
      amount: form.type === 'expense' ? -Math.abs(parseFloat(form.amount)) : parseFloat(form.amount),
      date: new Date().toISOString(),
    });
    setShowModal(false);
    setForm({ description: '', amount: '', category: 'Food & Drink', type: 'expense' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-secondary">Recent Transactions</h3>
        <Button size="sm" variant="secondary" onClick={() => setShowModal(true)}>
          <Plus size={14} />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {transactions.slice(0, 8).map((t) => (
          <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.amount > 0 ? 'bg-primary-green/15' : 'bg-red-400/10'}`}>
                {t.amount > 0 ? <ArrowDownLeft size={16} className="text-primary-green" /> : <ArrowUpRight size={16} className="text-red-400" />}
              </div>
              <div>
                <p className="text-sm text-text-primary">{t.description}</p>
                <p className="text-xs text-text-dim">{t.category}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${t.amount > 0 ? 'text-primary-green' : 'text-text-secondary'}`}>
              {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Transaction">
        <div className="space-y-4">
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="e.g. Lunch at cafe"
          />
          <Input
            label="Amount ($)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="0.00"
          />
          <div>
            <label className="text-sm font-medium text-text-secondary">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="mt-1.5 w-full bg-bg-raised border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary-green/50"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${form.type === t ? 'bg-primary-green text-bg-void' : 'bg-bg-raised text-text-secondary'}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <Button fullWidth onClick={handleAdd} loading={addTransaction.isPending}>Add Transaction</Button>
        </div>
      </Modal>
    </div>
  );
}
