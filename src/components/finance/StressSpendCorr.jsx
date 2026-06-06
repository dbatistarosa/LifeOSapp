import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_CORR = [
  { stress: 8, spend: 220 }, { stress: 3, spend: 45 }, { stress: 7, spend: 180 },
  { stress: 5, spend: 90 }, { stress: 9, spend: 310 }, { stress: 2, spend: 30 },
  { stress: 6, spend: 140 }, { stress: 4, spend: 60 }, { stress: 8, spend: 195 },
  { stress: 1, spend: 20 }, { stress: 7, spend: 160 }, { stress: 5, spend: 85 },
];

export default function StressSpendCorr() {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#141C30" />
          <XAxis dataKey="stress" name="Stress" type="number" domain={[0, 10]} tick={{ fill: '#4A5270', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Stress', position: 'insideBottom', fill: '#4A5270', fontSize: 10 }} />
          <YAxis dataKey="spend" name="Spend ($)" tick={{ fill: '#4A5270', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-bg-raised border border-white/10 rounded-xl px-3 py-2 text-xs">
                  <p className="text-text-secondary">Stress: <span className="text-accent-purple">{payload[0]?.value}</span></p>
                  <p className="text-text-secondary">Spend: <span className="text-accent-gold">${payload[1]?.value}</span></p>
                </div>
              );
            }}
          />
          <Scatter data={MOCK_CORR} fill="#A78BFA" fillOpacity={0.8} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
