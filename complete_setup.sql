-- ==============================================================================
-- MASTER SETUP SCRIPT (UPDATED)
-- Run this ENTIRE script in the Supabase SQL Editor.
-- It fixes:
-- 1. "Relation public.order_items does not exist"
-- 2. "New row violates row-level security policy" (File Uploads)
-- 3. Missing 'customer-files' bucket
-- 4. "Could not find the 'file_url' column" (Schema Cache Error)
-- ==============================================================================

-- PART 1: TABLES
-- Ensure 'orders' table exists with strict column checks
create table if not exists public.orders (
  id uuid not null default gen_random_uuid(),
  project_id uuid null,
  project_title text not null,
  price numeric(15, 2) null,
  status text not null default 'pending',
  customer_name text not null,
  phone_number text not null,
  college_name text null,
  is_custom boolean default false,
  custom_abstract text null,
  custom_deadline date null,
  custom_requirements text null,
  custom_features text null,
  -- file_url text null, -- Handled below to be safe
  user_id uuid null,
  user_email text null,
  created_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  primary key (id)
);

-- Force add 'file_url' if it was missing from the original table creation
alter table public.orders add column if not exists file_url text;

-- Ensure 'order_items' table exists (Fixes error 42P01)
create table if not exists public.order_items (
  id uuid not null default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  project_id uuid null references public.projects(id),
  item_name text,
  quantity integer default 1,
  price numeric(15, 2) default 0,
  created_at timestamp without time zone default now(),
  primary key (id)
);

-- Grant permissions on tables
grant all on public.orders to anon, authenticated;
grant all on public.order_items to anon, authenticated;

-- PART 2: STORAGE BUCKET
-- Create 'customer-files' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('customer-files', 'customer-files', true)
on conflict (id) do update set public = true;

-- PART 3: RLS POLICIES FOR STORAGE
-- Enable public uploads/downloads for valid file handling
drop policy if exists "Public Uploads" on storage.objects;
drop policy if exists "Public Select" on storage.objects;
drop policy if exists "Public Update" on storage.objects;

create policy "Public Uploads"
on storage.objects for insert
to public
with check ( bucket_id = 'customer-files' );

create policy "Public Select"
on storage.objects for select
to public
using ( bucket_id = 'customer-files' );

create policy "Public Update"
on storage.objects for update
to public
using ( bucket_id = 'customer-files' );

-- PART 4: RLS POLICIES FOR TABLES (Optional but good for access)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Allow insert on orders
drop policy if exists "Allow public insert orders" on public.orders;
create policy "Allow public insert orders" on public.orders for insert to public with check (true);

-- Allow select on orders (basic)
drop policy if exists "Allow public select orders" on public.orders;
create policy "Allow public select orders" on public.orders for select to public using (true);

-- PART 5: REFRESH SCHEMA CACHE
-- Sometimes required by Supabase to see new columns immediately
notify pgrst, 'reload config';
