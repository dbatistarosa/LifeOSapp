import AppShell from '../components/layout/AppShell';
import FinanceDashboard from '../components/finance/FinanceDashboard';

export default function Finance() {
  return (
    <AppShell>
      <div className="px-0">
        <div className="max-w-2xl mx-auto px-4 pt-6">
          <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Finance</h1>
          <p className="text-text-secondary text-sm mb-0">Track spending & financial wellness</p>
        </div>
        <FinanceDashboard />
      </div>
    </AppShell>
  );
}
