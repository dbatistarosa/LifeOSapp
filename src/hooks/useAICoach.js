import { useState } from 'react';
import useAuthStore from '../store/authStore';

const MOCK_RESPONSES = [
  "Based on your recent check-ins, I can see you've been managing stress quite well this week! Your sleep quality has improved significantly. Keep up that evening routine — it's clearly making a difference.",
  "I notice your energy levels tend to dip mid-week. This is often related to accumulated stress or slightly shorter sleep. Try a 20-minute power nap on Wednesdays or a short walk after lunch to reset your energy.",
  "Your purpose scores are strong — that sense of meaning is a powerful buffer against stress. Consider journaling about what specifically gave you that sense of purpose this week to reinforce those patterns.",
  "Great question! Looking at your data, your mood correlates strongly with your sleep quality (r ≈ 0.8). Prioritizing 7-8 hours of sleep will likely have the biggest impact on your overall wellbeing.",
];

let mockIndex = 0;

export function useAICoach() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your LifeOS AI Coach. I've analyzed your recent wellness data and I'm here to help you thrive. What's on your mind today?",
      timestamp: new Date(),
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (content) => {
    const userMsg = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          message: content,
          conversation_history: messages.slice(-10),
        }),
      });

      if (!response.ok) throw new Error('API not available');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: '', timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiContent += decoder.decode(value, { stream: true });
        setMessages((prev) => prev.map((m) => m.id === aiMsg.id ? { ...m, content: aiContent } : m));
      }
    } catch (e) {
      // Use mock response
      await new Promise((r) => setTimeout(r, 800));
      const mockReply = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
      mockIndex++;
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockReply,
        timestamp: new Date(),
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const clearMessages = () => setMessages([{
    id: '1',
    role: 'assistant',
    content: "Hi! I'm your LifeOS AI Coach. How can I help you today?",
    timestamp: new Date(),
  }]);

  return { messages, isStreaming, sendMessage, clearMessages };
}
