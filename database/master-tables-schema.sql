-- Master Tables Schema for ERP System
-- Run this after the main schema.sql

-- =============================================
-- MASTER TABLES FOR HR MODULE
-- =============================================

-- 1. DEPARTMENTS (Enhanced)
DROP TABLE IF EXISTS departments CASCADE;
CREATE TABLE departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_department_id UUID REFERENCES departments(id),
    department_head_id UUID, -- Will reference employees(id) after employee table is created
    budget DECIMAL(15,2),
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. POSITIONS/DESIGNATIONS
CREATE TABLE positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    department_id UUID REFERENCES departments(id),
    level INTEGER DEFAULT 1, -- 1=Entry, 2=Mid, 3=Senior, 4=Lead, 5=Manager, 6=Director
    min_salary DECIMAL(12,2),
    max_salary DECIMAL(12,2),
    required_experience INTEGER, -- in years
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. EMPLOYEE TYPES
CREATE TABLE employee_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EMPLOYMENT STATUS
CREATE TABLE employment_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. WORK LOCATIONS
CREATE TABLE work_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SHIFT TYPES
CREATE TABLE shift_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration INTEGER DEFAULT 60, -- in minutes
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- UPDATE EMPLOYEES TABLE TO USE MASTER TABLES
-- =============================================

-- Drop existing employees table and recreate with proper references
DROP TABLE IF EXISTS employees CASCADE;
CREATE TABLE employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    
    -- Employment Information
    department_id UUID REFERENCES departments(id) NOT NULL,
    position_id UUID REFERENCES positions(id) NOT NULL,
    employee_type_id UUID REFERENCES employee_types(id) NOT NULL,
    employment_status_id UUID REFERENCES employment_status(id) NOT NULL,
    work_location_id UUID REFERENCES work_locations(id),
    shift_type_id UUID REFERENCES shift_types(id),
    
    -- Reporting Structure
    manager_id UUID REFERENCES employees(id),
    
    -- Employment Details
    hire_date DATE NOT NULL,
    probation_end_date DATE,
    confirmation_date DATE,
    termination_date DATE,
    
    -- Compensation
    salary DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Address
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20),
    
    -- System Fields
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for department head after employees table is created
ALTER TABLE departments 
ADD CONSTRAINT fk_department_head 
FOREIGN KEY (department_head_id) REFERENCES employees(id);

-- Add employee_id column to user_profiles to link with employees
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);

-- =============================================
-- INSERT MASTER DATA
-- =============================================

-- Insert Departments
INSERT INTO departments (code, name, description, location) VALUES
('IT', 'Information Technology', 'Technology and software development', 'Building A'),
('HR', 'Human Resources', 'Employee management and recruitment', 'Building B'),
('FIN', 'Finance', 'Financial planning and accounting', 'Building B'),
('MKT', 'Marketing', 'Marketing and brand management', 'Building C'),
('OPS', 'Operations', 'Business operations and logistics', 'Building A'),
('SALES', 'Sales', 'Sales and customer relations', 'Building C'),
('LEGAL', 'Legal', 'Legal affairs and compliance', 'Building B'),
('ADMIN', 'Administration', 'General administration', 'Building B');

-- Insert Positions
INSERT INTO positions (code, title, description, level, min_salary, max_salary) VALUES
-- IT Positions
('DEV_JR', 'Junior Developer', 'Entry level software developer', 1, 40000, 60000),
('DEV_SR', 'Senior Developer', 'Experienced software developer', 3, 70000, 90000),
('DEV_LEAD', 'Development Lead', 'Technical team leader', 4, 90000, 120000),
('SYS_ADMIN', 'System Administrator', 'IT infrastructure management', 2, 50000, 70000),
('IT_MGR', 'IT Manager', 'IT department manager', 5, 100000, 140000),

-- HR Positions
('HR_COORD', 'HR Coordinator', 'HR administrative support', 1, 35000, 50000),
('HR_SPEC', 'HR Specialist', 'HR operations specialist', 2, 50000, 70000),
('HR_MGR', 'HR Manager', 'HR department manager', 5, 80000, 110000),

-- Finance Positions
('ACC_JR', 'Junior Accountant', 'Entry level accounting', 1, 35000, 50000),
('ACC_SR', 'Senior Accountant', 'Experienced accountant', 3, 60000, 80000),
('FIN_ANALYST', 'Financial Analyst', 'Financial analysis and reporting', 2, 55000, 75000),
('FIN_MGR', 'Finance Manager', 'Finance department manager', 5, 90000, 130000),

-- General Positions
('INTERN', 'Intern', 'Internship position', 1, 20000, 30000),
('ADMIN_ASST', 'Administrative Assistant', 'Administrative support', 1, 30000, 45000),
('EXEC_ASST', 'Executive Assistant', 'Executive level support', 2, 45000, 65000);

-- Insert Employee Types
INSERT INTO employee_types (code, name, description) VALUES
('FTE', 'Full-Time Employee', 'Regular full-time employee'),
('PTE', 'Part-Time Employee', 'Part-time employee'),
('CONT', 'Contractor', 'Contract-based employee'),
('INTERN', 'Intern', 'Internship position'),
('TEMP', 'Temporary', 'Temporary employee'),
('CONS', 'Consultant', 'External consultant');

-- Insert Employment Status
INSERT INTO employment_status (code, name, description) VALUES
('ACTIVE', 'Active', 'Currently employed and active'),
('PROBATION', 'On Probation', 'Employee in probation period'),
('LEAVE', 'On Leave', 'Employee on approved leave'),
('SUSPENDED', 'Suspended', 'Employee suspended'),
('TERMINATED', 'Terminated', 'Employment terminated'),
('RESIGNED', 'Resigned', 'Employee resigned');

-- Insert Work Locations
INSERT INTO work_locations (code, name, address, city, state, country) VALUES
('HQ', 'Headquarters', '123 Business Ave', 'New York', 'NY', 'USA'),
('BR_LA', 'Los Angeles Branch', '456 West St', 'Los Angeles', 'CA', 'USA'),
('BR_CHI', 'Chicago Branch', '789 North Ave', 'Chicago', 'IL', 'USA'),
('REMOTE', 'Remote Work', 'Work from home', 'Various', 'Various', 'Various'),
('CLIENT', 'Client Site', 'At client location', 'Various', 'Various', 'Various');

-- Insert Shift Types
INSERT INTO shift_types (code, name, start_time, end_time, break_duration) VALUES
('DAY', 'Day Shift', '09:00:00', '17:00:00', 60),
('NIGHT', 'Night Shift', '22:00:00', '06:00:00', 60),
('EVENING', 'Evening Shift', '14:00:00', '22:00:00', 60),
('FLEX', 'Flexible Hours', '09:00:00', '17:00:00', 60),
('PART_AM', 'Part-Time Morning', '09:00:00', '13:00:00', 30),
('PART_PM', 'Part-Time Afternoon', '13:00:00', '17:00:00', 30);

-- =============================================
-- UPDATE EXISTING DATA (if any)
-- =============================================

-- Link positions to departments (update after both tables exist)
UPDATE positions SET department_id = (SELECT id FROM departments WHERE code = 'IT') 
WHERE code IN ('DEV_JR', 'DEV_SR', 'DEV_LEAD', 'SYS_ADMIN', 'IT_MGR');

UPDATE positions SET department_id = (SELECT id FROM departments WHERE code = 'HR') 
WHERE code IN ('HR_COORD', 'HR_SPEC', 'HR_MGR');

UPDATE positions SET department_id = (SELECT id FROM departments WHERE code = 'FIN') 
WHERE code IN ('ACC_JR', 'ACC_SR', 'FIN_ANALYST', 'FIN_MGR');

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_position ON employees(position_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_status ON employees(employment_status_id);
CREATE INDEX idx_employees_active ON employees(is_active);
CREATE INDEX idx_positions_department ON positions(department_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all master tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_types ENABLE ROW LEVEL SECURITY;

-- Create policies for master tables (readable by all authenticated users)
CREATE POLICY "Master data readable by authenticated users" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Master data readable by authenticated users" ON positions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Master data readable by authenticated users" ON employee_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Master data readable by authenticated users" ON employment_status FOR SELECT TO authenticated USING (true);
CREATE POLICY "Master data readable by authenticated users" ON work_locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Master data readable by authenticated users" ON shift_types FOR SELECT TO authenticated USING (true);

-- Admin can manage master data
CREATE POLICY "Admins can manage departments" ON departments FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage positions" ON positions FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage employee_types" ON employee_types FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage employment_status" ON employment_status FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage work_locations" ON work_locations FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage shift_types" ON shift_types FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
