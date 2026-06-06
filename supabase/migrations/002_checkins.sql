-- Daily check-ins
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood SMALLINT CHECK (mood BETWEEN 1 AND 10),
  stress SMALLINT CHECK (stress BETWEEN 1 AND 10),
  sleep_quality SMALLINT CHECK (sleep_quality BETWEEN 1 AND 10),
  sleep_hours NUMERIC(4,1) CHECK (sleep_hours BETWEEN 0 AND 24),
  energy SMALLINT CHECK (energy BETWEEN 1 AND 10),
  finance_stress SMALLINT CHECK (finance_stress BETWEEN 1 AND 10),
  purpose SMALLINT CHECK (purpose BETWEEN 1 AND 10),
  squad SMALLINT CHECK (squad BETWEEN 1 AND 10),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date)
);

CREATE INDEX checkins_user_date ON public.checkins (user_id, date DESC);

ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own checkins"
  ON public.checkins FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER checkins_updated_at
  BEFORE UPDATE ON public.checkins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
