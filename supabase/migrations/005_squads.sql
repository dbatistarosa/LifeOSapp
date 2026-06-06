-- Squads
CREATE TABLE IF NOT EXISTS public.squads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  max_members SMALLINT DEFAULT 10,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Squad memberships
CREATE TABLE IF NOT EXISTS public.squad_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  streak SMALLINT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (squad_id, user_id)
);

-- Squad challenges
CREATE TABLE IF NOT EXISTS public.squad_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Squad messages
CREATE TABLE IF NOT EXISTS public.squad_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for squads
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Squad members can view squads"
  ON public.squads FOR SELECT
  USING (
    id IN (SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Squad members can view members"
  ON public.squad_members FOR SELECT
  USING (
    squad_id IN (SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can join squads"
  ON public.squad_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Squad members can view challenges"
  ON public.squad_challenges FOR SELECT
  USING (
    squad_id IN (SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Squad members can view messages"
  ON public.squad_messages FOR SELECT
  USING (
    squad_id IN (SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Squad members can send messages"
  ON public.squad_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    squad_id IN (SELECT squad_id FROM public.squad_members WHERE user_id = auth.uid())
  );
