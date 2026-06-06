import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const SYSTEM_PROMPT = `You are LifeOS, a compassionate and insightful AI life coach. You have access to the user's wellness data including mood, stress, sleep, energy, finance stress, purpose alignment, and social connections.

Your role is to:
- Provide evidence-based guidance on improving wellbeing
- Identify patterns in their data and offer actionable insights
- Be warm, encouraging, and non-judgmental
- Keep responses concise (2-4 paragraphs max)
- Suggest specific, achievable actions
- Reference their actual data when relevant

Always prioritize the user's mental and physical health. If they express distress, acknowledge their feelings first before offering advice.`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, message, conversation_history = [], user_context = {} } = await req.json();

    const contextStr = user_context.recent_checkin ? `
User context:
- Recent mood: ${user_context.recent_checkin.mood}/10
- Stress: ${user_context.recent_checkin.stress}/10
- Sleep: ${user_context.recent_checkin.sleep_quality}/10 (${user_context.recent_checkin.sleep_hours}h)
- Energy: ${user_context.recent_checkin.energy}/10
- Life Score: ${user_context.life_score || 'N/A'}
` : '';

    const systemWithContext = SYSTEM_PROMPT + (contextStr ? `\n\n${contextStr}` : '');

    const messages = [
      ...conversation_history.filter((m: { role: string }) => m.role !== 'system').slice(-10),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        stream: true,
        system: systemWithContext,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    // Stream the response back
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

          for (const line of lines) {
            const data = line.replace('data: ', '');
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                await writer.write(encoder.encode(parsed.delta.text));
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('coach-chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
