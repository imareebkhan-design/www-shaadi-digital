
-- Create a public bucket for hero videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-videos',
  'hero-videos',
  true,
  52428800,
  ARRAY['video/mp4','video/webm','video/ogg','video/quicktime','video/x-msvideo','video/x-matroska','video/mpeg']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to hero-videos
CREATE POLICY "Authenticated users can upload hero videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'hero-videos');

-- Allow public read access
CREATE POLICY "Public read access for hero videos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'hero-videos');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own hero videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'hero-videos' AND (auth.uid()::text = (storage.foldername(name))[1]));
