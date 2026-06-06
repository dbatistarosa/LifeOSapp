import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  let event;
  try {
    // In production, verify webhook signature using Stripe SDK
    // For now, parse the JSON directly
    event = JSON.parse(body);
  } catch (err) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  );

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const tier = session.metadata?.tier || 'pro';

      if (userId) {
        await supabase.from('profiles').update({
          subscription_tier: tier,
          subscription_status: 'active',
          stripe_customer_id: session.customer,
        }).eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      const status = subscription.status === 'active' ? 'active' : 'inactive';
      const tier = subscription.metadata?.tier || 'pro';

      await supabase.from('profiles').update({
        subscription_status: status,
        subscription_tier: subscription.status === 'active' ? tier : 'free',
      }).eq('stripe_customer_id', customerId);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      await supabase.from('profiles').update({
        subscription_status: 'inactive',
        subscription_tier: 'free',
      }).eq('stripe_customer_id', customerId);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      await supabase.from('profiles').update({
        subscription_status: 'past_due',
      }).eq('stripe_customer_id', customerId);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
