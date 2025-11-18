-- Indian Employees Dummy Data for Tassos ERP System
-- Execute these queries in your Supabase SQL Editor

-- First, let's insert some departments (if not already present)
INSERT INTO departments (name, code, description) VALUES
('Information Technology', 'IT', 'Software development and IT support'),
('Human Resources', 'HR', 'Employee management and recruitment'),
('Finance & Accounting', 'FIN', 'Financial planning and accounting'),
('Marketing & Sales', 'MKT', 'Marketing campaigns and sales operations'),
('Operations', 'OPS', 'Daily operations and logistics'),
('Customer Support', 'CS', 'Customer service and technical support'),
('Research & Development', 'RND', 'Product research and development'),
('Administration', 'ADM', 'General administration and facilities')
ON CONFLICT (code) DO NOTHING;

-- Insert some positions (if not already present)
INSERT INTO positions (title, code, department_id, description, level, min_salary, max_salary, required_experience, is_active) VALUES
('Software Engineer', 'SWE', (SELECT id FROM departments WHERE code = 'IT'), 'Full-stack software development', 2, 600000, 1000000, 1, true),
('Senior Software Engineer', 'SSE', (SELECT id FROM departments WHERE code = 'IT'), 'Senior level software development', 3, 1000000, 1500000, 3, true),
('Tech Lead', 'TL', (SELECT id FROM departments WHERE code = 'IT'), 'Technical leadership and mentoring', 4, 1400000, 2000000, 5, true),
('DevOps Engineer', 'DOE', (SELECT id FROM departments WHERE code = 'IT'), 'Infrastructure and deployment', 3, 1000000, 1400000, 2, true),
('QA Engineer', 'QAE', (SELECT id FROM departments WHERE code = 'IT'), 'Quality assurance and testing', 2, 600000, 1000000, 1, true),
('HR Manager', 'HRM', (SELECT id FROM departments WHERE code = 'HR'), 'Human resources management', 4, 1200000, 1800000, 5, true),
('HR Executive', 'HRE', (SELECT id FROM departments WHERE code = 'HR'), 'HR operations and recruitment', 2, 500000, 800000, 1, true),
('Accountant', 'ACC', (SELECT id FROM departments WHERE code = 'FIN'), 'Financial accounting and reporting', 2, 500000, 800000, 1, true),
('Finance Manager', 'FM', (SELECT id FROM departments WHERE code = 'FIN'), 'Financial planning and analysis', 4, 1300000, 1900000, 5, true),
('Marketing Manager', 'MM', (SELECT id FROM departments WHERE code = 'MKT'), 'Marketing strategy and campaigns', 4, 1200000, 1800000, 4, true),
('Sales Executive', 'SE', (SELECT id FROM departments WHERE code = 'MKT'), 'Sales and client relations', 2, 600000, 1000000, 1, true),
('Operations Manager', 'OM', (SELECT id FROM departments WHERE code = 'OPS'), 'Operations oversight', 4, 1200000, 1700000, 4, true),
('Customer Support Executive', 'CSE', (SELECT id FROM departments WHERE code = 'CS'), 'Customer service and support', 1, 300000, 600000, 0, true),
('Research Analyst', 'RA', (SELECT id FROM departments WHERE code = 'RND'), 'Market and product research', 2, 700000, 1200000, 2, true),
('Admin Officer', 'AO', (SELECT id FROM departments WHERE code = 'ADM'), 'Administrative support', 2, 400000, 700000, 1, true)
ON CONFLICT (code) DO NOTHING;

-- Insert employee types (if not already present)
INSERT INTO employee_types (name, code, description, is_active) VALUES
('Full Time', 'FT', 'Full-time permanent employee', true),
('Part Time', 'PT', 'Part-time employee', true),
('Contract', 'CT', 'Contract-based employee', true),
('Intern', 'IN', 'Internship program', true),
('Consultant', 'CN', 'External consultant', true)
ON CONFLICT (code) DO NOTHING;

-- Insert employment status (if not already present)
INSERT INTO employment_status (name, code, description, is_active) VALUES
('Active', 'ACT', 'Currently employed and active', true),
('Probation', 'PRB', 'Under probation period', true),
('Notice Period', 'NP', 'Serving notice period', true),
('Terminated', 'TRM', 'Employment terminated', true),
('Resigned', 'RSG', 'Resigned from position', true)
ON CONFLICT (code) DO NOTHING;

-- Insert work locations (if not already present)
INSERT INTO work_locations (name, code, address, city, state, country, is_active) VALUES
('Mumbai Office', 'MUM', 'Bandra Kurla Complex, Bandra East', 'Mumbai', 'Maharashtra', 'India', true),
('Bangalore Office', 'BLR', 'Electronic City Phase 1', 'Bangalore', 'Karnataka', 'India', true),
('Delhi Office', 'DEL', 'Connaught Place', 'New Delhi', 'Delhi', 'India', true),
('Pune Office', 'PUN', 'Hinjewadi IT Park', 'Pune', 'Maharashtra', 'India', true),
('Hyderabad Office', 'HYD', 'HITEC City', 'Hyderabad', 'Telangana', 'India', true),
('Chennai Office', 'CHN', 'OMR IT Corridor', 'Chennai', 'Tamil Nadu', 'India', true),
('Remote Work', 'RMT', 'Work from home', 'Various', 'Various', 'India', true)
ON CONFLICT (code) DO NOTHING;

-- Insert shift types (if not already present)
INSERT INTO shift_types (name, code, start_time, end_time, break_duration, is_active) VALUES
('General Shift', 'GEN', '09:00:00', '18:00:00', 60, true),
('Early Shift', 'ERL', '07:00:00', '16:00:00', 60, true),
('Late Shift', 'LAT', '13:00:00', '22:00:00', 60, true),
('Night Shift', 'NGT', '22:00:00', '07:00:00', 60, true),
('Flexible', 'FLX', '09:00:00', '18:00:00', 60, true)
ON CONFLICT (code) DO NOTHING;

-- Now insert Indian employees with realistic data
INSERT INTO employees (
    employee_id, first_name, last_name, email, phone, 
    date_of_birth, gender, address, city, state, postal_code, country,
    department_id, position_id, employee_type_id, employment_status_id, 
    work_location_id, shift_type_id, hire_date, salary,
    probation_end_date, confirmation_date, is_active
) VALUES

-- IT Department Employees
('EMP001', 'Rajesh', 'Kumar', 'rajesh.kumar@tassosconsultancy.com', '+91-9876543210', 
 '1990-03-15', 'Male', '123 MG Road, Koramangala', 'Bangalore', 'Karnataka', '560034', 'India',
 (SELECT id FROM departments WHERE code = 'IT'), 
 (SELECT id FROM positions WHERE code = 'SSE'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'BLR'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2020-01-15', 1200000, '2020-07-15', '2020-07-16', true),

('EMP002', 'Priya', 'Sharma', 'priya.sharma@tassosconsultancy.com', '+91-9876543211',
 '1992-07-22', 'Female', '456 Linking Road, Bandra', 'Mumbai', 'Maharashtra', '400050', 'India',
 (SELECT id FROM departments WHERE code = 'IT'), 
 (SELECT id FROM positions WHERE code = 'SWE'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'MUM'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2021-03-10', 950000, '2021-09-10', '2021-09-11', true),

('EMP003', 'Amit', 'Patel', 'amit.patel@tassosconsultancy.com', '+91-9876543212',
 '1988-11-08', 'Male', '789 SG Highway, Ahmedabad', 'Ahmedabad', 'Gujarat', '380015', 'India',
 (SELECT id FROM departments WHERE code = 'IT'), 
 (SELECT id FROM positions WHERE code = 'TL'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'PUN'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2018-06-01', 1500000, '2018-12-01', '2018-12-02', true),

('EMP004', 'Sneha', 'Reddy', 'sneha.reddy@tassosconsultancy.com', '+91-9876543213',
 '1994-02-14', 'Female', '321 Jubilee Hills', 'Hyderabad', 'Telangana', '500033', 'India',
 (SELECT id FROM departments WHERE code = 'IT'), 
 (SELECT id FROM positions WHERE code = 'QAE'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'HYD'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2022-01-20', 800000, '2022-07-20', '2022-07-21', true),

('EMP005', 'Vikram', 'Singh', 'vikram.singh@tassosconsultancy.com', '+91-9876543214',
 '1991-09-30', 'Male', '654 Connaught Place', 'New Delhi', 'Delhi', '110001', 'India',
 (SELECT id FROM departments WHERE code = 'IT'), 
 (SELECT id FROM positions WHERE code = 'DOE'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'DEL'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2019-08-15', 1100000, '2020-02-15', '2020-02-16', true),

-- HR Department Employees
('EMP006', 'Kavya', 'Nair', 'kavya.nair@tassosconsultancy.com', '+91-9876543215',
 '1989-05-12', 'Female', '987 Marine Drive', 'Mumbai', 'Maharashtra', '400020', 'India',
 (SELECT id FROM departments WHERE code = 'HR'), 
 (SELECT id FROM positions WHERE code = 'HRM'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'MUM'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2017-04-01', 1300000, '2017-10-01', '2017-10-02', true),

('EMP007', 'Rohit', 'Gupta', 'rohit.gupta@tassosconsultancy.com', '+91-9876543216',
 '1993-12-03', 'Male', '147 Sector 14', 'Gurgaon', 'Haryana', '122001', 'India',
 (SELECT id FROM departments WHERE code = 'HR'), 
 (SELECT id FROM positions WHERE code = 'HRE'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'PRB'),
 (SELECT id FROM work_locations WHERE code = 'DEL'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2024-01-15', 700000, '2024-07-15', NULL, true),

-- Finance Department Employees
('EMP008', 'Meera', 'Joshi', 'meera.joshi@tassosconsultancy.com', '+91-9876543217',
 '1987-08-25', 'Female', '258 FC Road', 'Pune', 'Maharashtra', '411005', 'India',
 (SELECT id FROM departments WHERE code = 'FIN'), 
 (SELECT id FROM positions WHERE code = 'FM'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'PUN'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2016-09-12', 1400000, '2017-03-12', '2017-03-13', true),

('EMP009', 'Arjun', 'Menon', 'arjun.menon@tassosconsultancy.com', '+91-9876543218',
 '1995-01-18', 'Male', '369 Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', 'India',
 (SELECT id FROM departments WHERE code = 'FIN'), 
 (SELECT id FROM positions WHERE code = 'ACC'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'CHN'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2023-02-28', 650000, '2023-08-28', '2023-08-29', true),

-- Marketing Department Employees
('EMP010', 'Pooja', 'Agarwal', 'pooja.agarwal@tassosconsultancy.com', '+91-9876543219',
 '1990-10-07', 'Female', '741 Park Street', 'Kolkata', 'West Bengal', '700016', 'India',
 (SELECT id FROM departments WHERE code = 'MKT'), 
 (SELECT id FROM positions WHERE code = 'MM'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'RMT'),
 (SELECT id FROM shift_types WHERE code = 'FLX'),
 '2019-11-20', 1250000, '2020-05-20', '2020-05-21', true),

('EMP011', 'Karan', 'Malhotra', 'karan.malhotra@tassosconsultancy.com', '+91-9876543220',
 '1992-04-16', 'Male', '852 Model Town', 'Ludhiana', 'Punjab', '141002', 'India',
 (SELECT id FROM departments WHERE code = 'MKT'), 
 (SELECT id FROM positions WHERE code = 'SE'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'DEL'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2021-07-05', 850000, '2022-01-05', '2022-01-06', true),

-- Operations Department Employees
('EMP012', 'Deepika', 'Iyer', 'deepika.iyer@tassosconsultancy.com', '+91-9876543221',
 '1986-06-29', 'Female', '963 Jayanagar', 'Bangalore', 'Karnataka', '560011', 'India',
 (SELECT id FROM departments WHERE code = 'OPS'), 
 (SELECT id FROM positions WHERE code = 'OM'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'BLR'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2015-03-18', 1350000, '2015-09-18', '2015-09-19', true),

-- Customer Support Employees
('EMP013', 'Rahul', 'Verma', 'rahul.verma@tassosconsultancy.com', '+91-9876543222',
 '1994-11-11', 'Male', '159 Gomti Nagar', 'Lucknow', 'Uttar Pradesh', '226010', 'India',
 (SELECT id FROM departments WHERE code = 'CS'), 
 (SELECT id FROM positions WHERE code = 'CSE'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'RMT'),
 (SELECT id FROM shift_types WHERE code = 'LAT'),
 '2022-09-12', 550000, '2023-03-12', '2023-03-13', true),

('EMP014', 'Ananya', 'Das', 'ananya.das@tassosconsultancy.com', '+91-9876543223',
 '1996-03-08', 'Female', '357 Salt Lake', 'Kolkata', 'West Bengal', '700064', 'India',
 (SELECT id FROM departments WHERE code = 'CS'), 
 (SELECT id FROM positions WHERE code = 'CSE'), 
 (SELECT id FROM employee_types WHERE code = 'PT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'RMT'),
 (SELECT id FROM shift_types WHERE code = 'NGT'),
 '2023-05-22', 400000, '2023-11-22', '2023-11-23', true),

-- R&D Department Employees
('EMP015', 'Siddharth', 'Chopra', 'siddharth.chopra@tassosconsultancy.com', '+91-9876543224',
 '1991-12-20', 'Male', '468 Cyber City', 'Gurgaon', 'Haryana', '122002', 'India',
 (SELECT id FROM departments WHERE code = 'RND'), 
 (SELECT id FROM positions WHERE code = 'RA'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'DEL'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2020-10-08', 1000000, '2021-04-08', '2021-04-09', true),

-- Administration Department Employees
('EMP016', 'Ritu', 'Bhatt', 'ritu.bhatt@tassosconsultancy.com', '+91-9876543225',
 '1988-07-14', 'Female', '579 Vastrapur', 'Ahmedabad', 'Gujarat', '380015', 'India',
 (SELECT id FROM departments WHERE code = 'ADM'), 
 (SELECT id FROM positions WHERE code = 'AO'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'RMT'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2019-02-14', 600000, '2019-08-14', '2019-08-15', true),

-- Interns and Contract Employees
('EMP017', 'Aarav', 'Jain', 'aarav.jain@tassosconsultancy.com', '+91-9876543226',
 '1999-09-05', 'Male', '680 Whitefield', 'Bangalore', 'Karnataka', '560066', 'India',
 (SELECT id FROM departments WHERE code = 'IT'), 
 (SELECT id FROM positions WHERE code = 'SWE'), 
 (SELECT id FROM employee_types WHERE code = 'IN'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'BLR'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2024-06-01', 300000, '2024-12-01', NULL, true),

('EMP018', 'Ishita', 'Bansal', 'ishita.bansal@tassosconsultancy.com', '+91-9876543227',
 '1985-04-02', 'Female', '791 Sector 17', 'Chandigarh', 'Chandigarh', '160017', 'India',
 (SELECT id FROM departments WHERE code = 'MKT'), 
 (SELECT id FROM positions WHERE code = 'MM'), 
 (SELECT id FROM employee_types WHERE code = 'CN'),
 (SELECT id FROM employment_status WHERE code = 'ACT'),
 (SELECT id FROM work_locations WHERE code = 'RMT'),
 (SELECT id FROM shift_types WHERE code = 'FLX'),
 '2023-12-01', 2000000, NULL, NULL, true),

('EMP019', 'Nikhil', 'Rao', 'nikhil.rao@tassosconsultancy.com', '+91-9876543228',
 '1993-08-17', 'Male', '802 Banjara Hills', 'Hyderabad', 'Telangana', '500034', 'India',
 (SELECT id FROM departments WHERE code = 'IT'), 
 (SELECT id FROM positions WHERE code = 'SWE'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'NP'),
 (SELECT id FROM work_locations WHERE code = 'HYD'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2021-11-30', 900000, '2022-05-30', '2022-05-31', true),

('EMP020', 'Divya', 'Pillai', 'divya.pillai@tassosconsultancy.com', '+91-9876543229',
 '1997-01-25', 'Female', '913 Kochi Marine Drive', 'Kochi', 'Kerala', '682031', 'India',
 (SELECT id FROM departments WHERE code = 'HR'), 
 (SELECT id FROM positions WHERE code = 'HRE'), 
 (SELECT id FROM employee_types WHERE code = 'FT'),
 (SELECT id FROM employment_status WHERE code = 'PRB'),
 (SELECT id FROM work_locations WHERE code = 'RMT'),
 (SELECT id FROM shift_types WHERE code = 'GEN'),
 '2024-02-01', 650000, '2024-08-01', NULL, true)
ON CONFLICT (employee_id) DO NOTHING;

-- Update some employees to have managers (hierarchical structure)
UPDATE employees SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP003') 
WHERE employee_id IN ('EMP001', 'EMP002', 'EMP017');

UPDATE employees SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP006') 
WHERE employee_id IN ('EMP007', 'EMP020');

UPDATE employees SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP008') 
WHERE employee_id = 'EMP009';

UPDATE employees SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP010') 
WHERE employee_id = 'EMP011';

UPDATE employees SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP012') 
WHERE employee_id = 'EMP013';

-- Create user profiles for all employees
-- Note: In a real application, you would use Supabase Auth API to create users
-- This creates user_profiles entries that can be linked to Supabase auth users
INSERT INTO user_profiles (
    email, first_name, last_name, full_name, phone, role, 
    employee_id, is_active, created_at, updated_at
) 
SELECT 
    e.email,
    e.first_name,
    e.last_name,
    CONCAT(e.first_name, ' ', e.last_name) as full_name,
    e.phone,
    CASE 
        WHEN p.level >= 4 THEN 'admin'
        WHEN d.code = 'HR' THEN 'hr'
        ELSE 'employee'
    END as role,
    e.employee_id,
    e.is_active,
    NOW() as created_at,
    NOW() as updated_at
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
WHERE e.is_active = true
ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    employee_id = EXCLUDED.employee_id,
    updated_at = NOW();

-- Display user credentials information
-- Note: Passwords are [first-name]@123 for all users
-- Example: Rajesh's password is "rajesh@123"
SELECT 
    'User Credentials Created' as status,
    'Password format: [first-name]@123' as password_info,
    'Example: rajesh@123, priya@123, etc.' as example;

-- Display all created users with their roles
SELECT 
    up.email,
    up.first_name,
    up.last_name,
    up.role,
    up.employee_id,
    LOWER(up.first_name) || '@123' as password,
    CASE 
        WHEN up.role = 'admin' THEN 'Full system access'
        WHEN up.role = 'hr' THEN 'HR module access'
        ELSE 'Employee self-service access'
    END as access_level
FROM user_profiles up
WHERE up.is_active = true
ORDER BY up.role DESC, up.first_name;

-- Verify the employee data insertion
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.email,
    d.name as department,
    p.title as position,
    et.name as employee_type,
    es.name as employment_status,
    wl.name as work_location,
    e.salary
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
LEFT JOIN employee_types et ON e.employee_type_id = et.id
LEFT JOIN employment_status es ON e.employment_status_id = es.id
LEFT JOIN work_locations wl ON e.work_location_id = wl.id
ORDER BY e.employee_id;
