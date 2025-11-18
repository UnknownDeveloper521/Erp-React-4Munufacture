-- Script to set up an admin user
-- Run this after you've registered your first user through the signup page

-- First, find your user ID from the auth.users table
-- SELECT id, email FROM auth.users;

-- Then update the user_profiles table to make them an admin
-- Replace 'your-user-id-here' with the actual UUID from auth.users
-- Replace 'your-email@example.com' with your actual email

-- Example (replace with your actual values):
-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE id = 'your-user-id-here';

-- Or you can use email to find and update:
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'your-email@example.com'  -- Replace with your email
);

-- Verify the update worked:
SELECT 
    up.id,
    up.first_name,
    up.last_name,
    up.role,
    au.email
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE up.role = 'admin';

-- Optional: Create some sample departments if they don't exist
INSERT INTO departments (name, description) VALUES
    ('Administration', 'System administration and management'),
    ('Executive', 'Executive leadership and management')
ON CONFLICT (name) DO NOTHING;
