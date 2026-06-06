# LifeOS — Phase 3
## B2B Teams + Advanced AI + Scale Infrastructure
### Claude Code Handoff Document

> **Prerequisite:** Phase 2 app is live on App Store + Play Store with 1,000+ users.
> **Goal:** Launch LifeOS Teams (B2B), advanced AI features, scale infrastructure.
> **Target:** $100K MRR — Individual ($19/mo × 3,000) + B2B ($10/emp/mo × 250 employees).

---

## 0. WHAT PHASE 3 ADDS

| Feature | Revenue impact |
|---------|---------------|
| LifeOS Teams (B2B plan) | $8–12/employee/month — highest LTV |
| Admin dashboard for companies | Required for B2B sales |
| Advanced AI pattern detection | Retention driver — users can't get this elsewhere |
| Voice check-in | Reduces friction, increases daily completion rate |
| Wearable deep integration | Apple Watch app + Wear OS tile |
| Multi-language expansion (PT, FR) | Opens Brazil + France markets |
| API for third-party integrations | Slack, Notion, Google Calendar |
| Advanced analytics dashboard | Retention tool for power users |

---

## 1. TECH STACK ADDITIONS

| Layer | Technology | Notes |
|-------|-----------|-------|
| Voice | Whisper API (OpenAI) | Speech-to-text for voice check-in |
| Watch OS | Swift + WatchKit | Native Apple Watch app |
| Wear OS | Kotlin + Compose | Native Wear OS tile |
| Analytics | PostHog (self-hosted) | Product analytics |
| Queue | Supabase pg_cron + pgmq | Background job processing |
| CDN | Cloudflare R2 | Audio files + PDF reports |
| i18n | i18next | PT-BR + FR-FR expansion |
| API | Supabase REST + custom | Third-party integrations |

---

## 2. B2B TEAMS FEATURE

### What "LifeOS Teams" is:
- Companies buy seats for their employees ($8-12/employee/month)
- Company gets an admin dashboard showing **aggregate** wellness data (no individual data)
- Employees get the full LifeOS Pro experience
- HR can set company-wide challenges and initiatives
- Anonymous team-level burnout alerts (e.g. "Engineering team stress index: HIGH")

### New database tables:

```sql
-- Migration 013: Organizations
CREATE TABLE public.organizations (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  plan            TEXT DEFAULT 'teams' CHECK (plan IN ('teams','enterprise')),
  seat_count      INTEGER DEFAULT 10,
  seats_used      INTEGER DEFAULT 0,
  billing_email   TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  price_per_seat  NUMERIC(6,2) DEFAULT 10.00,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Migration 014: Organization Members
CREATE TABLE public.org_members (
  org_id      UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        TEXT DEFAULT 'member' CHECK (role IN ('admin','hr','member')),
  department  TEXT,
  invited_at  TIMESTAMPTZ DEFAULT NOW(),
  joined_at   TIMESTAMPTZ,
  PRIMARY KEY (org_id, user_id)
);

-- Migration 015: Aggregate Team Wellness (no PII — computed nightly)
CREATE TABLE public.team_wellness_snapshots (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id          UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  member_count    SMALLINT,
  checkin_rate    NUMERIC(5,2),   -- % who checked in today
  avg_mood        NUMERIC(4,2),
  avg_stress      NUMERIC(4,2),
  avg_energy      NUMERIC(4,2),
  avg_sleep       NUMERIC(4,2),
  burnout_risk    TEXT CHECK (burnout_risk IN ('low','medium','high','critical')),
  top_challenge   TEXT,
  UNIQUE (org_id, date)
);

ALTER TABLE public.organizations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_wellness_snapshots ENABLE ROW LEVEL SECURITY;

-- Org admins/HR can view their org data
CREATE POLICY "Org admins can manage org" ON public.organizations
  FOR ALL USING (
    id IN (SELECT org_id FROM public.org_members
           WHERE user_id = auth.uid() AND role IN ('admin','hr'))
  );

CREATE POLICY "Members can view their org" ON public.org_members
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

-- Aggregate data only — admins see team trends, not individual scores
CREATE POLICY "Admins view team snapshots" ON public.team_wellness_snapshots
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.org_members
               WHERE user_id = auth.uid() AND role IN ('admin','hr'))
  );
```

### Admin Dashboard (new web route: /teams)
```
/teams                     # Overview: burnout risk gauge, checkin rate
/teams/members             # Member list: invite, remove, set department
/teams/challenges          # Set company-wide weekly challenges
/teams/reports             # Monthly aggregate wellness report PDF
/teams/settings            # Billing, seat count, SSO config
/teams/billing             # Stripe customer portal link
```

### B2B Pricing:
```
Starter:    $8/seat/month   (10-49 employees)
Growth:     $10/seat/month  (50-199 employees)
Enterprise: $12/seat/month  (200+ employees) + custom SLA + SSO
```

---

## 3. VOICE CHECK-IN

```typescript
// components/checkin/VoiceCheckin.tsx
// User taps mic → speaks naturally → AI extracts all 5 metrics

import * as Audio from 'expo-av'

export function VoiceCheckin() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [transcript, setTranscript] = useState('')
  const [extracted, setExtracted] = useState<CheckinData | null>(null)

  const startRecording = async () => {
    const { granted } = await Audio.requestPermissionsAsync()
    if (!granted) return

    const rec = new Audio.Recording()
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
    await rec.startAsync()
    setRecording(rec)
  }

  const stopAndProcess = async () => {
    await recording?.stopAndUnloadAsync()
    const uri = recording?.getURI()

    // Send audio to Supabase Edge Function → Whisper → Claude extraction
    const formData = new FormData()
    formData.append('audio', { uri, type: 'audio/m4a', name: 'checkin.m4a' } as any)

    const { data } = await supabase.functions.invoke('voice-checkin', { body: formData })
    setTranscript(data.transcript)
    setExtracted(data.checkin)
    // Show extracted values for user to confirm before saving
  }
}

// Edge Function: voice-checkin
// 1. Receive audio file
// 2. Send to Whisper API for transcription
// 3. Send transcript to Claude with extraction prompt:
const extractionPrompt = `Extract wellness metrics from this voice check-in.
Transcript: "{transcript}"
Extract: mood (1-10), sleep_hours (number), sleep_quality (1-10), stress (1-10),
energy (1-10), finance_stress (1-10), and any notes.
If a metric isn't mentioned, return null.
Respond in JSON only.`
```

---

## 4. NATIVE APPLE WATCH APP (Swift/WatchKit)

```
lifeos-watch/               # Separate Xcode project
├── LifeOS Watch App/
│   ├── Views/
│   │   ├── ComplicationView.swift    # Watch face complication
│   │   ├── StressRingView.swift      # Main stress ring display
│   │   ├── QuickCheckinView.swift    # 3-tap quick check-in
│   │   ├── BreathingView.swift       # 4-7-8 breathing exercise
│   │   └── MusicTileView.swift       # Now playing + controls
│   ├── Models/
│   │   ├── HealthDataModel.swift     # HealthKit data
│   │   └── WatchConnectivity.swift   # WatchConnectivity sync
│   └── LifeOSWatchApp.swift
```

**Watch complications to build:**
- Modular: Stress ring + BPM
- Circular: Life score (0-100)
- Graphic: Colored stress indicator (green/yellow/red)

**Watch → Phone data flow:**
```swift
// Watch reads HRV/BPM from HealthKit
// Sends to iPhone app via WatchConnectivity
// iPhone app uploads to Supabase
// Watch shows life score synced from cloud
```

---

## 5. ADVANCED AI PATTERN DETECTION

### New Edge Function: `analyze-patterns`
```typescript
// Runs weekly per user (pg_cron every Monday)
// Analyzes 90 days of data to find non-obvious correlations

const patternAnalysisPrompt = `
You are analyzing 90 days of wellness data for a LifeOS user.
Data: {90_day_checkins, transactions, sleep_records, health_records}

Find the TOP 3 most actionable, non-obvious correlations. Examples:
- "Your stress peaks every 2nd Tuesday — that's your bi-weekly team review day"
- "You spend 3x more on food delivery when your sleep < 6h"
- "Your HRV is 15% lower on days after alcohol purchases"
- "Your mood is highest on days you exercise, even briefly"

For each pattern:
1. Name it clearly
2. Show the data supporting it
3. Give ONE specific action to leverage or fix it

Respond in JSON: {
  "patterns": [
    {
      "title_en": "...", "title_es": "...",
      "description_en": "...", "description_es": "...",
      "data_point": "...",
      "action_en": "...", "action_es": "..."
    }
  ]
}
`

// Save to new table:
CREATE TABLE public.pattern_insights (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  patterns    JSONB NOT NULL,
  viewed      BOOLEAN DEFAULT false
);
```

---

## 6. THIRD-PARTY API (Integrations)

### Slack Integration
```typescript
// When user completes check-in → post to personal Slack DM
// When life score drops significantly → alert user in Slack
// Squad challenge updates → optional Slack channel

// OAuth flow: user connects Slack workspace
// Store: oauth_integrations table
// Webhook: POST to user's Slack DM with formatted message
```

### Google Calendar Integration
```typescript
// Scan calendar for "busy" days → pre-warn user about stress
// After completing micro-action → add 15min block to calendar
// Weekly review → add 30min "LifeOS Review" to Monday morning
```

### Notion Integration
```typescript
// Export weekly report to Notion page
// Sync micro-actions to Notion task database
// Create monthly wellness journal entries
```

### New migration for integrations:
```sql
CREATE TABLE public.oauth_integrations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider    TEXT NOT NULL CHECK (provider IN ('slack','google_calendar','notion')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  scope       TEXT,
  metadata    JSONB DEFAULT '{}',
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, provider)
);

ALTER TABLE public.oauth_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own integrations" ON public.oauth_integrations
  FOR ALL USING (auth.uid() = user_id);
```

---

## 7. INFRASTRUCTURE UPGRADES

### Supabase Pro plan features to enable:
```
- pg_cron: Schedule weekly report generation + nightly aggregates
- Read replicas: For analytics queries (don't hit main DB)
- Point-in-time recovery: 7-day backup window
- Custom SMTP: Resend as SMTP server for Supabase Auth emails
```

### pg_cron jobs:
```sql
-- Daily: generate micro-actions for users who checked in (5am EST)
SELECT cron.schedule('generate-actions', '0 9 * * *',
  $$SELECT net.http_post('https://PROJECT.supabase.co/functions/v1/generate-micro-action-batch')$$
);

-- Daily: compute team wellness snapshots (midnight EST)
SELECT cron.schedule('team-snapshots', '0 4 * * *',
  $$SELECT net.http_post('https://PROJECT.supabase.co/functions/v1/compute-team-snapshots')$$
);

-- Monday: generate weekly reports (8am EST)
SELECT cron.schedule('weekly-reports', '0 12 * * 1',
  $$SELECT net.http_post('https://PROJECT.supabase.co/functions/v1/generate-weekly-reports-batch')$$
);

-- Monday: run pattern analysis (9am EST)
SELECT cron.schedule('pattern-analysis', '0 13 * * 1',
  $$SELECT net.http_post('https://PROJECT.supabase.co/functions/v1/analyze-patterns-batch')$$
);
```

### Cloudflare R2 for audio files:
```typescript
// Replace Supabase Storage for audio (better CDN + cheaper)
// R2 bucket: lifeos-audio
// Files: ambient/focus-alpha-waves.mp3, ambient/forest-rain.mp3, etc.
// Serve via: audio.lifeos.app (Cloudflare custom domain)
// Cost: ~$0.015/GB storage + free egress
```

---

## 8. MULTI-LANGUAGE EXPANSION

```typescript
// Add Portuguese (Brazil) and French (France)
// i18next with locale detection

// New languages in DB:
ALTER TABLE public.profiles
  ALTER COLUMN language TYPE TEXT,
  DROP CONSTRAINT IF EXISTS profiles_language_check,
  ADD CONSTRAINT profiles_language_check
    CHECK (language IN ('en','es','pt','fr'));

// Translation files:
// src/i18n/en.json  ← already exists
// src/i18n/es.json  ← already exists
// src/i18n/pt.json  ← NEW
// src/i18n/fr.json  ← NEW

// All AI outputs: already bilingual EN/ES
// Expand Claude prompts to return 4 languages:
{
  "action_en": "...",
  "action_es": "...",
  "action_pt": "...",
  "action_fr": "..."
}
```

---

## 9. BUILD SPRINTS

### Sprint 9 (Week 17-18): B2B Foundation
```
1. Organizations + org_members DB tables
2. Team invitation flow (email invite with magic link)
3. Admin dashboard: /teams overview + member management
4. Aggregate wellness computation Edge Function
5. Stripe metered billing for seat count
6. B2B onboarding flow (different from individual)
```

### Sprint 10 (Week 19-20): Advanced AI + Voice
```
1. Voice check-in (Whisper API + Claude extraction)
2. Pattern analysis Edge Function + UI
3. Pattern insights card in Coach screen
4. Analyze-patterns pg_cron job
5. Pattern history view
```

### Sprint 11 (Week 21-22): Integrations + Watch
```
1. Slack OAuth + DM integration
2. Google Calendar OAuth + event creation
3. Apple Watch companion app (Xcode project)
4. Watch complications (stress ring + life score)
5. WatchConnectivity sync
```

### Sprint 12 (Week 23-24): Scale + Launch
```
1. Cloudflare R2 migration for audio
2. pg_cron jobs for batch operations
3. PostHog analytics integration
4. Multi-language: PT + FR
5. API documentation (Swagger/OpenAPI)
6. Load testing (Supabase + Edge Functions)
7. B2B sales deck + pricing page update
8. Enterprise SSO (SAML via WorkOS) — if enterprise deal closes
```

---

## 10. KEY COMMANDS

```bash
# New Phase 3 Edge Functions
supabase functions deploy voice-checkin
supabase functions deploy analyze-patterns
supabase functions deploy analyze-patterns-batch
supabase functions deploy compute-team-snapshots
supabase functions deploy generate-weekly-reports-batch
supabase functions deploy slack-webhook
supabase functions deploy google-calendar-webhook

# New secrets
supabase secrets set OPENAI_API_KEY=sk-...          # For Whisper voice
supabase secrets set SLACK_CLIENT_ID=...
supabase secrets set SLACK_CLIENT_SECRET=...
supabase secrets set GOOGLE_CLIENT_ID=...
supabase secrets set GOOGLE_CLIENT_SECRET=...
supabase secrets set NOTION_CLIENT_ID=...
supabase secrets set NOTION_CLIENT_SECRET=...
supabase secrets set CLOUDFLARE_R2_ACCESS_KEY=...
supabase secrets set CLOUDFLARE_R2_SECRET_KEY=...

# Enable pg_cron on Supabase Pro
-- Run in SQL Editor:
CREATE EXTENSION IF NOT EXISTS pg_cron;
GRANT USAGE ON SCHEMA cron TO postgres;
```

---

*End of Phase 3 Handoff — LifeOS · Built with purpose in South Florida · 2026*
