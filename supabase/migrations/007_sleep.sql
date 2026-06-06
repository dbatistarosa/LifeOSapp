-- Sleep records
CREATE TABLE IF NOT EXISTS public.sleep_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_hours NUMERIC(4,1) CHECK (total_hours BETWEEN 0 AND 24),
  quality SMALLINT CHECK (quality BETWEEN 1 AND 10),
  bedtime TIME,
  wake_time TIME,
  deep_pct SMALLINT DEFAULT 20,
  rem_pct SMALLINT DEFAULT 25,
  light_pct SMALLINT DEFAULT 45,
  awake_pct SMALLINT DEFAULT 10,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'apple_health', 'galaxy_watch', 'wear_os', 'fitbit')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date)
);

CREATE INDEX sleep_records_user_date ON public.sleep_records (user_id, date DESC);

ALTER TABLE public.sleep_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sleep_records"
  ON public.sleep_records FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Sleep goals
CREATE TABLE IF NOT EXISTS public.sleep_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  target_hours NUMERIC(3,1) DEFAULT 7.5,
  target_bedtime TIME DEFAULT '23:00',
  target_wake_time TIME DEFAULT '07:00',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sleep_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sleep_goals"
  ON public.sleep_goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
