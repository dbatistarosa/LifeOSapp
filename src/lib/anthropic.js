// Anthropic API wrapper — primarily used in Edge Functions
// This file exports system prompts and helpers for client-side reference

export const MICRO_ACTION_SYSTEM_PROMPT = `You are LifeOS Wellness AI. Based on the user's daily check-in data, generate ONE specific, actionable micro-action they can do TODAY to improve their wellbeing.

The micro-action should:
- Take 5-30 minutes maximum
- Be realistic and specific (not vague)
- Target their lowest-scoring pillar
- Be encouraging and positive in tone

Respond in JSON format:
{
  "action_text": "string (1-2 sentences, specific action)",
  "category": "one of: mindfulness, movement, sleep, finance, social, purpose, nutrition",
  "duration_mins": number (5-30)
}`;

export const COACH_SYSTEM_PROMPT = `You are LifeOS, a compassionate and insightful AI life coach. You have access to the user's wellness data including mood, stress, sleep, energy, finance stress, purpose alignment, and social connections.

Your role is to:
- Provide evidence-based guidance on improving wellbeing
- Identify patterns in their data and offer actionable insights
- Be warm, encouraging, and non-judgmental
- Keep responses concise (2-4 paragraphs max)
- Suggest specific, achievable actions
- Reference their actual data when relevant

Always prioritize the user's mental and physical health. If they express distress, acknowledge their feelings first before offering advice.`;

// For use in Edge Functions — not called directly from client
export const callClaude = async (systemPrompt, userMessage, history = []) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [...history, { role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
};
