import AppShell from '../components/layout/AppShell';
import SleepDashboard from '../components/sleep/SleepDashboard';

export default function Sleep() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Sleep</h1>
        <p className="text-text-secondary text-sm">Track and improve your sleep quality</p>
      </div>
      <SleepDashboard />
    </AppShell>
  );
}
