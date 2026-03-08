-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- 1. Create a policy for public READ access
-- This allows anyone (even unauthenticated users visiting your website) to SELECT from these tables
CREATE POLICY "Allow public read access to companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow public read access to jobs" ON public.jobs FOR SELECT USING (true);

-- 2. Create policies for INSERT/UPDATE/DELETE
-- This allows only authenticated service roles (like your sync script using the Service Role Key) to modify data
CREATE POLICY "Allow service role full access to companies" ON public.companies FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access to jobs" ON public.jobs FOR ALL USING (auth.role() = 'service_role');
