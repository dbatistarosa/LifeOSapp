export default function Waveform({ playing = false }) {
  const bars = [40, 70, 55, 90, 65, 80, 45, 70, 60, 85, 50, 75];
  return (
    <div className="flex items-center gap-0.5 h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-primary-green to-primary-blue"
          style={{
            height: `${h}%`,
            animation: playing ? `waveform ${0.6 + i * 0.1}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.05}s`,
            opacity: playing ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}
