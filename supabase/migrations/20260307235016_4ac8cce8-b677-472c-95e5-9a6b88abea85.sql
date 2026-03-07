
-- Add new columns to invitations table
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS bride_full_name text,
  ADD COLUMN IF NOT EXISTS groom_full_name text,
  ADD COLUMN IF NOT EXISTS bride_bio text,
  ADD COLUMN IF NOT EXISTS groom_bio text,
  ADD COLUMN IF NOT EXISTS wedding_city text,
  ADD COLUMN IF NOT EXISTS venue_description text,
  ADD COLUMN IF NOT EXISTS venue_photo text,
  ADD COLUMN IF NOT EXISTS rsvp_deadline text,
  ADD COLUMN IF NOT EXISTS hero_media_type text DEFAULT 'photo',
  ADD COLUMN IF NOT EXISTS hero_media_url text;

-- Add new columns to events table
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS event_photo text;
