import AppShell from '../components/layout/AppShell';
import SquadDashboard from '../components/squad/SquadDashboard';

export default function Squad() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Squad</h1>
        <p className="text-text-secondary text-sm">Accountability with your wellness crew</p>
      </div>
      <SquadDashboard />
    </AppShell>
  );
}
