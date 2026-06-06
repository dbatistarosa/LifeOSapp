import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useAICoach } from '../../hooks/useAICoach';

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-green to-primary-blue flex-shrink-0 mr-2 mt-1 flex items-center justify-center text-xs font-bold text-bg-void">
          AI
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-primary-green/20 border border-primary-green/30 text-text-primary rounded-br-sm'
            : 'bg-bg-raised border border-white/5 text-text-primary rounded-bl-sm'
        }`}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function CoachChat() {
  const { messages, isStreaming, sendMessage } = useAICoach();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const msg = input.trim();
    setInput('');
    await sendMessage(msg);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const PROMPTS = [
    "Why is my energy so low?",
    "Help me reduce stress",
    "How's my sleep?",
    "Give me a tip for today",
  ];

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isStreaming && (
          <div className="flex items-center gap-2 text-text-dim text-sm mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-green to-primary-blue flex-shrink-0 mr-2 flex items-center justify-center text-xs font-bold text-bg-void">AI</div>
            <div className="flex gap-1">
              {[0, 0.15, 0.3].map((delay) => (
                <motion.div
                  key={delay}
                  className="w-2 h-2 rounded-full bg-text-dim"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="flex-shrink-0 px-3 py-1.5 bg-bg-surface border border-white/10 rounded-full text-xs text-text-secondary hover:text-text-primary hover:border-primary-green/30 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 items-end bg-bg-raised border border-white/10 rounded-2xl px-4 py-3 focus-within:border-primary-green/40 transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask your AI coach..."
            rows={1}
            className="flex-1 bg-transparent text-text-primary placeholder-text-dim resize-none focus:outline-none text-sm max-h-28"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="p-1.5 rounded-lg bg-primary-green text-bg-void disabled:opacity-40 flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
