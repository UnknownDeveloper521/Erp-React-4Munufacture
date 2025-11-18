-- Quick Fix for Current Database Issues
-- Run this in Supabase SQL Editor to fix the relationship errors

-- 1. Add employee_id column to user_profiles if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS employee_id UUID;

-- 2. Add foreign key constraint
ALTER TABLE user_profiles 
ADD CONSTRAINT fk_user_employee 
FOREIGN KEY (employee_id) REFERENCES employees(id);

-- 3. Check if we need to update existing employees table structure
-- First, let's see what columns exist in employees
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'employees' 
AND table_schema = 'public';

-- 4. If the old employees table still has 'status' column, we need to migrate data
-- Check if status column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' 
        AND column_name = 'status' 
        AND table_schema = 'public'
    ) THEN
        -- If status column exists, we need to migrate data
        RAISE NOTICE 'Old status column found. You need to run the full master-tables-schema.sql to migrate.';
        
        -- For now, let's just add the missing columns if they don't exist
        ALTER TABLE employees ADD COLUMN IF NOT EXISTS employment_status_id UUID;
        ALTER TABLE employees ADD COLUMN IF NOT EXISTS department_id UUID;
        ALTER TABLE employees ADD COLUMN IF NOT EXISTS position_id UUID;
        ALTER TABLE employees ADD COLUMN IF NOT EXISTS employee_type_id UUID;
        ALTER TABLE employees ADD COLUMN IF NOT EXISTS work_location_id UUID;
        ALTER TABLE employees ADD COLUMN IF NOT EXISTS shift_type_id UUID;
        ALTER TABLE employees ADD COLUMN IF NOT EXISTS manager_id UUID;
        
    ELSE
        RAISE NOTICE 'New employee table structure detected. No migration needed.';
    END IF;
END $$;

-- 5. Verify the fixes
SELECT 'user_profiles' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
AND column_name = 'employee_id'

UNION ALL

SELECT 'employees' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'employees' 
AND table_schema = 'public'
AND column_name IN ('employment_status_id', 'department_id', 'position_id');
