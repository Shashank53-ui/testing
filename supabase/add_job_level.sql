-- Add level column to jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT NULL;

-- Index for filtering by level
CREATE INDEX IF NOT EXISTS idx_jobs_level ON public.jobs(level);

NOTIFY pgrst, 'reload schema';
