-- Music tracks
CREATE TABLE IF NOT EXISTS public.music_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  category TEXT CHECK (category IN ('Focus', 'Relax', 'Sleep', 'Nature', 'Energy', 'Meditation')),
  duration_secs INTEGER,
  storage_path TEXT,
  thumbnail_path TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User listening history
CREATE TABLE IF NOT EXISTS public.listening_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES public.music_tracks(id) ON DELETE CASCADE NOT NULL,
  played_at TIMESTAMPTZ DEFAULT NOW(),
  duration_secs INTEGER,
  checkin_mood SMALLINT,
  checkin_stress SMALLINT
);

CREATE INDEX listening_history_user ON public.listening_history (user_id, played_at DESC);

-- User playlists
CREATE TABLE IF NOT EXISTS public.user_playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  track_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read tracks"
  ON public.music_tracks FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY "Users can manage own history"
  ON public.listening_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own playlists"
  ON public.user_playlists FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
