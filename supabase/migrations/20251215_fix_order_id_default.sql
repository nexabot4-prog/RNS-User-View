-- Fix for "id uuid not null" error
-- This makes the database automatically generate an ID if one isn't provided.

ALTER TABLE public.orders 
ALTER COLUMN id SET DEFAULT gen_random_uuid();
