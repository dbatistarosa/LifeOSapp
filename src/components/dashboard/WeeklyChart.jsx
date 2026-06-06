import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatCheckins(checkins) {
  return checkins.slice(0, 7).reverse().map((c, i) => ({
    day: DAYS[i % 7],
    Mood: c.mood,
    Energy: c.energy,
    Sleep: c.sleep_quality,
    Stress: 10 - c.stress,
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-raised border border-white/10 rounded-xl p-3 text-xs">
      <p className="font-medium text-text-secondary mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-secondary">{p.name}:</span>
          <span style={{ color: p.color }} className="font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function WeeklyChart({ checkins = [] }) {
  const data = formatCheckins(checkins);

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#141C30" />
          <XAxis dataKey="day" tick={{ fill: '#4A5270', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 10]} tick={{ fill: '#4A5270', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="Mood" stroke="#00F5A0" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Energy" stroke="#F5C842" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Sleep" stroke="#00C2FF" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Stress" stroke="#A78BFA" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
