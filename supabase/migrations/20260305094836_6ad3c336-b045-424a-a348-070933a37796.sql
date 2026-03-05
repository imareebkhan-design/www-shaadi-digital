
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS our_story TEXT,
  ADD COLUMN IF NOT EXISTS gallery_photos JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS dresscode_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS dresscode_text TEXT,
  ADD COLUMN IF NOT EXISTS dresscode_colors JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS music_url TEXT;
