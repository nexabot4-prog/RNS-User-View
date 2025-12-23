-- =========================================================
-- MASTER FIXES & SETUP SCRIPT
-- =========================================================

-- 1. REVIEWS TABLE & RLS SETUP
-- ============================
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) NOT NULL,
  user_name text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Clean up old policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Select" ON public.reviews;
DROP POLICY IF EXISTS "Public Insert" ON public.reviews;

-- Create comprehensive policies
CREATE POLICY "Public Select" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Insert" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.reviews TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;


-- 2. PROJECTS SCHEMA UPDATES (PACKAGES)
-- =====================================
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS packages JSONB DEFAULT '[]'::jsonb;


-- 3. DATA REPAIRS & POPULATION
-- ============================

-- Repair "Line Following Robot" Packages
UPDATE public.projects
SET packages = '[
    {
        "name": "Basic Component Kit",
        "price": 2000,
        "description": "Essential components for building the Line Follower. Assembly required.",
        "features": ["Chassis", "DC Motors", "IR Sensors", "L298N Driver", "Arduino Uno"]
    },
    {
        "name": "Pro Assembled Kit",
        "price": 3000,
        "description": "Pre-assembled robot with Obstacle Avoidance capabilities.",
        "features": ["Everything in Basic", "Ultrasonic Sensor", "Servo Motor", "Rechargeable Battery", "Pre-assembled"]
    }
]'::jsonb
WHERE title ILIKE '%Line Following Robot%' OR title ILIKE '%Obstacle Avoidance%';

-- Ensure other projects have default packages
UPDATE public.projects
SET packages = '[
    {
        "name": "DIY Kit",
        "price": 2000,
        "description": "All components included, assembly required.",
        "features": ["Core Components", "PCB Board", "Instructions"]
    },
    {
        "name": "Assembled Unit",
        "price": 2800,
        "description": "Pre-assembled and tested.",
        "features": ["Ready to Use", "Testing Report"]
    }
]'::jsonb
WHERE packages IS NULL OR packages = '[]'::jsonb;

-- Populate Sample Reviews if none exist
DO $$
DECLARE
    target_project_id UUID;
BEGIN
    SELECT id INTO target_project_id FROM public.projects LIMIT 1;
    IF target_project_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM public.reviews WHERE project_id = target_project_id) THEN
            INSERT INTO public.reviews (project_id, user_name, rating, comment)
            VALUES 
            (target_project_id, 'Sample User', 5, 'System initialized with sample data.');
        END IF;
    END IF;
END $$;
