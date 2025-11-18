-- Safe Fix for Database Relationship Issues
-- This script handles orphaned data before creating constraints

-- 1. First, add the employee_id column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS employee_id UUID;

-- 2. Check for orphaned employee_id references and clean them up
UPDATE user_profiles 
SET employee_id = NULL 
WHERE employee_id IS NOT NULL 
AND employee_id NOT IN (SELECT id FROM employees WHERE id IS NOT NULL);

-- 3. Show what we cleaned up
SELECT 
    COUNT(*) as orphaned_records_cleaned,
    'user_profiles with invalid employee_id references' as description
FROM user_profiles 
WHERE employee_id IS NULL;

-- 4. Now safely add the foreign key constraint
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS fk_user_employee;

ALTER TABLE user_profiles 
ADD CONSTRAINT fk_user_employee 
FOREIGN KEY (employee_id) REFERENCES employees(id);

-- 5. Check current employees table structure
SELECT 
    'employees' as table_name,
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'employees' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Check if we have the old 'status' column
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'employees' 
            AND column_name = 'status' 
            AND table_schema = 'public'
        ) THEN 'OLD_STRUCTURE - Has status column. Need to run master-tables-schema.sql'
        ELSE 'NEW_STRUCTURE - Ready for master tables'
    END as employees_table_status;

-- 7. Add missing columns to employees table if they don't exist (for old structure)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS employment_status_id UUID;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS position_id UUID;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS employee_type_id UUID;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS work_location_id UUID;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS shift_type_id UUID;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS manager_id UUID;

-- 8. If you have old 'status' column, create a temporary mapping
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' 
        AND column_name = 'status' 
        AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'Found old status column. Creating temporary employment status mapping...';
        
        -- Create a temporary employment status for 'Active' if it doesn't exist
        INSERT INTO employment_status (code, name, description) 
        VALUES ('TEMP_ACTIVE', 'Active', 'Temporary active status for migration')
        ON CONFLICT (code) DO NOTHING;
        
        -- Update employees with old 'Active' status
        UPDATE employees 
        SET employment_status_id = (
            SELECT id FROM employment_status WHERE code = 'TEMP_ACTIVE'
        )
        WHERE status = 'Active' AND employment_status_id IS NULL;
        
        RAISE NOTICE 'Updated employees with Active status. You should run the full master-tables-schema.sql for complete setup.';
    END IF;
END $$;

-- 9. Verify the fixes
SELECT 
    'user_profiles' as table_name,
    COUNT(*) as total_records,
    COUNT(employee_id) as records_with_employee_id,
    COUNT(*) - COUNT(employee_id) as records_without_employee_id
FROM user_profiles

UNION ALL

SELECT 
    'employees' as table_name,
    COUNT(*) as total_records,
    COUNT(employment_status_id) as records_with_status_id,
    COUNT(*) - COUNT(employment_status_id) as records_without_status_id
FROM employees;

-- 10. Show current user_profiles structure
SELECT 
    'user_profiles' as table_name,
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
