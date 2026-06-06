# LifeOS — Phase 4
## Growth Engine + Monetization at Scale
### Claude Code Handoff Document

> **Prerequisite:** Phase 3 live — B2B plan active, 3,000+ individual users.
> **Goal:** Build the viral growth engine, referral system, coaching marketplace, and hit $1M ARR.
> **Target:** $1,031,400 ARR — Individual + B2B + Coaching sessions.

---

## 0. WHAT PHASE 4 ADDS

| Feature | Revenue / Growth impact |
|---------|------------------------|
| Referral program | Viral coefficient > 1 → organic user growth |
| Coaching marketplace | $47–$79/session → high-margin revenue stream |
| Annual plan discount | Reduce churn, increase LTV |
| Gift subscriptions | New acquisition channel |
| Affiliate program | Influencer-driven growth |
| Advanced gamification | Streak rewards, badges, leaderboard |
| Lifetime deal (LTD) | Cash injection for product development |
| Content engine (AI blog) | SEO → organic traffic |

---

## 1. REFERRAL PROGRAM

### Logic:
- User A invites User B with unique link
- User B signs up → both get 1 month free
- After 3 successful referrals → User A gets permanent 20% discount
- Tracked via referral_code in profiles + referrals table

```sql
-- Migration 016: Referrals
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code  TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  ADD COLUMN IF NOT EXISTS referred_by    UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_discount NUMERIC(4,2) DEFAULT 0;

CREATE TABLE public.referrals (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id     UUID REFERENCES public.profiles(id),
  referred_id     UUID REFERENCES public.profiles(id),
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','rewarded')),
  referrer_reward TEXT,    -- 'one_month_free' | '20_percent_discount'
  referred_reward TEXT,    -- 'one_month_free'
  rewarded_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (referred_id)     -- each user can only be referred once
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see their referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Trigger: when referral becomes 'active' (referred user subscribes)
CREATE OR REPLACE FUNCTION public.process_referral_reward()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  referrer_count INTEGER;
BEGIN
  IF NEW.status = 'active' AND OLD.status = 'pending' THEN
    -- Give referred user 1 month free (via Stripe coupon)
    -- Give referrer 1 month free
    -- Check if referrer now has 3+ active referrals
    SELECT COUNT(*) INTO referrer_count
    FROM public.referrals
    WHERE referrer_id = NEW.referrer_id AND status = 'active';

    IF referrer_count >= 3 THEN
      UPDATE public.profiles
      SET referral_discount = 20
      WHERE id = NEW.referrer_id;
    END IF;

    -- Update referral count on referrer profile
    UPDATE public.profiles
    SET referral_count = referral_count + 1
    WHERE id = NEW.referrer_id;

    NEW.status = 'rewarded';
    NEW.rewarded_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_referral_activated
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.process_referral_reward();
```

### Referral UI:
```
/referral                  # Dedicated referral page
  - User's unique link: app.lifeos.app/ref/ABC12345
  - Share buttons: WhatsApp, Twitter, email, copy link
  - Progress tracker: "2 of 3 friends joined — 1 more for 20% off forever"
  - History of referrals (pending/active)
```

### Edge Function: `process-referral`
```typescript
// Called when new user signs up with ref=CODE in URL
// 1. Find referrer by referral_code
// 2. Create referrals record (status: pending)
// 3. Set referred_by on new user's profile
// 4. When user subscribes → webhook marks referral active → trigger fires
```

---

## 2. COACHING MARKETPLACE

### Concept:
- Certified life/wellness coaches list their profile on LifeOS
- Users can book 1:1 sessions ($47-$79 each)
- LifeOS takes 20% commission
- Coach gets paid via Stripe Connect
- LifeOS provides context: coach sees user's recent check-ins + patterns before session

```sql
-- Migration 017: Coaches
CREATE TABLE public.coaches (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) UNIQUE,
  bio_en          TEXT,
  bio_es          TEXT,
  specialties     TEXT[],    -- ['stress','burnout','finance','relationships']
  languages       TEXT[],    -- ['en','es']
  session_price   NUMERIC(6,2),
  session_duration SMALLINT DEFAULT 50,   -- minutes
  stripe_account_id TEXT,                 -- Stripe Connect
  verified        BOOLEAN DEFAULT false,
  rating          NUMERIC(3,2),
  review_count    INTEGER DEFAULT 0,
  available       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Migration 018: Sessions
CREATE TABLE public.coaching_sessions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id        UUID REFERENCES public.coaches(id),
  client_id       UUID REFERENCES public.profiles(id),
  scheduled_at    TIMESTAMPTZ NOT NULL,
  duration_mins   SMALLINT DEFAULT 50,
  status          TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','completed','cancelled','no_show')),
  price           NUMERIC(6,2),
  platform_fee    NUMERIC(6,2),           -- 20% to LifeOS
  coach_payout    NUMERIC(6,2),           -- 80% to coach
  stripe_payment_intent_id TEXT,
  video_room_url  TEXT,                   -- Daily.co room URL
  client_context  JSONB,                  -- Recent check-ins shared with coach
  coach_notes     TEXT,
  client_rating   SMALLINT CHECK (client_rating BETWEEN 1 AND 5),
  client_review   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coaches          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;

-- Public can view verified coaches
CREATE POLICY "Anyone can view coaches" ON public.coaches
  FOR SELECT USING (verified = true);

-- Users see their own sessions
CREATE POLICY "Users view own sessions" ON public.coaching_sessions
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = (
    SELECT user_id FROM public.coaches WHERE id = coach_id
  ));
```

### Coach dashboard (new route: /coach-portal):
```
/coach-portal/profile      # Bio, specialties, price, availability
/coach-portal/calendar     # Availability slots + booked sessions
/coach-portal/sessions     # Upcoming + past sessions
/coach-portal/clients      # Client list with wellness context
/coach-portal/earnings     # Stripe Connect dashboard embed
```

### Video sessions (Daily.co):
```typescript
// Edge Function: create-coaching-room
// 1. Create Daily.co room (expires after session)
// 2. Generate token for coach + client
// 3. Return room URL + tokens

const dailyRoom = await fetch('https://api.daily.co/v1/rooms', {
  method: 'POST',
  headers: { Authorization: `Bearer ${DAILY_API_KEY}` },
  body: JSON.stringify({
    name: `lifeos-session-${sessionId}`,
    exp: Math.floor(scheduledAt.getTime() / 1000) + (duration * 60) + 900, // +15min buffer
    properties: {
      max_participants: 2,
      enable_recording: false,
      enable_chat: true,
    }
  })
})
```

---

## 3. ADVANCED GAMIFICATION

```sql
-- Migration 019: Achievements
CREATE TABLE public.achievements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  title_en    TEXT NOT NULL,
  title_es    TEXT NOT NULL,
  description_en TEXT,
  description_es TEXT,
  icon        TEXT,    -- emoji or icon key
  category    TEXT CHECK (category IN ('streak','wellness','social','finance','milestone')),
  threshold   INTEGER  -- e.g. 7 for "7-day streak"
);

-- Seed achievements
INSERT INTO public.achievements (key, title_en, title_es, icon, category, threshold) VALUES
  ('streak_7',   '7-Day Warrior',      'Guerrero de 7 días',   '🔥', 'streak',    7),
  ('streak_30',  'Month Champion',     'Campeón del mes',      '⚡', 'streak',    30),
  ('streak_90',  '90-Day Transformer', 'Transformador 90D',    '🌟', 'streak',    90),
  ('score_80',   'Life Optimizer',     'Optimizador de vida',  '🎯', 'milestone', 80),
  ('score_90',   'Peak Performer',     'Alto rendimiento',     '🏆', 'milestone', 90),
  ('referral_3', 'Community Builder',  'Constructor comunidad','👥', 'social',    3),
  ('actions_50', 'Action Taker',       'Tomador de acción',    '✅', 'wellness',  50),
  ('finance_low','Money Mindful',      'Consciente del dinero','💚', 'finance',   NULL);

CREATE TABLE public.user_achievements (
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id),
  unlocked_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own achievements" ON public.user_achievements
  FOR ALL USING (auth.uid() = user_id);
```

### Achievement unlock logic (Edge Function: `check-achievements`):
```typescript
// Called after: check-in saved, micro-action completed, referral activated
// Checks all achievement conditions
// If new achievement unlocked: save to user_achievements + send push notification

async function checkStreakAchievements(userId: string) {
  const streak = await getCurrentStreak(userId)
  const milestones = [7, 14, 30, 60, 90, 180, 365]

  for (const days of milestones) {
    if (streak >= days) {
      await unlockAchievement(userId, `streak_${days}`)
    }
  }
}
```

---

## 4. AFFILIATE PROGRAM

```sql
-- Migration 020: Affiliates
CREATE TABLE public.affiliates (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id),
  code            TEXT UNIQUE NOT NULL,
  commission_pct  NUMERIC(4,2) DEFAULT 30,   -- 30% of first payment
  total_clicks    INTEGER DEFAULT 0,
  total_signups   INTEGER DEFAULT 0,
  total_earned    NUMERIC(10,2) DEFAULT 0,
  stripe_account_id TEXT,                    -- Stripe Connect for payout
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.affiliate_conversions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id    UUID REFERENCES public.affiliates(id),
  converted_user_id UUID REFERENCES public.profiles(id),
  commission_amount NUMERIC(6,2),
  stripe_transfer_id TEXT,
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Affiliate portal (route: /affiliate):
```
/affiliate/dashboard       # Clicks, signups, earnings
/affiliate/materials       # Banners, copy, videos to share
/affiliate/payouts         # Stripe Connect payout history
/affiliate/apply           # Application form for new affiliates
```

---

## 5. GIFT SUBSCRIPTIONS

```sql
-- Migration 021: Gift Cards
CREATE TABLE public.gift_subscriptions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchaser_id    UUID REFERENCES public.profiles(id),
  recipient_email TEXT,
  recipient_id    UUID REFERENCES public.profiles(id),   -- set when redeemed
  plan            TEXT CHECK (plan IN ('monthly','annual')),
  months          SMALLINT,
  code            TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 12),
  stripe_payment_intent_id TEXT,
  redeemed        BOOLEAN DEFAULT false,
  redeemed_at     TIMESTAMPTZ,
  message         TEXT,    -- personal message from giver
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Gift flow:
```
1. /gift page → select plan + duration + message
2. Stripe checkout → purchase gift card
3. System emails: sender (receipt) + recipient (gift notification with code)
4. Recipient goes to /redeem/CODE → applies to account
5. Edge Function applies Stripe coupon for N months
```

---

## 6. LIFETIME DEAL (LTD)

```typescript
// One-time payment for lifetime access
// Available for limited time (first 200 buyers)
// Price: $249 lifetime

// Stripe: create one-time price product
// After payment: set profiles.subscription = 'lifetime'
// Lifetime users never churn → powerful for ARR stability
// Promote via: AppSumo, Product Hunt, newsletter

// DB:
ALTER TABLE public.profiles
  ALTER COLUMN subscription TYPE TEXT,
  DROP CONSTRAINT IF EXISTS profiles_subscription_check,
  ADD CONSTRAINT profiles_subscription_check
    CHECK (subscription IN ('free','pro','founder','lifetime','teams'));
```

---

## 7. SEO CONTENT ENGINE

```
/blog                      # Public blog (Next.js or Astro)
/blog/[slug]               # Individual posts

Content strategy (AI-generated, human-reviewed):
- "10 signs you're burning out" (targets: burnout, stress)
- "Why you spend more when stressed" (targets: stress spending)
- "How to improve HRV naturally" (targets: HRV, heart rate variability)
- "The best apps for work-life balance in 2026" (targets: competitors)
- "What is a life operating system" (brand-defining content)

Tools:
- Astro for the blog (static, fast, SEO-perfect)
- Resend for email newsletter
- Claude API for first draft generation
- PostHog for content analytics
```

---

## 8. BUILD SPRINTS

### Sprint 13 (Week 25-26): Referral Program
```
1. Referral code generation on signup
2. process-referral Edge Function
3. Referral page UI + share buttons
4. Stripe coupon application for rewards
5. Referral tracking dashboard
```

### Sprint 14 (Week 27-28): Gamification + Achievements
```
1. Seed achievements table
2. check-achievements Edge Function
3. Achievement unlock animations (Framer Motion)
4. Achievement showcase on profile
5. Squad leaderboard (streak ranking)
```

### Sprint 15 (Week 29-30): Coaching Marketplace
```
1. Coach profiles DB + application flow
2. Calendar/availability system
3. Booking flow + Stripe payment split
4. Daily.co video room integration
5. Post-session rating + review
6. Coach portal dashboard
```

### Sprint 16 (Week 31-32): Growth + Launch $1M
```
1. Affiliate program + portal
2. Gift subscriptions
3. Lifetime deal (limited to 200)
4. Annual plan pricing in Stripe
5. SEO blog setup (Astro)
6. PostHog full analytics integration
7. Product Hunt launch
8. Press kit + media outreach
```

---

## 9. $1M ARR MATH

```
Individual Pro:   3,000 users × $19/month × 12  = $684,000
B2B Teams:        5 companies × 50 seats × $10/month × 12 = $300,000
Coaching:         50 sessions/month × $79 × 12 × 0.20 commission = $9,480
Affiliates:       Commission expense (not revenue)
Lifetime deals:   200 × $249 = $49,800 (one-time, not recurring)
──────────────────────────────────────────────────
Recurring ARR:    $993,480
One-time LTD:     $49,800
TOTAL YEAR 1:     $1,043,280 ✅
```

---

*End of Phase 4 Handoff — LifeOS · Built with purpose in South Florida · 2026*
