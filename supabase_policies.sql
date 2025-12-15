-- RUN THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR

-- 1. Create the bucket 'customer-files' (if it doesn't exist)
insert into storage.buckets (id, name, public)
values ('customer-files', 'customer-files', true)
on conflict (id) do update set public = true;

-- 2. Remove any conflicting policies
drop policy if exists "Public Uploads" on storage.objects;
drop policy if exists "Public Select" on storage.objects;
drop policy if exists "Public Update" on storage.objects;

-- 3. ALLOW EVERYTHING FOR 'customer-files' (Easiest for testing)
-- Allows public to Upload (Connects to your RLS error)
create policy "Public Uploads"
on storage.objects for insert
to public
with check ( bucket_id = 'customer-files' );

-- Allows public to View/Download
create policy "Public Select"
on storage.objects for select
to public
using ( bucket_id = 'customer-files' );

-- Allows public to Update (optional)
create policy "Public Update"
on storage.objects for update
to public
using ( bucket_id = 'customer-files' );
