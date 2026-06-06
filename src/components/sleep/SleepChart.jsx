import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export default function SleepChart({ records = [] }) {
  const data = records.slice(0, 7).reverse().map((r, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7],
    hours: r.total_hours,
    quality: r.quality,
  }));

  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#141C30" />
          <XAxis dataKey="day" tick={{ fill: '#4A5270', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 10]} tick={{ fill: '#4A5270', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-bg-raised border border-white/10 rounded-xl px-3 py-2 text-xs">
                  <p className="text-text-secondary font-medium mb-1">{label}</p>
                  <p className="text-primary-blue">Sleep: {payload[0]?.value}h</p>
                </div>
              );
            }}
          />
          <ReferenceLine y={7} stroke="#00F5A0" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Bar dataKey="hours" fill="#00C2FF" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
