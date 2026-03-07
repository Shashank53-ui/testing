-- Allow the anon role to update companies (needed for syncAll.ts to update active_jobs_count)
-- Run this in Supabase SQL editor if the companies table has RLS enabled

-- Option A: Disable RLS on companies entirely (simplest)
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- Option B (alternative): Keep RLS on but allow anon to update
-- ALTER POLICY IF EXISTS "allow_anon_update_companies" ON public.companies;
-- CREATE POLICY "allow_anon_update_companies" ON public.companies FOR UPDATE TO anon USING (true) WITH CHECK (true);
