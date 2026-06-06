const EMOJIS = ['😔', '😞', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩', '😍'];

export default function MoodSlider({ value, onChange }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-7xl mb-4 transition-all duration-300">{EMOJIS[value - 1]}</div>
        <div className="text-4xl font-display font-bold gradient-text">{value}</div>
        <div className="text-text-secondary mt-1">
          {value <= 2 ? 'Really struggling' : value <= 4 ? 'Not great' : value <= 6 ? 'Getting by' : value <= 8 ? 'Doing well' : 'Amazing!'}
        </div>
      </div>
      <div className="px-2">
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-text-dim mt-2">
          <span>1 — Low</span>
          <span>10 — Amazing</span>
        </div>
      </div>
    </div>
  );
}
