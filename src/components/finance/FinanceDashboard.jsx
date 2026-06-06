import { DollarSign, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';
import SpendingDonut from './SpendingDonut';
import StressSpendCorr from './StressSpendCorr';
import TransactionList from './TransactionList';
import FinanceAlert from './FinanceAlert';
import { useFinance } from '../../hooks/useFinance';

export default function FinanceDashboard() {
  const { transactions, categoryData, totalSpend, totalIncome } = useFinance();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <FinanceAlert stressLevel={7} />

      {/* Overview */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-red-400" />
            <span className="text-xs text-text-secondary">Monthly Spend</span>
          </div>
          <p className="text-2xl font-display font-bold text-text-primary">${totalSpend.toFixed(0)}</p>
        </Card>
        <Card glow="green">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-primary-green" />
            <span className="text-xs text-text-secondary">Income</span>
          </div>
          <p className="text-2xl font-display font-bold text-primary-green">${totalIncome.toFixed(0)}</p>
        </Card>
      </div>

      {/* Spending donut */}
      <Card>
        <h2 className="font-display font-bold text-text-primary mb-4">Spending by Category</h2>
        <SpendingDonut data={categoryData} totalSpend={totalSpend} />
        <div className="grid grid-cols-2 gap-2 mt-4">
          {categoryData.slice(0, 4).map((c, i) => (
            <div key={c.name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ['#00F5A0', '#00C2FF', '#A78BFA', '#F5C842'][i] }} />
              <span className="text-xs text-text-dim truncate">{c.name}</span>
              <span className="text-xs text-text-secondary ml-auto">${c.value.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Stress-spend correlation */}
      <Card>
        <h2 className="font-display font-bold text-text-primary mb-1">Stress vs Spending</h2>
        <p className="text-xs text-text-dim mb-4">Higher stress days tend to increase spending</p>
        <StressSpendCorr />
      </Card>

      {/* Transactions */}
      <Card>
        <TransactionList transactions={transactions} />
      </Card>
    </div>
  );
}
