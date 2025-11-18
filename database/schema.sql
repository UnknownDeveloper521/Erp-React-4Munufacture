-- Create custom types
CREATE TYPE employment_type AS ENUM ('full-time', 'part-time', 'contract', 'intern', 'temporary');
CREATE TYPE employee_status AS ENUM ('Active', 'Inactive', 'On Leave', 'Terminated');
CREATE TYPE work_location AS ENUM ('office', 'remote', 'hybrid');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE marital_status AS ENUM ('single', 'married', 'divorced', 'widowed');

-- Create departments table
CREATE TABLE departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender gender_type,
    marital_status marital_status,
    nationality VARCHAR(50),
    
    -- Contact Information
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Employment Details
    position VARCHAR(100) NOT NULL,
    department_id UUID REFERENCES departments(id),
    manager_id UUID REFERENCES employees(id),
    hire_date DATE NOT NULL,
    employment_type employment_type,
    work_location work_location,
    status employee_status DEFAULT 'Active',
    
    -- Compensation
    salary DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'USD',
    pay_frequency VARCHAR(20),
    
    -- Additional Information
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    notes TEXT,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create attendance table
CREATE TABLE attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    break_duration INTEGER DEFAULT 0, -- in minutes
    total_hours DECIMAL(4,2),
    status VARCHAR(20) DEFAULT 'Present', -- Present, Absent, Late, Half Day
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- Create leave_requests table
CREATE TABLE leave_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL, -- Vacation, Sick Leave, Personal, etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'Pending', -- Pending, Approved, Rejected
    approved_by UUID REFERENCES employees(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    employee_id UUID REFERENCES employees(id),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'employee',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, first_name, last_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert default departments
INSERT INTO departments (name, description) VALUES
    ('Information Technology', 'Technology and software development'),
    ('Human Resources', 'Employee management and HR operations'),
    ('Sales', 'Sales and business development'),
    ('Marketing', 'Marketing and brand management'),
    ('Finance', 'Financial planning and accounting'),
    ('Operations', 'Business operations and logistics'),
    ('Customer Service', 'Customer support and relations');

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Departments: Everyone can read, only admins can modify
CREATE POLICY "Everyone can read departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Only admins can modify departments" ON departments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role IN ('admin', 'hr')
    )
);

-- Employees: Users can read all, but modify based on role
CREATE POLICY "Everyone can read employees" ON employees FOR SELECT USING (true);
CREATE POLICY "HR and admins can modify employees" ON employees FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role IN ('admin', 'hr')
    )
);

-- Attendance: Users can see their own and managers can see their team
CREATE POLICY "Users can see own attendance" ON attendance FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM employees e
        JOIN user_profiles up ON up.employee_id = e.id
        WHERE e.id = attendance.employee_id AND up.id = auth.uid()
    )
);

CREATE POLICY "Managers can see team attendance" ON attendance FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM employees e
        JOIN user_profiles up ON up.employee_id = e.manager_id
        WHERE e.id = attendance.employee_id AND up.id = auth.uid()
    )
);

-- Leave requests: Similar to attendance
CREATE POLICY "Users can manage own leave requests" ON leave_requests FOR ALL USING (
    EXISTS (
        SELECT 1 FROM employees e
        JOIN user_profiles up ON up.employee_id = e.id
        WHERE e.id = leave_requests.employee_id AND up.id = auth.uid()
    )
);

-- User profiles: Users can read all but only modify their own
CREATE POLICY "Everyone can read profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
