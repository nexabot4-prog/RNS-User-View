-- Migration: Add columns for Custom Orders
-- Run this in your Supabase SQL Editor

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS custom_abstract TEXT,
ADD COLUMN IF NOT EXISTS custom_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS custom_requirements TEXT,
ADD COLUMN IF NOT EXISTS custom_features TEXT,
ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Optional: Add comment
COMMENT ON COLUMN public.orders.is_custom IS 'Flag to identify if the order is a custom project request';
