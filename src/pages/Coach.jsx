import AppShell from '../components/layout/AppShell';
import CoachChat from '../components/coach/CoachChat';
import InsightCard from '../components/coach/InsightCard';
import PatternAlert from '../components/coach/PatternAlert';

const INSIGHTS = [
  { title: 'Sleep improves your mood', description: 'On days you sleep 7.5h+, your mood is 1.8 points higher on average.', trend: 'up' },
  { title: 'Monday stress spike', description: 'Your stress is typically 35% higher on Mondays. Prepare with Sunday wind-down.', trend: 'down' },
  { title: 'Consistent check-in streak', description: "You've checked in 6 days in a row. Consistency is key!", trend: 'up' },
];

export default function Coach() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-text-primary">AI Coach</h1>
          <p className="text-text-secondary text-sm mt-1">Personalized guidance based on your data</p>
        </div>

        <PatternAlert message="Your stress tends to spike on Mondays. Consider scheduling lighter tasks for Monday mornings this week." />

        <div className="mt-4 grid gap-3 mb-6">
          {INSIGHTS.map((ins, i) => <InsightCard key={i} insight={ins} />)}
        </div>

        <div className="bg-bg-surface border border-white/5 rounded-2xl overflow-hidden" style={{ height: '60vh' }}>
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-sm font-semibold text-text-primary">Chat with your coach</p>
          </div>
          <CoachChat />
        </div>
      </div>
    </AppShell>
  );
}
