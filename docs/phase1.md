# LifeOS — Phase 1 MVP
## Claude Code Master Handoff Document

> **Purpose:** This document gives Claude Code everything it needs to build the LifeOS MVP from zero to deployable app — no ambiguity, no back-and-forth.
> **Last updated:** June 2026
> **Context:** Phase 0 (waitlist landing page) is live. Phase 1 is the app itself.

---

## 0. WHAT WE'RE BUILDING

LifeOS is a personal operating system that helps people solve the 10 most common human challenges:
stress & anxiety, work-life balance, tech addiction, loneliness, financial instability, low self-esteem, lack of purpose, poor health habits, unhealthy relationships, and fear of change.

**Core loop (daily):**
1. User does a 2-minute check-in (mood, sleep, stress, energy, finances)
2. AI analyzes patterns across 30 days of data
3. App delivers 1 personalized micro-action for the day
4. Smartwatch tracks biometrics (HRV, BPM, SpO2) in real time
5. Ambient music activates automatically based on stress level
6. Squad (group of ≤10 people) provides accountability

---

## 1. TECH STACK

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + Vite | Web app first, React Native in Phase 2 |
| Styling | Tailwind CSS v3 | Custom Aurora Dark design system |
| State | Zustand | Simple, no boilerplate |
| Data fetching | TanStack Query v5 | Caching + optimistic updates |
| Charts | Recharts | Mood/sleep/stress visualizations |
| Auth | Supabase Auth | Email + magic link |
| Database | Supabase PostgreSQL | With RLS on every table |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) | Micro-actions + coach |
| Email | Resend | Transactional emails |
| Payments | Stripe | $19/month subscription |
| Hosting | Vercel | Auto-deploy from GitHub |
| Music | Howler.js | Ambient audio player |

**Design system tokens (Aurora Dark):**
```
Primary green:    #00F5A0
Primary blue:     #00C2FF  
Purple accent:    #A78BFA
Gold accent:      #F5C842
Background void:  #03040A
Background deep:  #060810
Background base:  #0A0C18
Background surface: #0F1525
Background raised:  #141C30
Text primary:     #F0F4FF
Text secondary:   #8A96B0
Text dim:         #4A5270
Font display:     Syne (800, 700, 600)
Font body:        DM Sans (400, 500, 600)
Font mono:        Geist Mono (400, 500)
```

---

## 2. PROJECT STRUCTURE

```
lifeos-app/
├── src/
│   ├── components/
│   │   ├── ui/                    # Design system primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Progress.jsx
│   │   │   └── Modal.jsx
│   │   ├── layout/
│   │   │   ├── AppShell.jsx       # Main layout wrapper
│   │   │   ├── Navbar.jsx
│   │   │   ├── BottomNav.jsx      # Mobile tab bar
│   │   │   └── Sidebar.jsx        # Desktop sidebar
│   │   ├── checkin/
│   │   │   ├── CheckInFlow.jsx    # Multi-step check-in
│   │   │   ├── MoodSlider.jsx
│   │   │   ├── SleepInput.jsx
│   │   │   ├── StressScale.jsx
│   │   │   ├── EnergyMeter.jsx
│   │   │   └── FinanceSnap.jsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LifeScore.jsx      # Ring with 0-100 score
│   │   │   ├── MicroAction.jsx    # Today's AI action card
│   │   │   ├── WellnessRings.jsx  # 4 animated rings
│   │   │   ├── WeeklyChart.jsx    # Trend line charts
│   │   │   └── PillarGrid.jsx     # 10 pillars grid
│   │   ├── coach/
│   │   │   ├── CoachChat.jsx      # AI chat interface
│   │   │   ├── InsightCard.jsx
│   │   │   └── PatternAlert.jsx
│   │   ├── finance/
│   │   │   ├── FinanceDashboard.jsx
│   │   │   ├── SpendingDonut.jsx
│   │   │   ├── StressSpendCorr.jsx # Correlation chart
│   │   │   ├── TransactionList.jsx
│   │   │   └── FinanceAlert.jsx
│   │   ├── music/
│   │   │   ├── MusicPlayer.jsx
│   │   │   ├── MusicCategories.jsx
│   │   │   ├── TrackList.jsx
│   │   │   └── Waveform.jsx
│   │   ├── sleep/
│   │   │   ├── SleepDashboard.jsx
│   │   │   ├── SleepPhaseBar.jsx
│   │   │   ├── SleepChart.jsx
│   │   │   └── SleepInsight.jsx
│   │   ├── squad/
│   │   │   ├── SquadDashboard.jsx
│   │   │   ├── MemberList.jsx
│   │   │   ├── WeeklyChallenge.jsx
│   │   │   └── SquadChat.jsx
│   │   ├── purpose/
│   │   │   ├── PurposeDashboard.jsx
│   │   │   ├── LifeScoreRing.jsx
│   │   │   └── PillarBars.jsx
│   │   └── onboarding/
│   │       ├── OnboardingFlow.jsx  # 3-step setup
│   │       ├── ChallengeSelect.jsx
│   │       ├── WatchConnect.jsx
│   │       └── OnboardingDone.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCheckin.js
│   │   ├── useAICoach.js
│   │   ├── useFinance.js
│   │   ├── useSquad.js
│   │   ├── useSleep.js
│   │   ├── useMusic.js
│   │   └── useLifeScore.js
│   ├── lib/
│   │   ├── supabase.js            # Supabase client
│   │   ├── anthropic.js           # Claude API wrapper
│   │   ├── stripe.js              # Stripe client
│   │   └── analytics.js           # Simple event tracking
│   ├── store/
│   │   ├── authStore.js           # Zustand auth state
│   │   ├── checkinStore.js
│   │   └── uiStore.js
│   ├── pages/
│   │   ├── Landing.jsx            # Public landing (redirect to lifeos.app)
│   │   ├── Auth.jsx               # Login / signup
│   │   ├── Onboarding.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Coach.jsx
│   │   ├── Finance.jsx
│   │   ├── Music.jsx
│   │   ├── Sleep.jsx
│   │   ├── Squad.jsx
│   │   ├── Purpose.jsx
│   │   └── Settings.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   ├── functions/
│   │   ├── generate-micro-action/  # Claude AI → daily action
│   │   ├── coach-chat/             # Claude AI → coach conversation
│   │   ├── send-email/             # Resend transactional emails
│   │   └── stripe-webhook/         # Handle subscription events
│   └── migrations/
│       ├── 001_auth_profiles.sql
│       ├── 002_checkins.sql
│       ├── 003_micro_actions.sql
│       ├── 004_finance.sql
│       ├── 005_squads.sql
│       ├── 006_music.sql
│       └── 007_sleep.sql
├── public/
│   └── favicon.svg
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

---

## 3. DATABASE SCHEMA (Supabase PostgreSQL)

### Migration 001 — User Profiles
```sql
-- Extends Supabase auth.users
CREATE TABLE public.profiles (
  id              UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email           TEXT,
  name            TEXT,
  avatar_url      TEXT,
  language        TEXT DEFAULT 'en' CHECK (language IN ('en','es')),
  top_challenges  TEXT[] DEFAULT '{}',    -- from onboarding
  watch_connected BOOLEAN DEFAULT false,
  watch_type      TEXT,                   -- 'apple' | 'galaxy' | 'wearos' | null
  subscription    TEXT DEFAULT 'free'     -- 'free' | 'pro' | 'founder'
    CHECK (subscription IN ('free','pro','founder')),
  stripe_customer_id TEXT,
  onboarding_done BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Migration 002 — Daily Check-ins
```sql
CREATE TABLE public.checkins (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  mood            SMALLINT CHECK (mood BETWEEN 1 AND 10),
  sleep_hours     NUMERIC(4,2) CHECK (sleep_hours BETWEEN 0 AND 24),
  sleep_quality   SMALLINT CHECK (sleep_quality BETWEEN 1 AND 10),
  stress          SMALLINT CHECK (stress BETWEEN 1 AND 10),
  energy          SMALLINT CHECK (energy BETWEEN 1 AND 10),
  finance_stress  SMALLINT CHECK (finance_stress BETWEEN 1 AND 10),
  note            TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date)
);

ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own checkins" ON public.checkins
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX checkins_user_date_idx ON public.checkins (user_id, date DESC);
```

### Migration 003 — AI Micro-Actions
```sql
CREATE TABLE public.micro_actions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  checkin_id      UUID REFERENCES public.checkins(id),
  date            DATE NOT NULL,
  action_text     TEXT NOT NULL,
  action_text_es  TEXT,
  category        TEXT,   -- 'stress' | 'sleep' | 'finance' | 'social' | 'purpose' | 'health'
  duration_mins   SMALLINT,
  completed       BOOLEAN DEFAULT false,
  completed_at    TIMESTAMPTZ,
  rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date)
);

ALTER TABLE public.micro_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own actions" ON public.micro_actions
  FOR ALL USING (auth.uid() = user_id);
```

### Migration 004 — Finance
```sql
CREATE TABLE public.transactions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  amount          NUMERIC(12,2) NOT NULL,  -- negative = expense, positive = income
  category        TEXT,
  merchant        TEXT,
  note            TEXT,
  stress_level    SMALLINT,    -- what was user's stress when this happened
  is_impulsive    BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX transactions_user_date_idx ON public.transactions (user_id, date DESC);
```

### Migration 005 — Squads
```sql
CREATE TABLE public.squads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  max_members SMALLINT DEFAULT 10,
  challenge   TEXT,           -- current weekly challenge
  created_by  UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.squad_members (
  squad_id    UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        TEXT DEFAULT 'member' CHECK (role IN ('admin','member')),
  streak      SMALLINT DEFAULT 0,
  challenge_progress SMALLINT DEFAULT 0,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (squad_id, user_id)
);

ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Squad members can view their squad" ON public.squads
  FOR SELECT USING (
    id IN (SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view their memberships" ON public.squad_members
  FOR ALL USING (user_id = auth.uid());
```

### Migration 006 — Music Tracks
```sql
CREATE TABLE public.music_tracks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  title_es    TEXT,
  artist      TEXT DEFAULT 'LifeOS Ambient',
  category    TEXT NOT NULL,   -- 'focus' | 'relax' | 'sleep' | 'nature' | 'energy'
  frequency   TEXT,            -- '40hz' | 'delta' | 'theta' | 'alpha' | 'loop'
  duration_s  INTEGER,
  audio_url   TEXT NOT NULL,   -- Supabase Storage URL
  cover_emoji TEXT DEFAULT '🎵',
  stress_trigger SMALLINT,     -- auto-play if stress >= this value (null = manual only)
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Public read — no RLS needed for music catalog
CREATE TABLE public.listening_sessions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id    UUID REFERENCES public.music_tracks(id),
  started_at  TIMESTAMPTZ DEFAULT NOW(),
  ended_at    TIMESTAMPTZ,
  trigger     TEXT   -- 'manual' | 'stress_auto' | 'watch_alert'
);

ALTER TABLE public.listening_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sessions" ON public.listening_sessions
  FOR ALL USING (auth.uid() = user_id);
```

### Migration 007 — Sleep
```sql
CREATE TABLE public.sleep_records (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  bedtime         TIME,
  wake_time       TIME,
  total_hours     NUMERIC(4,2),
  quality_score   SMALLINT CHECK (quality_score BETWEEN 0 AND 100),
  rem_minutes     SMALLINT,
  deep_minutes    SMALLINT,
  light_minutes   SMALLINT,
  awake_minutes   SMALLINT,
  hrv_avg         NUMERIC(6,2),    -- from watch
  source          TEXT DEFAULT 'manual',  -- 'manual' | 'apple_health' | 'google_fit'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date)
);

ALTER TABLE public.sleep_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sleep" ON public.sleep_records
  FOR ALL USING (auth.uid() = user_id);
```

---

## 4. SUPABASE EDGE FUNCTIONS

### Function 1: `generate-micro-action`
**Trigger:** Called after each check-in submission
**Input:** `{ user_id, checkin_id, checkin_data, history_30d }`
**Output:** Saves a micro_action row and returns the action text

```typescript
// Prompt to send to Claude:
const systemPrompt = `You are the LifeOS AI Coach. You analyze a person's daily check-in data
and 30-day history to generate ONE specific, actionable micro-action they can complete today
in under 15 minutes. 

Rules:
- ONE action only, never a list
- Must be executable today, under 15 minutes
- Must directly address the user's worst metric today
- Never give generic advice ("meditate", "exercise more")
- Be specific: time, place, duration, exact method
- Vary the actions — never repeat the same action within 7 days
- Respond in JSON: { "action_en": "...", "action_es": "...", "category": "...", "duration_mins": N }`
```

### Function 2: `coach-chat`
**Trigger:** User sends a message in the Coach tab
**Input:** `{ user_id, message, conversation_history, user_context }`
**Output:** Streams Claude's response back

```typescript
// System prompt:
const systemPrompt = `You are the LifeOS AI Coach — a supportive, data-driven personal coach.
You have access to this user's last 30 days of check-in data, patterns, and history.

Your personality:
- Warm but direct — no fluff
- Data-informed — reference their actual numbers when relevant
- Solution-focused — always move toward action
- Never diagnose — you're a coach, not a therapist
- Bilingual — respond in the same language the user writes in

User context will be provided with each message.`
```

### Function 3: `send-email`
**Trigger:** Various (welcome, weekly summary, streak alert)
**Input:** `{ to, type, data }`
Types: `'welcome'` | `'weekly_summary'` | `'streak_broken'` | `'milestone'`

### Function 4: `stripe-webhook`
**Trigger:** Stripe webhook events
**Handles:** `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
**Action:** Updates `profiles.subscription` field accordingly

---

## 5. SCREENS TO BUILD (Priority Order)

### Priority 1 — Core Flow (build first)

**Auth Screen**
- Email + password signup/login
- Magic link option
- Google OAuth (optional, Phase 1b)
- Redirect to onboarding if new user

**Onboarding (3 steps)**
- Step 1: Select top 1-3 challenges from the 10 (multi-select cards)
- Step 2: Connect smartwatch (Apple / Galaxy / Wear OS / Skip)
- Step 3: Set check-in reminder time + Done screen

**Daily Check-in (2-minute flow)**
- Full-screen, one question at a time
- Animated sliders for: Mood (1-10), Sleep (hours + quality), Stress (1-10), Energy (1-10), Finance stress (1-10)
- Optional text note at end
- After submit → generate AI micro-action → redirect to Dashboard

**Dashboard (Home)**
- 4 wellness rings (Mood / Sleep / Stress / Energy) — animated
- Today's micro-action card (highlighted, with "Mark done" button)
- 3 progress bars (Wellness / Finance / Purpose weekly %)
- Quick stat strip (streak, check-ins this month)
- "Check in today" CTA if not done yet

### Priority 2 — Main Features

**AI Coach Screen**
- Chat UI with message bubbles
- AI responds with user's data context
- Weekly insight cards shown between messages
- Correlation charts (stress → spend, sleep → mood)

**Finance Screen**
- Balance display + add transaction button
- Spending donut chart (categories)
- Weekly bar chart
- Transaction list (manual entry only in Phase 1)
- Stress-spend correlation insight card
- Alert banner when stress is high (impulsive spend warning)

**Music Screen**
- Category chips (All / Focus / Relax / Sleep / Nature)
- Now playing card with vinyl animation
- Waveform visualizer (CSS animated bars)
- Progress bar + controls (prev / play-pause / next)
- Playlist of tracks
- Auto-play logic: if latest check-in stress ≥ 7, suggest focus/relax track

**Sleep Screen**
- Last night summary (hours + quality score)
- Sleep phase visualization bar (Awake / Light / Deep / REM)
- Weekly sleep bar chart
- HRV average
- Manual sleep log entry form
- AI insight comparing this week vs last

### Priority 3 — Secondary Features

**Squad Screen**
- Squad name + member avatars
- Current weekly challenge with progress bar
- Member list with individual streaks + mini progress bars
- (Phase 1: static data / mock; real-time in Phase 2)

**Purpose Screen**
- Life score ring (0-100, computed from all pillar averages)
- 8 pillar cards with individual progress bars
- Daily quote selected by AI based on user state

**Settings Screen**
- Profile (name, avatar, language toggle EN/ES)
- Notifications (check-in reminder time)
- Subscription (current plan, upgrade CTA → Stripe checkout)
- Smartwatch connection status
- Data export (CSV of check-ins)
- Delete account

---

## 6. LIFE SCORE ALGORITHM

```javascript
// Computed from latest 7-day average of all metrics
function computeLifeScore(checkins_7d, finance_data, squad_data, sleep_data) {
  const weights = {
    mood:          0.20,
    stress:        0.20,  // inverted: (10 - stress) / 10
    sleep_quality: 0.15,
    energy:        0.15,
    finance:       0.10,  // inverted: (10 - finance_stress) / 10
    purpose:       0.10,  // from micro-action completion rate
    squad:         0.10,  // challenge progress
  }

  const scores = {
    mood:          avg(checkins_7d.map(c => c.mood)) / 10,
    stress:        avg(checkins_7d.map(c => (10 - c.stress))) / 10,
    sleep_quality: avg(checkins_7d.map(c => c.sleep_quality)) / 10,
    energy:        avg(checkins_7d.map(c => c.energy)) / 10,
    finance:       avg(checkins_7d.map(c => (10 - c.finance_stress))) / 10,
    purpose:       micro_action_completion_rate_7d,
    squad:         challenge_progress / 100,
  }

  const raw = Object.entries(weights).reduce((sum, [key, w]) => sum + (scores[key] * w), 0)
  return Math.round(raw * 100)  // 0-100
}
```

---

## 7. AI MICRO-ACTION EXAMPLES

| Worst metric today | Example micro-action |
|-------------------|---------------------|
| Stress = 9 | "Before your 2pm meeting, spend 5 minutes in the parking lot doing 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. Do 3 cycles." |
| Sleep < 5h | "Set a phone-off alarm for 9:30pm tonight. No screens after that. Put the phone in another room." |
| Mood = 3 | "Text one specific person you haven't spoken to in 2+ weeks. Not a group chat — one person, one real message." |
| Finance stress = 8 | "Open your banking app right now and write down your exact balance. Just knowing the number reduces anxiety 40%." |
| Energy = 2 | "Go outside and walk for exactly 10 minutes. No podcast, no phone. Just walk and notice 5 things you see." |

---

## 8. STRIPE SUBSCRIPTION SETUP

**Products to create in Stripe Dashboard:**
```
Product: LifeOS Pro
  Price 1: $19.00/month  (price_monthly)
  Price 2: $190.00/year  (price_annual — 2 months free)

Product: LifeOS Founder (for waitlist users only)
  Price: $9.00/month  (price_founder — locked forever)
```

**Checkout flow:**
1. User clicks "Upgrade to Pro" in Settings
2. App calls Supabase Edge Function `create-checkout-session`
3. Function creates Stripe checkout session with `client_reference_id = user_id`
4. User completes payment on Stripe-hosted page
5. Stripe fires `checkout.session.completed` webhook
6. `stripe-webhook` function updates `profiles.subscription = 'pro'`

**Feature gating (Phase 1):**
- Free: Dashboard + Check-in + 1 micro-action/day
- Pro: Everything + Coach chat + Finance + Music + Sleep + Squad + Purpose

---

## 9. ENVIRONMENT VARIABLES

```bash
# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Anthropic (used in Edge Functions only — NEVER in frontend)
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...          # Edge Functions only
STRIPE_WEBHOOK_SECRET=whsec_...        # Edge Functions only

# Resend (Edge Functions only)
RESEND_API_KEY=re_...

# App
VITE_APP_URL=https://app.lifeos.app
```

**Security rules:**
- `VITE_*` = safe to expose in browser (public keys only)
- Everything else = Supabase secrets only, never in frontend

---

## 10. ROUTING

```jsx
// React Router v6
const routes = [
  { path: '/',              element: <Landing />,         public: true  },
  { path: '/auth',          element: <Auth />,            public: true  },
  { path: '/onboarding',   element: <Onboarding />,      auth: true    },
  { path: '/dashboard',    element: <Dashboard />,        auth: true    },
  { path: '/coach',        element: <Coach />,            auth: true, pro: true },
  { path: '/finance',      element: <Finance />,          auth: true, pro: true },
  { path: '/music',        element: <Music />,            auth: true, pro: true },
  { path: '/sleep',        element: <Sleep />,            auth: true, pro: true },
  { path: '/squad',        element: <Squad />,            auth: true, pro: true },
  { path: '/purpose',      element: <Purpose />,          auth: true    },
  { path: '/settings',     element: <Settings />,         auth: true    },
]
// Unauthenticated → redirect to /auth
// Authenticated, no onboarding → redirect to /onboarding
// Pro-only routes: show upgrade modal if on free plan
```

---

## 11. MOBILE-FIRST DESIGN RULES

- All layouts mobile-first (375px base)
- Bottom navigation bar on mobile (5 tabs: Home / Coach / Music / Squad / Profile)
- Sidebar navigation on desktop (≥ 1024px)
- Touch targets minimum 44×44px
- Swipe gestures for check-in steps (use Framer Motion)
- All animations use `prefers-reduced-motion` media query

---

## 12. BUILD PHASES FOR CLAUDE CODE

### Sprint 1 (Week 1-2): Foundation
```
1. Initialize Vite + React + Tailwind + Zustand + React Router
2. Configure Tailwind with Aurora Dark design tokens
3. Build UI primitives: Button, Card, Input, Badge, Progress, Modal
4. Set up Supabase client + auth store
5. Build Auth screen (email login + signup)
6. Run all 7 SQL migrations in Supabase
7. Build Onboarding flow (3 steps)
8. Build AppShell (layout + BottomNav + Sidebar)
```

### Sprint 2 (Week 3-4): Core Loop
```
1. Build CheckIn flow (5 animated steps)
2. Deploy generate-micro-action Edge Function
3. Build Dashboard (rings + micro-action + progress bars)
4. Build Purpose screen (life score ring + pillars)
5. Build Settings (profile + language toggle)
6. Set up Stripe products + create-checkout-session function
7. Add subscription gating
```

### Sprint 3 (Week 5-6): Features
```
1. Build AI Coach screen + coach-chat Edge Function
2. Build Finance screen (manual transactions + charts)
3. Build Music screen (Howler.js player + track list)
4. Build Sleep screen (manual log + charts)
5. Build Squad screen (static first, real-time Phase 2)
```

### Sprint 4 (Week 7-8): Polish + Launch
```
1. Add Framer Motion animations throughout
2. Smartwatch data integration (Apple HealthKit / Google Fit web bridges)
3. Stripe webhook handler
4. Send-email Edge Function (welcome + weekly summary)
5. Error handling + loading states everywhere
6. End-to-end testing
7. Deploy to Vercel → app.lifeos.app
```

---

## 13. KEY COMMANDS FOR CLAUDE CODE

```bash
# Initialize project
npm create vite@latest lifeos-app -- --template react
cd lifeos-app
npm install

# Core dependencies
npm install @supabase/supabase-js @tanstack/react-query zustand
npm install react-router-dom framer-motion recharts howler
npm install @stripe/stripe-js stripe
npm install tailwindcss @tailwindcss/forms autoprefixer postcss
npm install lucide-react clsx

# Dev dependencies
npm install -D @types/react @types/react-dom

# Tailwind init
npx tailwindcss init -p

# Supabase CLI (for Edge Functions)
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_ID
supabase functions deploy generate-micro-action
supabase functions deploy coach-chat
supabase functions deploy send-email
supabase functions deploy stripe-webhook

# Set secrets
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set RESEND_API_KEY=re_...
```

---

## 14. WHAT PHASE 2 ADDS (don't build yet)

- React Native mobile app (iOS + Android)
- Real-time squad chat (Supabase Realtime)
- Apple HealthKit + Google Fit native SDK integration
- Bank account sync (Teller.io)
- AI-generated weekly PDF report
- Push notifications
- B2B "LifeOS Teams" plan
- Claude.ai voice coach sessions

---

## 15. LINKS & CREDENTIALS NEEDED BEFORE STARTING

| Service | Action needed |
|---------|--------------|
| Supabase | Project already exists from Phase 0 waitlist |
| Anthropic | Get API key from console.anthropic.com |
| Stripe | Create account + products at dashboard.stripe.com |
| Resend | Account exists from Phase 0 |
| Vercel | Account exists from Phase 0 |
| GitHub | Repo exists from Phase 0 (or create new) |

---

*End of Phase 1 Handoff Document — LifeOS · Built with purpose in South Florida · 2026*
