import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#00F5A0', '#00C2FF', '#A78BFA', '#F5C842', '#f97316', '#ec4899', '#84cc16', '#14b8a6'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-raised border border-white/10 rounded-xl px-3 py-2 text-xs">
      <p className="text-text-primary font-medium">{payload[0].name}</p>
      <p className="text-primary-green">${payload[0].value.toFixed(0)}</p>
    </div>
  );
};

export default function SpendingDonut({ data = [], totalSpend = 0 }) {
  return (
    <div className="relative h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-display font-bold text-text-primary">${totalSpend.toFixed(0)}</span>
        <span className="text-xs text-text-dim">this month</span>
      </div>
    </div>
  );
}
