import AppShell from '../components/layout/AppShell';
import PurposeDashboard from '../components/purpose/PurposeDashboard';

export default function Purpose() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Purpose & Life Score</h1>
        <p className="text-text-secondary text-sm">Your holistic wellness overview</p>
      </div>
      <PurposeDashboard />
    </AppShell>
  );
}
