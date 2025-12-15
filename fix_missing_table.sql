-- FIX FOR "relation public.order_items does not exist"
-- Run this in Supabase SQL Editor

-- 1. Ensure 'orders' table exists (if not already)
create table if not exists public.orders (
  id uuid not null default gen_random_uuid(),
  project_id uuid null, -- Can be null for custom orders
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
  file_url text null,
  user_id uuid null,
  user_email text null,
  created_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  primary key (id)
);

-- 2. CREATE THE MISSING 'order_items' TABLE
-- It seems your database or a trigger expects this table to exist.
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

-- 3. Grant Permissions
grant all on public.order_items to anon, authenticated;
grant all on public.orders to anon, authenticated;

-- 4. Enable RLS (Optional but recommended)
alter table public.order_items enable row level security;

create policy "Enable access to order_items"
on public.order_items for all
to public
using (true)
with check (true);
