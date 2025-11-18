-- Check Current Database Structure
-- Run this to see what you currently have

-- 1. Check if master tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('departments', 'positions', 'employee_types', 'employment_status', 'work_locations', 'shift_types') 
        THEN 'MASTER_TABLE'
        ELSE 'OTHER'
    END as table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_type, table_name;

-- 2. Check employees table structure
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'employees' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if we have employment_status table
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'employment_status' 
            AND table_schema = 'public'
        ) THEN 'employment_status table EXISTS'
        ELSE 'employment_status table MISSING - Need to run master-tables-schema.sql'
    END as status_table_check;

-- 4. Check current employees data structure
SELECT 
    COUNT(*) as total_employees,
    COUNT(CASE WHEN employment_status_id IS NOT NULL THEN 1 END) as with_employment_status_id,
    COUNT(CASE WHEN status IS NOT NULL THEN 1 END) as with_old_status_column
FROM employees;

-- 5. If old status column exists, show the values
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' 
        AND column_name = 'status' 
        AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'Old status column found. Current status values:';
        -- This will show in the logs
    END IF;
END $$;

-- Show status values if old column exists
SELECT 
    status,
    COUNT(*) as count
FROM employees 
WHERE status IS NOT NULL
GROUP BY status;
