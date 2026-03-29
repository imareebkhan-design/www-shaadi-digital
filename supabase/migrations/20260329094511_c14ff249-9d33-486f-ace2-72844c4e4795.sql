
-- Fix security definer view - use security_invoker
ALTER VIEW public.public_invitations SET (security_invoker = on);
