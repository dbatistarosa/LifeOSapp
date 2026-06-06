export default function SquadChat({ messages = [] }) {
  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-green to-primary-blue flex-shrink-0 flex items-center justify-center text-xs font-bold text-bg-void mt-0.5">
            {msg.user[0]}
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-xs font-semibold text-text-secondary">{msg.user}</span>
              <span className="text-xs text-text-dim">{msg.time}</span>
            </div>
            <p className="text-sm text-text-primary bg-bg-raised rounded-xl rounded-tl-sm px-3 py-2 border border-white/5">
              {msg.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
