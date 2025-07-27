-- Script to add wedding guests to the database
-- Replace the example emails with your actual guest list

-- Add your guests here
-- Format: (email, name, is_admin)
-- Set is_admin to false for all guests (only you and Yishan should be admins)

INSERT INTO public.guests (email, name, is_admin) VALUES 
    -- Example guests (replace with your actual guest list)
    ('guest1@example.com', 'Guest One Name', false),
    ('guest2@example.com', 'Guest Two Name', false),
    ('guest3@example.com', 'Guest Three Name', false),
    ('guest4@example.com', 'Guest Four Name', false),
    ('guest5@example.com', 'Guest Five Name', false)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = now();

-- The ON CONFLICT clause ensures that if an email already exists,
-- it will update the name instead of creating a duplicate 