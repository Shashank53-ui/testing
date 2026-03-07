-- Create User Applied Jobs Table
CREATE TABLE IF NOT EXISTS public.user_applied_jobs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Row Level Security (RLS) for user_applied_jobs
ALTER TABLE public.user_applied_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read their own applied jobs"
ON public.user_applied_jobs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applied jobs"
ON public.user_applied_jobs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applied jobs"
ON public.user_applied_jobs
FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_applied_jobs_user_id ON public.user_applied_jobs(user_id);

NOTIFY pgrst, 'reload schema';
