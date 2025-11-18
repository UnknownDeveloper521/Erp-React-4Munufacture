-- Sample data for testing (run after schema.sql)

-- Insert sample employees (you'll need to replace UUIDs with actual department IDs from your database)
-- First, get department IDs
-- You can run: SELECT id, name FROM departments; to get the actual UUIDs

-- Sample employees data (replace department UUIDs with actual ones from your database)
INSERT INTO employees (
    employee_id, first_name, last_name, email, phone, position, 
    hire_date, employment_type, work_location, status, salary, currency
) VALUES 
    ('EMP001', 'John', 'Doe', 'john.doe@company.com', '+1-234-567-8900', 'Software Engineer', '2023-01-15', 'full-time', 'hybrid', 'Active', 75000, 'USD'),
    ('EMP002', 'Jane', 'Smith', 'jane.smith@company.com', '+1-234-567-8901', 'HR Manager', '2022-08-20', 'full-time', 'office', 'Active', 65000, 'USD'),
    ('EMP003', 'Mike', 'Johnson', 'mike.johnson@company.com', '+1-234-567-8902', 'Sales Representative', '2023-03-10', 'full-time', 'remote', 'On Leave', 55000, 'USD'),
    ('EMP004', 'Sarah', 'Wilson', 'sarah.wilson@company.com', '+1-234-567-8903', 'Marketing Specialist', '2023-02-01', 'full-time', 'office', 'Active', 60000, 'USD'),
    ('EMP005', 'David', 'Brown', 'david.brown@company.com', '+1-234-567-8904', 'Financial Analyst', '2022-11-15', 'full-time', 'hybrid', 'Active', 70000, 'USD');

-- Update employees with department IDs (you'll need to run this after getting actual department IDs)
-- UPDATE employees SET department_id = (SELECT id FROM departments WHERE name = 'Information Technology') WHERE employee_id = 'EMP001';
-- UPDATE employees SET department_id = (SELECT id FROM departments WHERE name = 'Human Resources') WHERE employee_id = 'EMP002';
-- UPDATE employees SET department_id = (SELECT id FROM departments WHERE name = 'Sales') WHERE employee_id = 'EMP003';
-- UPDATE employees SET department_id = (SELECT id FROM departments WHERE name = 'Marketing') WHERE employee_id = 'EMP004';
-- UPDATE employees SET department_id = (SELECT id FROM departments WHERE name = 'Finance') WHERE employee_id = 'EMP005';

-- Sample attendance data for current month
INSERT INTO attendance (employee_id, date, check_in, check_out, total_hours, status) 
SELECT 
    e.id,
    CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 6),
    '09:00:00'::TIME + (RANDOM() * INTERVAL '30 minutes'),
    '17:30:00'::TIME + (RANDOM() * INTERVAL '30 minutes'),
    8.0 + (RANDOM() * 1.0),
    CASE 
        WHEN RANDOM() > 0.9 THEN 'Absent'
        WHEN RANDOM() > 0.8 THEN 'Late'
        ELSE 'Present'
    END
FROM employees e
WHERE e.status = 'Active';

-- Sample leave requests
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, total_days, reason, status)
SELECT 
    e.id,
    CASE (RANDOM() * 3)::INT
        WHEN 0 THEN 'Vacation'
        WHEN 1 THEN 'Sick Leave'
        ELSE 'Personal'
    END,
    CURRENT_DATE + INTERVAL '1 week',
    CURRENT_DATE + INTERVAL '1 week' + INTERVAL '2 days',
    3,
    'Sample leave request',
    CASE (RANDOM() * 3)::INT
        WHEN 0 THEN 'Pending'
        WHEN 1 THEN 'Approved'
        ELSE 'Rejected'
    END
FROM employees e
LIMIT 3;

-- Function to generate more sample data
CREATE OR REPLACE FUNCTION generate_sample_attendance(days_back INTEGER DEFAULT 30)
RETURNS VOID AS $$
DECLARE
    emp_record RECORD;
    day_offset INTEGER;
BEGIN
    -- Clear existing sample data
    DELETE FROM attendance WHERE date >= CURRENT_DATE - INTERVAL '1 day' * days_back;
    
    -- Generate attendance for each active employee
    FOR emp_record IN SELECT id FROM employees WHERE status = 'Active' LOOP
        FOR day_offset IN 0..days_back LOOP
            -- Skip weekends
            IF EXTRACT(DOW FROM CURRENT_DATE - day_offset) NOT IN (0, 6) THEN
                INSERT INTO attendance (employee_id, date, check_in, check_out, total_hours, status)
                VALUES (
                    emp_record.id,
                    CURRENT_DATE - day_offset,
                    '09:00:00'::TIME + (RANDOM() * INTERVAL '30 minutes'),
                    '17:30:00'::TIME + (RANDOM() * INTERVAL '30 minutes'),
                    8.0 + (RANDOM() * 1.0),
                    CASE 
                        WHEN RANDOM() > 0.95 THEN 'Absent'
                        WHEN RANDOM() > 0.85 THEN 'Late'
                        ELSE 'Present'
                    END
                );
            END IF;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Call the function to generate sample attendance data
-- SELECT generate_sample_attendance(30);
