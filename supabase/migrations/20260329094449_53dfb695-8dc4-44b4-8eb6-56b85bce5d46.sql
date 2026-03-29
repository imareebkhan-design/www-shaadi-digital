
-- 1. Drop payments UPDATE policy (payments should be immutable from client)
DROP POLICY IF EXISTS "Users can update own payments" ON public.payments;

-- 2. Drop music bucket open upload policy
DROP POLICY IF EXISTS "Authenticated users can upload music" ON storage.objects;

-- 3. Create a secure RPC to publish invitations (only after verifying payment)
CREATE OR REPLACE FUNCTION public.publish_invitation(
  _invitation_id uuid,
  _plan text,
  _slug text,
  _razorpay_order_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the invitation belongs to the calling user
  IF NOT EXISTS (
    SELECT 1 FROM invitations
    WHERE id = _invitation_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Verify a successful payment exists for this order
  IF NOT EXISTS (
    SELECT 1 FROM payments
    WHERE razorpay_order_id = _razorpay_order_id
      AND status = 'success'
  ) THEN
    RAISE EXCEPTION 'No verified payment found for this order';
  END IF;

  -- Publish the invitation
  UPDATE invitations
  SET status = 'published', plan = _plan::invitation_plan, slug = _slug
  WHERE id = _invitation_id AND user_id = auth.uid();
END;
$$;

-- 4. Restrict the invitations UPDATE policy to exclude status and plan columns
DROP POLICY IF EXISTS "Users can update own invitations" ON public.invitations;

CREATE POLICY "Users can update own invitations"
ON public.invitations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND status = 'draft'
);

-- 5. Create a public view excluding sensitive columns
CREATE OR REPLACE VIEW public.public_invitations AS
SELECT
  id, slug, bride_name, groom_name, bride_full_name, groom_full_name,
  bride_family, groom_family, bride_bio, groom_bio,
  template_id, status, wedding_date, wedding_city, language,
  photo_url, hero_media_type, hero_media_url, music_url,
  personal_message, our_story, gallery_photos,
  dresscode_enabled, dresscode_text, dresscode_colors,
  gift_registry_url, venue_description, venue_photo,
  rsvp_deadline, created_at, updated_at
FROM invitations
WHERE status = 'published';
