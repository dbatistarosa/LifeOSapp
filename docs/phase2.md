# LifeOS — Phase 2
## React Native Mobile App + Real-time Features
### Claude Code Handoff Document

> **Prerequisite:** Phase 1 web app is live at app.lifeos.app with paying users.
> **Goal:** Native iOS + Android app + real-time squad + bank sync + push notifications.
> **Target:** 1,000 active users, $19,000/month MRR.

---

## 0. WHAT PHASE 2 ADDS

| Feature | Why now |
|---------|---------|
| React Native app (iOS + Android) | Users want it on their phone natively |
| Apple HealthKit + Google Fit | Real biometric data without manual entry |
| Real-time Squad chat | Accountability needs live messaging |
| Bank account sync (Teller.io) | Automatic transactions, no manual entry |
| Push notifications | Check-in reminders, streak alerts, squad activity |
| AI weekly PDF report | Shareable progress report for pro users |
| Offline mode | Check-in works without internet |

---

## 1. TECH STACK ADDITIONS

| Layer | Technology | Notes |
|-------|-----------|-------|
| Mobile | React Native 0.74 + Expo SDK 51 | Managed workflow |
| Navigation | Expo Router v3 | File-based routing |
| Health data | expo-health (HealthKit + Google Fit) | Biometrics bridge |
| Push notifications | Expo Notifications + APNs/FCM | |
| Offline | WatermelonDB | Local SQLite sync |
| Real-time | Supabase Realtime | Squad chat + presence |
| Bank sync | Teller.io | Free up to 100 connections |
| PDF | React Native PDF + jsPDF | Weekly report generation |
| Animations | React Native Reanimated 3 | Smooth 60fps |
| Haptics | expo-haptics | Tactile feedback on check-in |

---

## 2. PROJECT STRUCTURE (React Native)

```
lifeos-mobile/
├── app/                           # Expo Router — file-based routes
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (onboarding)/
│   │   ├── challenge.tsx
│   │   ├── watch.tsx
│   │   └── done.tsx
│   ├── (tabs)/                    # Bottom tab navigator
│   │   ├── index.tsx              # Dashboard (Home)
│   │   ├── coach.tsx
│   │   ├── music.tsx
│   │   ├── squad.tsx
│   │   └── profile.tsx
│   ├── checkin/
│   │   └── index.tsx              # Full-screen check-in flow
│   ├── finance/
│   │   └── index.tsx
│   ├── sleep/
│   │   └── index.tsx
│   ├── purpose/
│   │   └── index.tsx
│   └── _layout.tsx                # Root layout
├── components/
│   ├── ui/                        # Same design system as web
│   ├── checkin/
│   ├── dashboard/
│   ├── coach/
│   ├── finance/
│   ├── music/
│   ├── sleep/
│   ├── squad/
│   └── purpose/
├── hooks/
│   ├── useHealth.ts               # HealthKit + Google Fit
│   ├── useNotifications.ts
│   ├── useOfflineSync.ts
│   └── (all Phase 1 hooks reused)
├── lib/
│   ├── supabase.ts
│   ├── teller.ts                  # Bank sync client
│   ├── watermelon.ts              # Offline DB
│   └── health.ts                  # Health data normalizer
├── store/                         # Zustand stores (same as web)
├── assets/
│   ├── fonts/                     # Syne + DM Sans + Geist Mono
│   ├── sounds/                    # Ambient audio files
│   └── images/
├── app.json                       # Expo config
├── eas.json                       # EAS Build config
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## 3. DATABASE ADDITIONS (new migrations)

### Migration 008 — Push Notification Tokens
```sql
CREATE TABLE public.push_tokens (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  platform    TEXT NOT NULL CHECK (platform IN ('ios','android','web')),
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tokens" ON public.push_tokens
  FOR ALL USING (auth.uid() = user_id);
```

### Migration 009 — Squad Messages (Real-time)
```sql
CREATE TABLE public.squad_messages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id    UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (length(content) <= 1000),
  type        TEXT DEFAULT 'text' CHECK (type IN ('text','celebration','checkin_share')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.squad_messages ENABLE ROW LEVEL SECURITY;

-- Squad members can read and write messages in their squad
CREATE POLICY "Squad members can read messages" ON public.squad_messages
  FOR SELECT USING (
    squad_id IN (
      SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Squad members can send messages" ON public.squad_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    squad_id IN (
      SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid()
    )
  );

-- Supabase Realtime: enable for squad_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.squad_messages;
```

### Migration 010 — Bank Connections (Teller.io)
```sql
CREATE TABLE public.bank_connections (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  teller_access_token TEXT NOT NULL,  -- encrypted at rest
  institution_name    TEXT,
  institution_id      TEXT,
  accounts            JSONB DEFAULT '[]',
  last_sync_at        TIMESTAMPTZ,
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own connections" ON public.bank_connections
  FOR ALL USING (auth.uid() = user_id);

-- Add auto_synced flag to transactions
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS teller_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS auto_categorized BOOLEAN DEFAULT false;
```

### Migration 011 — Health Data from Watch
```sql
CREATE TABLE public.health_records (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL,
  metric      TEXT NOT NULL, -- 'hrv' | 'bpm' | 'spo2' | 'steps' | 'calories'
  value       NUMERIC(10,4) NOT NULL,
  source      TEXT,          -- 'apple_health' | 'google_fit' | 'manual'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own health" ON public.health_records
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX health_user_metric_time ON public.health_records (user_id, metric, recorded_at DESC);

-- Stress score derived from HRV (computed view)
CREATE OR REPLACE VIEW public.stress_from_hrv AS
SELECT
  user_id,
  DATE(recorded_at) as date,
  AVG(value) as avg_hrv,
  -- Lower HRV = higher stress (inverted scale 1-10)
  LEAST(10, GREATEST(1, ROUND(10 - ((AVG(value) - 20) / 8)))) as stress_estimate
FROM public.health_records
WHERE metric = 'hrv'
GROUP BY user_id, DATE(recorded_at);
```

### Migration 012 — Weekly AI Reports
```sql
CREATE TABLE public.weekly_reports (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start  DATE NOT NULL,
  week_end    DATE NOT NULL,
  life_score  SMALLINT,
  summary_en  TEXT,
  summary_es  TEXT,
  insights    JSONB DEFAULT '[]',
  pdf_url     TEXT,   -- Supabase Storage URL
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, week_start)
);

ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own reports" ON public.weekly_reports
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 4. NEW EDGE FUNCTIONS

### Function 5: `sync-bank-transactions`
```typescript
// Triggered: manually by user OR on a schedule (daily)
// Input: { user_id }
// Process:
//   1. Get user's Teller access token from bank_connections
//   2. Fetch transactions from Teller API (last 30 days)
//   3. Deduplicate against existing teller_id values
//   4. Auto-categorize new transactions using Claude Haiku (cost-efficient)
//   5. Insert new transactions
//   6. Update last_sync_at

const TELLER_API = 'https://api.teller.io'

// Auto-categorization prompt (Claude Haiku for cost efficiency):
const categorizationPrompt = `Categorize this transaction into ONE of:
food, transport, entertainment, shopping, health, utilities, income, impulsive, other.
Transaction: {merchant} — ${amount}
Respond with just the category word.`
```

### Function 6: `send-push-notification`
```typescript
// Input: { user_ids: string[], title: string, body: string, data?: object }
// Uses Expo Push Notification service
// Handles: check-in reminders, streak alerts, squad messages, weekly reports

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

// Notification types and their triggers:
// 'checkin_reminder'  → daily at user's chosen time (via pg_cron)
// 'streak_alert'      → if no check-in by 8pm
// 'squad_message'     → new message in user's squad
// 'milestone'         → 7-day streak, 30-day streak, life score improvement
// 'weekly_report'     → every Monday with last week's summary
```

### Function 7: `generate-weekly-report`
```typescript
// Triggered: every Monday at 8am (pg_cron)
// Input: { user_id, week_start }
// Process:
//   1. Aggregate 7 days of check-ins, micro-actions, sleep, finance
//   2. Send to Claude for narrative summary generation
//   3. Generate PDF using jsPDF
//   4. Upload PDF to Supabase Storage
//   5. Save report to weekly_reports table
//   6. Send push notification to user

const reportPrompt = `Generate a warm, encouraging weekly wellness report for this user.
Data: {checkins_7d, actions_completed, sleep_avg, finance_trend, squad_activity}
Include: overall progress, biggest win, one area to improve, one specific goal for next week.
Tone: supportive coach, not clinical. Max 200 words.
Respond in JSON: { "summary_en": "...", "summary_es": "...", "insights": [...] }`
```

### Function 8: `teller-webhook`
```typescript
// Handles Teller.io webhook events
// Events: enrollment.disconnected, account.*, transaction.*
// Action: marks bank_connection as inactive if disconnected
```

---

## 5. APPLE HEALTHKIT INTEGRATION

```typescript
// hooks/useHealth.ts
import * as Health from 'expo-health'

export function useHealthData() {
  const requestPermissions = async () => {
    await Health.requestPermissionsAsync([
      Health.HealthDataType.HeartRateVariabilitySDNN,
      Health.HealthDataType.HeartRate,
      Health.HealthDataType.OxygenSaturation,
      Health.HealthDataType.SleepAnalysis,
      Health.HealthDataType.StepCount,
      Health.HealthDataType.ActiveEnergyBurned,
    ])
  }

  const getTodayMetrics = async () => {
    const now = new Date()
    const startOfDay = new Date(now.setHours(0,0,0,0))

    const [hrv, bpm, spo2, steps] = await Promise.all([
      Health.getHealthDataAsync({ type: Health.HealthDataType.HeartRateVariabilitySDNN, startDate: startOfDay, endDate: now }),
      Health.getHealthDataAsync({ type: Health.HealthDataType.HeartRate, startDate: startOfDay, endDate: now }),
      Health.getHealthDataAsync({ type: Health.HealthDataType.OxygenSaturation, startDate: startOfDay, endDate: now }),
      Health.getHealthDataAsync({ type: Health.HealthDataType.StepCount, startDate: startOfDay, endDate: now }),
    ])

    return {
      hrv:   hrv.data?.[0]?.value ?? null,
      bpm:   bpm.data?.slice(-1)[0]?.value ?? null,
      spo2:  spo2.data?.slice(-1)[0]?.value ?? null,
      steps: steps.data?.reduce((sum, d) => sum + d.value, 0) ?? 0,
    }
  }

  const getLastNightSleep = async () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(20, 0, 0, 0)

    const sleep = await Health.getHealthDataAsync({
      type: Health.HealthDataType.SleepAnalysis,
      startDate: yesterday,
      endDate: new Date(),
    })

    // Aggregate sleep phases
    const phases = { rem: 0, deep: 0, light: 0, awake: 0 }
    sleep.data?.forEach(s => {
      const mins = (new Date(s.endDate).getTime() - new Date(s.startDate).getTime()) / 60000
      if (s.value === 'ASLEEP_REM')   phases.rem   += mins
      if (s.value === 'ASLEEP_DEEP')  phases.deep  += mins
      if (s.value === 'ASLEEP_CORE')  phases.light += mins
      if (s.value === 'AWAKE')        phases.awake += mins
    })

    const total = (phases.rem + phases.deep + phases.light) / 60
    const quality = Math.round(
      ((phases.rem / 90) * 30) +    // REM: 30 points
      ((phases.deep / 90) * 40) +   // Deep: 40 points
      ((total >= 7 ? 1 : total/7) * 30) // Duration: 30 points
    )

    return { total_hours: total, quality_score: quality, ...phases }
  }

  return { requestPermissions, getTodayMetrics, getLastNightSleep }
}
```

---

## 6. TELLER.IO BANK SYNC

```typescript
// lib/teller.ts

// Step 1: Open TellerConnect (in-app browser)
// Step 2: User authenticates with their bank
// Step 3: Teller returns enrollment.accessToken
// Step 4: We save the token (encrypted) and start syncing

export async function initTellerConnect(onSuccess: (token: string) => void) {
  // TellerConnect opens as a WebView/modal
  // applicationId from Teller dashboard
  const tellerConnectUrl = `https://teller.io/connect?application_id=${TELLER_APP_ID}`
  // Open in expo-web-browser
  // Listen for redirect with token
}

export async function fetchTransactions(accessToken: string, accountId: string) {
  const res = await fetch(`https://api.teller.io/accounts/${accountId}/transactions`, {
    headers: {
      'Authorization': `Basic ${btoa(accessToken + ':')}`,
    }
  })
  return res.json()
}

// Auto-categorization map (fast lookup before AI)
const CATEGORY_MAP: Record<string, string> = {
  'uber':        'transport',
  'lyft':        'transport',
  'mcdonald':    'food',
  'starbucks':   'food',
  'netflix':     'entertainment',
  'spotify':     'entertainment',
  'amazon':      'shopping',
  'walmart':     'shopping',
  'cvs':         'health',
  'walgreen':    'health',
  'salary':      'income',
  'payroll':     'income',
  'direct dep':  'income',
}

export function quickCategorize(merchant: string): string | null {
  const lower = merchant.toLowerCase()
  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return cat
  }
  return null  // Falls back to Claude Haiku categorization
}
```

---

## 7. REAL-TIME SQUAD CHAT

```typescript
// components/squad/SquadChat.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function SquadChat({ squadId }: { squadId: string }) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Load existing messages
    supabase
      .from('squad_messages')
      .select('*, profiles(name, avatar_url)')
      .eq('squad_id', squadId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => setMessages(data?.reverse() ?? []))

    // Subscribe to new messages via Supabase Realtime
    const channel = supabase
      .channel(`squad:${squadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'squad_messages',
          filter: `squad_id=eq.${squadId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [squadId])

  const sendMessage = async (content: string) => {
    await supabase.from('squad_messages').insert({
      squad_id: squadId,
      content: content.trim().slice(0, 1000),
      type: 'text',
    })
  }

  return (
    // Chat UI with FlatList (React Native) or div scroll (web)
    // Messages with sender avatar, name, timestamp
    // Input bar fixed at bottom
    // Special message types: celebration 🎉, check-in share
  )
}
```

---

## 8. OFFLINE MODE (WatermelonDB)

```typescript
// lib/watermelon.ts
// Local SQLite database for offline check-ins
// Syncs with Supabase when online

import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

// Tables that work offline:
// - checkins (full offline support)
// - micro_actions (read offline)
// - music_tracks (metadata only)

// Sync strategy:
// 1. User does check-in → saved to WatermelonDB immediately
// 2. Shows success to user
// 3. Background sync to Supabase when internet available
// 4. Conflict resolution: last-write-wins on date field

export async function syncToSupabase(db: Database) {
  const unsyncedCheckins = await db.collections
    .get('checkins')
    .query(Q.where('synced', false))
    .fetch()

  for (const checkin of unsyncedCheckins) {
    await supabase.from('checkins').upsert({
      user_id: checkin.userId,
      date: checkin.date,
      mood: checkin.mood,
      // ... all fields
    })
    await checkin.markSynced()
  }
}
```

---

## 9. PUSH NOTIFICATIONS SETUP

```typescript
// hooks/useNotifications.ts
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'

export async function registerForPushNotifications(userId: string) {
  if (!Device.isDevice) return null

  const { status } = await Notifications.requestPermissionsAsync()
  if (status !== 'granted') return null

  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PROJECT_ID,
  })).data

  // Save token to Supabase
  await supabase.from('push_tokens').upsert({
    user_id: userId,
    token,
    platform: Platform.OS,
    active: true,
  }, { onConflict: 'token' })

  return token
}

// Schedule daily check-in reminder
export async function scheduleCheckinReminder(hour: number, minute: number) {
  await Notifications.cancelAllScheduledNotificationsAsync()

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⚡ LifeOS Check-in",
      body: "2 minutes. That's all it takes to start your day with clarity.",
      data: { screen: 'checkin' },
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  })
}
```

---

## 10. EAS BUILD CONFIG (App Store + Play Store)

```json
// eas.json
{
  "cli": { "version": ">= 8.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false },
      "android": { "buildType": "apk" }
    },
    "production": {
      "ios": {
        "bundleIdentifier": "app.lifeos.mobile",
        "buildConfiguration": "Release"
      },
      "android": {
        "package": "app.lifeos.mobile",
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "hello@lifeos.app",
        "ascAppId": "YOUR_APP_STORE_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

---

## 11. BUILD SPRINTS

### Sprint 5 (Week 9-10): React Native Foundation
```
1. expo init lifeos-mobile --template blank-typescript
2. Install all dependencies
3. Configure Expo Router + navigation
4. Port all UI components from web (Button, Card, etc.)
5. Replicate Auth + Onboarding screens in RN
6. Connect to existing Supabase (same project as web)
7. Run on iOS Simulator + Android Emulator
```

### Sprint 6 (Week 11-12): Health + Offline
```
1. Implement useHealth hook (HealthKit + Google Fit)
2. Auto-populate check-in fields from health data
3. Implement WatermelonDB offline schema
4. Offline check-in flow with background sync
5. Port all dashboard screens to RN
6. Haptic feedback on check-in completion
```

### Sprint 7 (Week 13-14): Bank Sync + Real-time
```
1. Teller.io integration (TellerConnect WebView + token save)
2. sync-bank-transactions Edge Function
3. Auto-categorization with quick map + Claude Haiku fallback
4. Real-time squad chat (Supabase Realtime)
5. Squad presence indicators (online/offline)
```

### Sprint 8 (Week 15-16): Notifications + Report + Deploy
```
1. Push notification registration + storage
2. Daily check-in reminder scheduling
3. send-push-notification Edge Function
4. generate-weekly-report Edge Function + PDF
5. EAS Build setup (development + preview builds)
6. TestFlight beta (iOS) + Internal Testing (Android)
7. App Store + Play Store submissions
```

---

## 12. KEY COMMANDS

```bash
# Initialize React Native project
npx create-expo-app lifeos-mobile --template blank-typescript
cd lifeos-mobile

# Core dependencies
npx expo install expo-router expo-health expo-notifications
npx expo install expo-web-browser expo-secure-store
npx expo install @nozbe/watermelondb
npm install @supabase/supabase-js zustand @tanstack/react-query
npm install react-native-reanimated react-native-gesture-handler

# EAS CLI
npm install -g eas-cli
eas login
eas build:configure

# New Edge Functions
supabase functions deploy sync-bank-transactions
supabase functions deploy send-push-notification
supabase functions deploy generate-weekly-report
supabase functions deploy teller-webhook

# New secrets
supabase secrets set TELLER_APP_ID=app_xxx
supabase secrets set TELLER_SIGNING_SECRET=xxx
supabase secrets set EXPO_ACCESS_TOKEN=xxx

# Build for TestFlight
eas build --platform ios --profile preview

# Submit to App Store
eas submit --platform ios --profile production
```

---

*End of Phase 2 Handoff — LifeOS · Built with purpose in South Florida · 2026*
