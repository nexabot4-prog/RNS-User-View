UPDATE public.projects 
SET budget = '{"min": 12000, "max": 15000}'::jsonb 
WHERE title = 'Autonomous Delivery Robot';

UPDATE public.projects 
SET budget = '{"min": 5000, "max": 8000}'::jsonb 
WHERE title = 'Smart Home Automation';

UPDATE public.projects 
SET budget = '{"min": 20000, "max": 25000}'::jsonb 
WHERE title = 'Drone Surveillance System';
