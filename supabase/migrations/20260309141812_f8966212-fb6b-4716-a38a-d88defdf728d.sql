CREATE TABLE public.abandoned_checkouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_order_id text,
  plan text NOT NULL,
  amount integer NOT NULL,
  email text,
  phone text,
  failure_reason text,
  failure_code text,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'failed'
);

ALTER TABLE public.abandoned_checkouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on abandoned_checkouts"
ON public.abandoned_checkouts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);