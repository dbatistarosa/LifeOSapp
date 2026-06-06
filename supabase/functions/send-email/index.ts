import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, text, template } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const emailBody = template ? renderTemplate(template) : { subject, html, text };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'LifeOS <noreply@lifeos.app>',
        to: Array.isArray(to) ? to : [to],
        subject: emailBody.subject || subject,
        html: emailBody.html || html,
        text: emailBody.text || text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend error: ${error}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('send-email error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function renderTemplate(template: { type: string; data: Record<string, unknown> }) {
  switch (template.type) {
    case 'welcome':
      return {
        subject: 'Welcome to LifeOS! 🚀',
        html: `<h1>Welcome to LifeOS!</h1><p>Start your wellness journey today. Complete your first daily check-in to get your Life Score.</p>`,
        text: 'Welcome to LifeOS! Start your wellness journey today.',
      };
    case 'weekly_report':
      return {
        subject: `Your LifeOS Weekly Report — Score: ${template.data.score}`,
        html: `<h1>Your Weekly Wellness Report</h1><p>Life Score: <strong>${template.data.score}</strong></p>`,
        text: `Your weekly Life Score: ${template.data.score}`,
      };
    case 'checkin_reminder':
      return {
        subject: 'Time for your daily LifeOS check-in 🌅',
        html: `<h1>Daily Check-in Reminder</h1><p>Take 2 minutes to check in and track your wellness.</p>`,
        text: "Don't forget your daily check-in!",
      };
    default:
      return { subject: '', html: '', text: '' };
  }
}
