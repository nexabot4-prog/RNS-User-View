-- Enable UUID extension (Required for gen_random_uuid())
create extension if not exists "pgcrypto";

-- Enable RLS
alter table public.projects enable row level security;

-- Drop policy if it exists to avoid conflicts/errors on re-run
drop policy if exists "Allow public read access" on public.projects;

-- Create policy to allow public read access
create policy "Allow public read access"
  on public.projects
  for select
  to public
  using (true);

-- Seed some sample data matched to REAL Schema
insert into public.projects (
  id, 
  title, 
  description, 
  image_url, 
  features, 
  status, 
  start_date, 
  end_date, 
  category
)
select 
  gen_random_uuid(),
  'Autonomous Delivery Robot', 
  'A self-driving robot capable of navigating complex environments to deliver packages.', 
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000', 
  ARRAY['LiDAR Navigation', 'Obstacle Avoidance', 'Payload Capacity: 10kg'],
  'completed',
  CURRENT_DATE - 30,
  CURRENT_DATE,
  'Robotics'
where not exists (select 1 from public.projects limit 1);

insert into public.projects (
  id, 
  title, 
  description, 
  image_url, 
  features, 
  status, 
  start_date, 
  end_date, 
  category
)
select 
  gen_random_uuid(),
  'Smart Home Automation', 
  'IoT-based system for controlling home appliances via voice and mobile app.', 
  'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=1000', 
  ARRAY['Voice Control', 'Energy Monitoring', 'Remote Access'],
  'completed',
  CURRENT_DATE - 60,
  CURRENT_DATE - 10,
  'IoT'
where not exists (select 1 from public.projects limit 1);

insert into public.projects (
  id, 
  title, 
  description, 
  image_url, 
  features, 
  status, 
  start_date, 
  end_date, 
  category
)
select 
  gen_random_uuid(),
  'Drone Surveillance System', 
  'Long-range drone system for aerial surveillance and monitoring.', 
  'https://images.unsplash.com/photo-1508614589041-895b8c9d7ef5?auto=format&fit=crop&q=80&w=1000', 
  ARRAY['4K Camera', '30min Flight Time', 'GPS Tracking'],
  'completed',
  CURRENT_DATE - 90,
  CURRENT_DATE - 20,
  'Drone'
where not exists (select 1 from public.projects limit 1);
