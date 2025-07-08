-- Create guests table
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_admin BOOLEAN DEFAULT false NOT NULL,
    has_rsvped BOOLEAN DEFAULT false NOT NULL,
    is_attending BOOLEAN,
    dietary_preferences TEXT,
    has_plus_one BOOLEAN DEFAULT false NOT NULL,
    plus_one_name TEXT,
    plus_one_email TEXT,
    plus_one_dietary_preferences TEXT,
    rsvp_completed_at TIMESTAMP WITH TIME ZONE,
    additional_notes TEXT
);

-- Create row level security policies
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own record unless they are admin
CREATE POLICY "Users can view own guest record or admin can view all" ON public.guests
    FOR SELECT USING (
        auth.jwt() ->> 'email' = email OR 
        (
            SELECT is_admin FROM public.guests 
            WHERE email = auth.jwt() ->> 'email'
        ) = true
    );

-- Policy: Users can only update their own record unless they are admin
CREATE POLICY "Users can update own guest record or admin can update all" ON public.guests
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = email OR 
        (
            SELECT is_admin FROM public.guests 
            WHERE email = auth.jwt() ->> 'email'
        ) = true
    );

-- Policy: Only admins can insert new guests
CREATE POLICY "Only admins can insert guests" ON public.guests
    FOR INSERT WITH CHECK (
        (
            SELECT is_admin FROM public.guests 
            WHERE email = auth.jwt() ->> 'email'
        ) = true
    );

-- Insert admin users
INSERT INTO public.guests (email, is_admin) VALUES 
    ('zha.yitong@gmail.com', true),
    ('yishan.zhang007@gmail.com', true);

-- Insert test guest users
INSERT INTO public.guests (email, is_admin) VALUES 
    ('cfeng.charlie@gmail.com', false),
    ('yitong@votegora.com', false);