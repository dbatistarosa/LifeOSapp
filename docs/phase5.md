# LifeOS — Phase 5
## Enterprise + AI Personalization Engine + Global Scale
### Claude Code Handoff Document

> **Prerequisite:** Phase 4 live — $1M+ ARR, 5,000+ users, B2B traction.
> **Goal:** Enterprise contracts, AI personalization moat, international expansion.
> **Target:** $5M ARR — Enterprise + International + Marketplace ecosystem.

---

## 0. WHAT PHASE 5 ADDS

| Feature | Strategic value |
|---------|----------------|
| Enterprise SSO (SAML/OIDC) | Unlock Fortune 500 contracts ($50K–$500K/year) |
| AI Personalization Engine | Deepest moat — impossible to replicate quickly |
| LifeOS API (public) | Platform play — third-party apps build on LifeOS |
| International: PT, FR, DE, JA | 4 new markets simultaneously |
| LifeOS for Kids (ages 13-17) | New segment, parent approval flow |
| Hardware partnership program | White-label for wearable companies |
| Acquisition mode: data flywheel | More users → better AI → better product |
| IPO readiness prep | SOC 2 Type II, GDPR full compliance, audit trails |

---

## 1. ENTERPRISE SSO (SAML/OIDC)

### Provider: WorkOS
```typescript
// WorkOS handles SAML, OIDC, Directory Sync (SCIM)
// Supports: Okta, Azure AD, Google Workspace, OneLogin

import WorkOS from '@workos-inc/node'
const workos = new WorkOS(process.env.WORKOS_API_KEY)

// Edge Function: sso-redirect
// 1. Organization admin configures their IdP in WorkOS dashboard
// 2. Employee clicks "Sign in with SSO"
// 3. LifeOS redirects to WorkOS → IdP → back to LifeOS
// 4. WorkOS returns user profile → create/update Supabase user
// 5. Auto-provision org_members record

async function handleSSOCallback(code: string) {
  const { profile, accessToken } = await workos.sso.getProfileAndToken({
    code,
    clientID: process.env.WORKOS_CLIENT_ID,
  })

  // Find or create user in Supabase
  const { data: user } = await supabase.auth.admin.getUserByEmail(profile.email)
    ?? await supabase.auth.admin.createUser({ email: profile.email, email_confirm: true })

  // Auto-join their organization
  const org = await findOrgByWorkOSId(profile.organizationId)
  if (org) {
    await supabase.from('org_members').upsert({
      org_id: org.id,
      user_id: user.id,
      role: profile.role ?? 'member',
    })
  }

  return user
}
```

### Directory Sync (SCIM):
```typescript
// When HR removes employee from Okta:
// SCIM event → workos → LifeOS webhook → deactivate org_member
// Automatically revoke access without manual admin work

// New DB columns:
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS workos_org_id TEXT,
  ADD COLUMN IF NOT EXISTS sso_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS scim_enabled BOOLEAN DEFAULT false;
```

### Enterprise pricing:
```
Starter:    $8/seat/month   (10-49 seats, self-serve)
Growth:     $10/seat/month  (50-199 seats, self-serve)
Enterprise: Custom/seat     (200+ seats, negotiated)
  + SSO (SAML/OIDC)
  + SCIM provisioning
  + Custom data retention policy
  + Dedicated Slack channel
  + Quarterly business review
  + SLA: 99.9% uptime
  + SOC 2 Type II report
```

---

## 2. AI PERSONALIZATION ENGINE

### The Concept:
Every user gets a unique AI model fine-tuned on their personal patterns. This is LifeOS's deepest moat — a competitor can copy the features but not 2 years of your personal data.

```typescript
// NOT actual fine-tuning (expensive) — instead:
// "Soft personalization" via rich context injection

// PersonalizationProfile built from user's data:
interface PersonalizationProfile {
  // Behavioral patterns
  peak_stress_days: string[]       // ['Monday', 'Tuesday']
  peak_stress_hours: number[]      // [14, 15, 16]  (2-4pm)
  best_mood_conditions: string[]   // ['after_exercise', 'friday', 'good_sleep']
  
  // Response patterns
  action_types_completed: string[] // ['breathing', 'walk', 'call_friend']
  action_types_avoided: string[]   // ['journaling', 'cold_shower']
  avg_completion_rate: number      // 0.73 (73%)
  
  // Finance patterns
  stress_spend_correlation: number // 0.82 = strong correlation
  impulse_spend_categories: string[] // ['food_delivery', 'online_shopping']
  
  // Sleep patterns
  optimal_sleep_hours: number      // 7.5
  sleep_debt_indicator: boolean    // true if <6h last 3 nights
  
  // Communication style
  prefers_direct: boolean          // true = "Just do X", false = longer explanations
  language: string                 // 'en' | 'es' | 'pt' | 'fr' | 'de' | 'ja'
  
  // Life context
  top_challenges: string[]
  goal_focus: string               // current primary goal
  squad_size: number
  coaching_history: boolean
}

// This profile is rebuilt weekly and injected into every Claude prompt
// The AI "knows" the user without actual fine-tuning
```

### Edge Function: `build-personalization-profile`
```typescript
// Runs every Sunday (pg_cron) per active user
// Aggregates 90 days of data into PersonalizationProfile
// Saves to profiles.personalization_profile (JSONB column)

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS personalization_profile JSONB,
  ADD COLUMN IF NOT EXISTS profile_updated_at TIMESTAMPTZ;

// All subsequent AI calls inject this profile:
const systemPrompt = `
You are the LifeOS AI Coach for ${user.name}.

DEEP KNOWLEDGE OF THIS USER:
- Peak stress: ${profile.peak_stress_days.join(', ')} afternoons (${profile.peak_stress_hours.join(', ')}:00)
- Actions they complete: ${profile.action_types_completed.join(', ')}
- Actions they avoid: ${profile.action_types_avoided.join(', ')} — do NOT suggest these
- When stressed, they spend impulsively on: ${profile.impulse_spend_categories.join(', ')}
- Optimal sleep: ${profile.optimal_sleep_hours}h — they currently have sleep debt: ${profile.sleep_debt_indicator}
- Communication: ${profile.prefers_direct ? 'Direct, brief, action-first' : 'Warm, explanatory'}
- Primary goal: ${profile.goal_focus}

Use this deep knowledge in every response. Reference their specific patterns. 
Never give generic advice — this user has seen it and it didn't work.
`
```

---

## 3. PUBLIC API (Platform Play)

```typescript
// REST API for third-party developers
// Documentation: api.lifeos.app
// Authentication: API key (per-user, generated in Settings)

// Available endpoints (user-consented data only):

GET  /v1/me                    // Current user profile
GET  /v1/me/checkins           // Recent check-ins
GET  /v1/me/score              // Current life score
GET  /v1/me/micro-action/today // Today's AI micro-action
POST /v1/me/checkins           // Submit a check-in
GET  /v1/me/insights           // Pattern insights

// Use cases third-party devs build:
// - iOS Shortcuts: "Log my mood" shortcut → POST /v1/me/checkins
// - Raycast extension: see life score in menu bar
// - Obsidian plugin: sync check-ins to daily notes
// - Zapier integration: trigger actions from life score changes
// - Garmin/Fitbit: submit health data from non-supported devices

// Rate limiting:
// Free tier: 100 requests/day
// Pro tier: 1,000 requests/day
// Developer tier: 10,000 requests/day ($29/month)
```

```sql
-- Migration 022: API Keys
CREATE TABLE public.api_keys (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  key_hash    TEXT NOT NULL UNIQUE,     -- bcrypt hash of the actual key
  key_prefix  TEXT NOT NULL,            -- first 8 chars for display: "lo_abc123..."
  name        TEXT,                     -- user-given label
  last_used_at TIMESTAMPTZ,
  requests_today INTEGER DEFAULT 0,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own API keys" ON public.api_keys
  FOR ALL USING (auth.uid() = user_id);
```

---

## 4. INTERNATIONAL EXPANSION

### Languages to add in Phase 5:
```
German (DE):   Germany, Austria, Switzerland — large wellness market
Japanese (JA): Japan — huge wellness app market, high ARPU
Portuguese is already done in Phase 3 (Brazil)
French is already done in Phase 3
```

### Localization beyond translation:
```typescript
// Currency formatting per locale
const formatCurrency = (amount: number, locale: string) => {
  const currencyMap = {
    'en': { currency: 'USD', locale: 'en-US' },
    'es': { currency: 'USD', locale: 'es-US' },  // US Hispanic market
    'pt': { currency: 'BRL', locale: 'pt-BR' },
    'fr': { currency: 'EUR', locale: 'fr-FR' },
    'de': { currency: 'EUR', locale: 'de-DE' },
    'ja': { currency: 'JPY', locale: 'ja-JP' },
  }
  const { currency, locale: loc } = currencyMap[locale] ?? currencyMap['en']
  return new Intl.NumberFormat(loc, { style: 'currency', currency }).format(amount)
}

// Regional wellness context in AI prompts
const regionalContext = {
  'ja': 'This user is in Japan. Be aware of karoshi (death by overwork) culture. Reference relevant Japanese wellness concepts when appropriate.',
  'de': 'This user is in Germany. Work-life balance regulations are strong. Reference Feierabend culture.',
  'pt': 'This user is in Brazil. Consider high-context communication style and family-oriented culture.',
}
```

### Stripe regional pricing:
```
USD: $19/month  (US, Canada, Latin America)
EUR: €17/month  (Europe)
BRL: R$49/month (Brazil — local pricing)
JPY: ¥2,200/month (Japan — local pricing)
```

---

## 5. LIFEOS FOR TEENS (Ages 13-17)

### Legal requirements:
- COPPA compliance (US): parental consent for under 13
- GDPR-K compliance (EU): parental consent for under 16
- Age verification on signup
- Parental dashboard with consent + monitoring
- No financial tracking for minors

```sql
-- Migration 023: Teen Accounts
CREATE TABLE public.guardian_relationships (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guardian_id   UUID REFERENCES public.profiles(id),
  teen_id       UUID REFERENCES public.profiles(id),
  consent_given BOOLEAN DEFAULT false,
  consent_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (guardian_id, teen_id)
);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS birth_year SMALLINT,
  ADD COLUMN IF NOT EXISTS is_minor   BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS guardian_consent BOOLEAN DEFAULT false;

-- Teen-safe features only:
-- ✅ Check-in (mood, sleep, energy, stress — NO finance stress)
-- ✅ AI Coach (teen-appropriate prompts, no financial advice)
-- ✅ Music (all categories)
-- ✅ Sleep tracker
-- ✅ Squad (school friends only, parent can see member list)
-- ✅ Purpose/goals
-- ❌ Finance tracker
-- ❌ Coaching marketplace
-- ❌ Bank sync
```

### Teen pricing:
```
Family plan: $24/month (1 adult Pro + up to 3 teens)
```

---

## 6. SOC 2 TYPE II COMPLIANCE

### What SOC 2 requires:
```
Trust Service Criteria:
✅ Security — encryption, access control, vulnerability management
✅ Availability — uptime SLA, incident response
✅ Confidentiality — data classification, NDA, retention
✅ Privacy — GDPR, CCPA compliance

Implementation checklist:
□ Audit logging for all admin actions
□ Encryption at rest (Supabase: AES-256 default ✅)
□ Encryption in transit (TLS 1.3 ✅)
□ MFA required for all internal admin access
□ Annual penetration testing
□ Incident response plan (written)
□ Vendor security reviews (Supabase, Resend, Stripe, Anthropic)
□ Employee background checks
□ Security awareness training
```

```sql
-- Migration 024: Audit Log
CREATE TABLE public.audit_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id    UUID,           -- who did the action (user or system)
  action      TEXT NOT NULL,  -- 'data.export', 'account.delete', 'admin.view_users'
  resource    TEXT,           -- what was acted on
  resource_id TEXT,
  metadata    JSONB,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Immutable: no UPDATE or DELETE policies
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
-- Only service role can write; admins can read
CREATE POLICY "Admins can read audit log" ON public.audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Audit trigger function
CREATE OR REPLACE FUNCTION public.audit_action(
  action TEXT, resource TEXT, resource_id TEXT, metadata JSONB DEFAULT '{}'
)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  INSERT INTO public.audit_log (actor_id, action, resource, resource_id, metadata)
  VALUES (auth.uid(), action, resource, resource_id, metadata);
$$;
```

---

## 7. HARDWARE PARTNERSHIP PROGRAM

### Concept:
- License LifeOS software + AI to wearable manufacturers
- They white-label it for their device ecosystem
- LifeOS gets per-device royalty ($2-5/device/year)

### Target partners:
```
Garmin:   100M+ devices, no strong wellness OS platform
Fitbit:   Google health push — need differentiation
WHOOP:    Already analytics-focused — natural integration partner
Oura:     Sleep-focused — LifeOS adds the life OS layer
```

### Technical deliverables for partnership:
```
- LifeOS SDK (React Native + native): plug into any hardware app
- White-label design system: swap LifeOS brand for partner brand
- Data ingestion API: partner sends biometrics → LifeOS AI → insights back
- Revenue share model: 70/30 (partner/LifeOS) on subscriptions sold via their platform
```

---

## 8. BUILD SPRINTS

### Sprint 17 (Week 33-36): Enterprise SSO + API
```
1. WorkOS integration (SAML + OIDC)
2. SCIM directory sync
3. Enterprise plan in Stripe (custom pricing)
4. Public API v1 (key management + endpoints)
5. API documentation site (api.lifeos.app)
6. Rate limiting middleware
7. Audit logging for all sensitive actions
```

### Sprint 18 (Week 37-40): AI Personalization Engine
```
1. PersonalizationProfile schema + builder function
2. Weekly profile rebuild pg_cron job
3. Inject profile into all AI prompts
4. A/B test personalized vs generic micro-actions (measure completion rate)
5. Personalization quality dashboard (internal)
6. User-facing "Your AI knows you" insights page
```

### Sprint 19 (Week 41-44): International + Teens
```
1. German translation (DE)
2. Japanese translation (JA)
3. Regional pricing in Stripe
4. Teen account flow + guardian dashboard
5. COPPA/GDPR-K compliance review
6. Family plan pricing
7. Marketing page for teen/family segment
```

### Sprint 20 (Week 45-48): SOC 2 + Scale + Enterprise Launch
```
1. Audit logging on all sensitive operations
2. MFA enforcement for admin roles
3. Penetration test (hire third-party firm)
4. Incident response runbook
5. SOC 2 audit engagement (Vanta or Drata for automation)
6. Enterprise sales deck + security questionnaire template
7. Hardware partnership deck
8. $5M ARR dashboard + investor update
```

---

## 9. $5M ARR BREAKDOWN

```
Individual Pro:
  US/CA/LATAM: 8,000 users × $19/mo × 12    = $1,824,000
  Europe (EUR): 1,500 users × €17/mo × 12   = $306,000
  Brazil (BRL): 2,000 users × R$49/mo × 12  = $141,120
  Japan (JPY):  1,000 users × ¥2,200/mo × 12 = $190,000

B2B Teams:
  SMB (10-199 seats): 30 companies avg 40 seats × $10 × 12 = $144,000
  Enterprise (200+): 5 contracts avg 300 seats × $12 × 12  = $216,000

Coaching Marketplace:
  200 sessions/month × $79 × 0.20 commission × 12          = $37,920

API Developer Tier:
  500 developers × $29/month × 12                           = $174,000

Family Plans:
  1,000 families × $24/month × 12                           = $288,000

Hardware Royalties (Year 1 of partnership):
  500,000 devices × $2/device/year                          = $1,000,000
─────────────────────────────────────────────────────────────
TOTAL ARR: ~$4,321,040

+ Lifetime Deals (one-time): 500 × $249                     = $124,500
TOTAL YEAR: ~$4,445,540

Growth target with new customer acquisition: $5M+ ✅
```

---

## 10. KEY COMMANDS

```bash
# New Phase 5 dependencies
npm install @workos-inc/node    # Enterprise SSO
npm install vanta               # SOC 2 automation
npm install i18next react-i18next  # If not already installed

# WorkOS setup
# 1. Create account at workos.com
# 2. Add your domain in WorkOS dashboard
# 3. Configure SAML for each enterprise customer

# New Edge Functions
supabase functions deploy sso-redirect
supabase functions deploy sso-callback
supabase functions deploy scim-webhook
supabase functions deploy api-gateway
supabase functions deploy build-personalization-profile
supabase functions deploy build-personalization-batch
supabase functions deploy audit-logger

# New secrets
supabase secrets set WORKOS_API_KEY=sk_...
supabase secrets set WORKOS_CLIENT_ID=client_...
supabase secrets set DAILY_API_KEY=...    # Video rooms for coaching
supabase secrets set VANTA_API_KEY=...    # SOC 2 automation

# Enable pg_cron for personalization (weekly)
-- In SQL Editor:
SELECT cron.schedule('build-profiles', '0 6 * * 0',
  $$SELECT net.http_post('https://PROJECT.supabase.co/functions/v1/build-personalization-batch')$$
);
```

---

## 11. WHAT COMES AFTER PHASE 5

```
Phase 6 (if needed):
- LifeOS AI model (proprietary — trained on anonymized, consented data)
- Acquisition target positioning (health + wellness tech M&A is active)
- IPO readiness (SOC 2 Type II in hand, $5M+ ARR, growing MoM)
- LifeOS Foundation (non-profit arm for mental health access in underserved communities)
- B2G (government): employee wellness for public sector
```

---

*End of Phase 5 Handoff — LifeOS · Built with purpose in South Florida · 2026*
