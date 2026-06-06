-- AI-generated micro actions
CREATE TABLE IF NOT EXISTS public.micro_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checkin_id UUID REFERENCES public.checkins(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  action_text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mindfulness', 'movement', 'sleep', 'finance', 'social', 'purpose', 'nutrition')),
  duration_mins SMALLINT CHECK (duration_mins BETWEEN 1 AND 60),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX micro_actions_user_date ON public.micro_actions (user_id, date DESC);

ALTER TABLE public.micro_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own micro_actions"
  ON public.micro_actions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
