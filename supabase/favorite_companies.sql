-- Create User Favorite Companies Table
CREATE TABLE IF NOT EXISTS public.user_favorite_companies (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES public.companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, company_id)
);

-- Row Level Security (RLS) for user_favorite_companies
ALTER TABLE public.user_favorite_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read their own favorite companies"
ON public.user_favorite_companies
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite companies"
ON public.user_favorite_companies
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite companies"
ON public.user_favorite_companies
FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_favorite_companies_user_id ON public.user_favorite_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_companies_company_id ON public.user_favorite_companies(company_id);

NOTIFY pgrst, 'reload schema';
