-- Allow the anon role to insert/update jobs (needed for syncAll.ts which uses the anon key)
-- Run this in Supabase SQL editor if the jobs table has RLS enabled

-- Option A: Disable RLS on jobs entirely (simplest — jobs are public read-only data)
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;

-- Option B (alternative): Keep RLS on but allow anon to do everything
-- ALTER POLICY IF EXISTS "anon_full_access_jobs" ON public.jobs;
-- CREATE POLICY "anon_full_access_jobs" ON public.jobs FOR ALL TO anon USING (true) WITH CHECK (true);
