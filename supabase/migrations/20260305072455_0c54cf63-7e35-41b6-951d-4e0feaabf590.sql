
ALTER TABLE public.users ALTER COLUMN mobile DROP NOT NULL;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_mobile_key;
