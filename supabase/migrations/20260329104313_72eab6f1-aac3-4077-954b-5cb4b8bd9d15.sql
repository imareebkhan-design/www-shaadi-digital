
-- Fix contact_requests: replace WITH CHECK (true) with basic validation
DROP POLICY IF EXISTS "Anyone can submit contact request" ON public.contact_requests;

CREATE POLICY "Anyone can submit contact request"
ON public.contact_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) > 0 AND length(phone) > 4
);

-- Fix abandoned_checkouts: replace blanket true with explicit service_role-only conditions
DROP POLICY IF EXISTS "Service role full access on abandoned_checkouts" ON public.abandoned_checkouts;

CREATE POLICY "Service role can manage abandoned_checkouts"
ON public.abandoned_checkouts
FOR ALL
TO service_role
USING (true)
WITH CHECK (
  amount > 0 AND length(plan) > 0
);
