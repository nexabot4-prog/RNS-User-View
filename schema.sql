-- Create projects table
create table public.projects (
  id uuid not null,
  title text not null,
  description text null,
  status text not null,
  priority text null,
  budget numeric(15, 2) null default 0,
  spent numeric(15, 2) null default 0,
  start_date date not null,
  end_date date not null,
  actual_end_date date null,
  created_by uuid null,
  archived_at timestamp without time zone null,
  created_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  image_url text null,
  features text[] null,
  components text[] null,
  block_diagram_url text null,
  working_principle text null,
  applications text[] null,
  deliverables text[] null,
  tech_specs jsonb null,
  demo_video_url text null,
  packages jsonb null,
  project_images jsonb null,
  block_diagrams jsonb null,
  project_documents jsonb null,
  constraint projects_pkey primary key (id),
  constraint projects_created_by_fkey foreign KEY (created_by) references users (id) on update CASCADE on delete set null
) TABLESPACE pg_default;

-- Create orders table
create table public.orders (
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
  file_url text null,
  user_id uuid null,
  user_email text null,
  created_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  constraint orders_pkey primary key (id),
  constraint orders_project_id_fkey foreign KEY (project_id) references projects (id) on delete cascade
) TABLESPACE pg_default;

-- STORAGE BUCKET SETUP (Run this in SQL Editor if bucket doesn't exist)
-- insert into storage.buckets (id, name, public) values ('customer-files', 'customer-files', true);

-- Storage Policies
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'customer-files' );
-- create policy "Public Upload" on storage.objects for insert with check ( bucket_id = 'customer-files' );

-- Grant necessary permissions to the anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.orders TO anon, authenticated;

-- Enable RLS
alter table public.orders enable row level security;

-- Create policy to allow anyone to create orders
drop policy if exists "Enable insert for all users" on public.orders;
create policy "Enable insert for all users"
on public.orders
for insert
to public
with check (true);

-- Create policy to allow users to view their own orders (by email or user_id)
drop policy if exists "Enable select for users based on email or user_id" on public.orders;
create policy "Enable select for users based on email or user_id"
on public.orders
for select
to public
using (
  (auth.uid() = user_id) or 
  (auth.jwt() ->> 'email' = user_email)
);
