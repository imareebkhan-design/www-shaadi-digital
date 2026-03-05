
-- Create a public bucket for background music tracks
INSERT INTO storage.buckets (id, name, public)
VALUES ('music-tracks', 'music-tracks', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to music tracks
CREATE POLICY "Public can read music tracks"
ON storage.objects FOR SELECT
USING (bucket_id = 'music-tracks');

-- Allow authenticated users to upload music tracks
CREATE POLICY "Authenticated users can upload music"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'music-tracks');
