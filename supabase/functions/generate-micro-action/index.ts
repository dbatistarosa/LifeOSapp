import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SYSTEM_PROMPT = `You are LifeOS Wellness AI. Based on the user's daily check-in data, generate ONE specific, actionable micro-action they can do TODAY to improve their wellbeing.

The micro-action should:
- Take 5-30 minutes maximum
- Be realistic and specific (not vague)
- Target their lowest-scoring pillar
- Be encouraging and positive in tone

Respond in JSON format ONLY:
{
  "action_text": "string (1-2 sentences, specific action)",
  "category": "one of: mindfulness, movement, sleep, finance, social, purpose, nutrition",
  "duration_mins": number (5-30)
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }

  try {
    const { user_id, checkin_id, checkin_data, history_30d } = await req.json();

    if (!user_id || !checkin_data) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const userMessage = `User's today check-in:
- Mood: ${checkin_data.mood}/10
- Stress: ${checkin_data.stress}/10
- Sleep quality: ${checkin_data.sleep_quality}/10 (${checkin_data.sleep_hours}h)
- Energy: ${checkin_data.energy}/10
- Finance stress: ${checkin_data.finance_stress}/10
- Purpose: ${checkin_data.purpose}/10
- Social connection: ${checkin_data.squad}/10

Recent 30-day context: ${JSON.stringify(history_30d?.slice(0, 7) || [])}

Generate a personalized micro-action for today.`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!anthropicResponse.ok) {
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const aiData = await anthropicResponse.json();
    const rawText = aiData.content[0].text;

    let action;
    try {
      action = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      action = match ? JSON.parse(match[0]) : {
        action_text: 'Take 5 minutes to breathe deeply and set one intention for the day.',
        category: 'mindfulness',
        duration_mins: 5,
      };
    }

    // Save to Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );

    const { data, error } = await supabase.from('micro_actions').insert({
      user_id,
      checkin_id,
      date: new Date().toISOString().split('T')[0],
      action_text: action.action_text,
      category: action.category,
      duration_mins: action.duration_mins,
    }).select().single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('generate-micro-action error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
