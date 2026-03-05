
-- Create enums
CREATE TYPE public.invitation_status AS ENUM ('draft', 'published');
CREATE TYPE public.invitation_plan AS ENUM ('basic', 'premium', 'elite');
CREATE TYPE public.invitation_language AS ENUM ('english', 'hindi', 'tamil', 'punjabi', 'urdu');
CREATE TYPE public.event_type AS ENUM ('mehndi', 'haldi', 'sangeet', 'baraat', 'ceremony', 'reception');
CREATE TYPE public.meal_preference AS ENUM ('veg', 'non_veg', 'jain', 'no_preference');
CREATE TYPE public.payment_status AS ENUM ('pending', 'success', 'failed');

-- Create invitations table
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id TEXT NOT NULL,
  slug TEXT UNIQUE,
  status public.invitation_status NOT NULL DEFAULT 'draft',
  plan public.invitation_plan,
  bride_name TEXT,
  groom_name TEXT,
  bride_family TEXT,
  groom_family TEXT,
  wedding_date DATE,
  personal_message TEXT,
  photo_url TEXT,
  language public.invitation_language NOT NULL DEFAULT 'english',
  upi_id TEXT,
  gift_registry_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invitations"
  ON public.invitations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invitations"
  ON public.invitations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invitations"
  ON public.invitations FOR DELETE
  USING (auth.uid() = user_id);

-- Public read for published invitations (guests need to see them)
CREATE POLICY "Anyone can view published invitations"
  ON public.invitations FOR SELECT
  USING (status = 'published');

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  event_type public.event_type NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE,
  event_time TIME,
  venue_name TEXT,
  venue_address TEXT,
  maps_url TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage events via invitation ownership"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = events.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view events of published invitations"
  ON public.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = events.invitation_id
      AND invitations.status = 'published'
    )
  );

-- Create RSVPs table
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  meal_preference public.meal_preference NOT NULL DEFAULT 'no_preference',
  note TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit RSVP to published invitation"
  ON public.rsvps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = rsvps.invitation_id
      AND invitations.status = 'published'
    )
  );

CREATE POLICY "Invitation owner can view RSVPs"
  ON public.rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = rsvps.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL,
  plan public.invitation_plan NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments"
  ON public.payments FOR UPDATE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for couple photos
INSERT INTO storage.buckets (id, name, public) VALUES ('couple-photos', 'couple-photos', true);

CREATE POLICY "Users can upload couple photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'couple-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own couple photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'couple-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own couple photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'couple-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Couple photos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'couple-photos');
