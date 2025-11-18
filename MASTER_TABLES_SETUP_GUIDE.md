# Master Tables Setup Guide

## 🎯 Overview

Your ERP system now uses master tables for role-based access control and data integrity. This ensures consistent data entry and better management of employee information.

## 📋 Setup Steps

### **Step 1: Run Master Tables Schema**

1. **Open Supabase SQL Editor**
2. **Copy and paste** the contents of `database/master-tables-schema.sql`
3. **Execute the script** - this will:
   - Create all master tables (departments, positions, employee_types, etc.)
   - Update the employees table with proper foreign key relationships
   - Insert sample master data
   - Set up proper Row Level Security (RLS) policies

### **Step 2: Verify Master Data**

Run these queries to verify the setup:

```sql
-- Check departments
SELECT id, code, name, location FROM departments WHERE is_active = true;

-- Check positions
SELECT p.code, p.title, p.level, d.name as department 
FROM positions p 
LEFT JOIN departments d ON p.department_id = d.id 
WHERE p.is_active = true;

-- Check employee types
SELECT code, name, description FROM employee_types WHERE is_active = true;

-- Check employment status
SELECT code, name, description FROM employment_status WHERE is_active = true;

-- Check work locations
SELECT code, name, city, state FROM work_locations WHERE is_active = true;

-- Check shift types
SELECT code, name, start_time, end_time FROM shift_types WHERE is_active = true;
```

## 🏗️ Master Tables Structure

### **1. Departments**
- **Purpose**: Organize employees by department
- **Key Fields**: code, name, description, location, department_head_id
- **Sample Data**: IT, HR, Finance, Marketing, Operations, Sales, Legal, Admin

### **2. Positions**
- **Purpose**: Define job roles and hierarchy levels
- **Key Fields**: code, title, level (1-6), department_id, salary_range
- **Sample Data**: Junior Developer, Senior Developer, IT Manager, HR Specialist, etc.

### **3. Employee Types**
- **Purpose**: Classify employment arrangements
- **Sample Data**: Full-Time, Part-Time, Contractor, Intern, Temporary, Consultant

### **4. Employment Status**
- **Purpose**: Track current employment state
- **Sample Data**: Active, On Probation, On Leave, Suspended, Terminated, Resigned

### **5. Work Locations**
- **Purpose**: Define where employees work
- **Sample Data**: Headquarters, Branch offices, Remote, Client sites

### **6. Shift Types**
- **Purpose**: Define working hours and schedules
- **Sample Data**: Day Shift, Night Shift, Evening Shift, Flexible Hours

## 🎨 Enhanced Add Employee Modal

The new modal includes:

### **Personal Information Tab:**
- ✅ Name, Email, Phone (required fields)
- ✅ Date of Birth, Gender
- ✅ Full Address fields

### **Employment Tab:**
- ✅ **Department Dropdown** (from departments table)
- ✅ **Position Dropdown** (filtered by selected department)
- ✅ **Employee Type Dropdown** (Full-time, Part-time, etc.)
- ✅ **Employment Status Dropdown** (Active, Probation, etc.)
- ✅ **Work Location Dropdown** (Office locations)
- ✅ **Shift Type Dropdown** (Day, Night, Flexible, etc.)
- ✅ **Manager Dropdown** (existing employees with manager level)
- ✅ **Hire Date** (required)

### **Compensation Tab:**
- ✅ Salary (optional)
- ✅ Probation End Date
- ✅ Confirmation Date

## 🔄 Dynamic Features

### **Department-Position Filtering:**
- When you select a department, positions are automatically filtered
- Only positions belonging to that department are shown
- Position dropdown is disabled until department is selected

### **Manager Selection:**
- Only employees with management level positions (Level 4+) appear in manager dropdown
- Shows employee name and ID for easy identification

### **Data Validation:**
- Required fields are clearly marked with *
- Email format validation
- Salary amount validation
- Form prevents submission until all required fields are filled

## 📊 HR Module Enhancements

### **Enhanced Employee Display:**
- Shows position title instead of generic "position"
- Displays actual employment status from master data
- Shows work location and manager information
- Better data consistency and formatting

### **Improved Statistics:**
- Real-time counts from database
- Accurate department and status filtering
- Dynamic statistics based on actual data

## 🔧 Benefits of Master Tables

### **Data Integrity:**
- ✅ Consistent department names (no typos)
- ✅ Standardized position titles and levels
- ✅ Uniform employment status values
- ✅ Controlled work locations and shift types

### **Better User Experience:**
- ✅ Dropdown selections instead of free text
- ✅ Contextual filtering (positions by department)
- ✅ Clear hierarchy and relationships
- ✅ Reduced data entry errors

### **Administrative Control:**
- ✅ Admins can manage master data
- ✅ Add/edit departments, positions, locations
- ✅ Maintain organizational structure
- ✅ Control available options for users

### **Reporting & Analytics:**
- ✅ Consistent data for better reports
- ✅ Accurate employee categorization
- ✅ Reliable statistics and metrics
- ✅ Better data analysis capabilities

## 🚀 Testing the New System

### **Test Employee Creation:**

1. **Login as admin**
2. **Go to HR Module**
3. **Click "Add Employee"**
4. **Fill Personal Info:**
   - Name: Test Employee
   - Email: test@company.com
   - Phone: +1234567890

5. **Fill Employment Info:**
   - Department: Information Technology
   - Position: Junior Developer (auto-filtered)
   - Employee Type: Full-Time Employee
   - Employment Status: Active
   - Work Location: Headquarters
   - Manager: Select from available managers
   - Hire Date: Today

6. **Submit and verify:**
   - Employee appears in HR module
   - All master data displays correctly
   - User account created with password

### **Verify Data Relationships:**

```sql
-- Check the new employee with all relationships
SELECT 
    e.employee_id,
    e.first_name || ' ' || e.last_name as name,
    d.name as department,
    p.title as position,
    et.name as employee_type,
    es.name as employment_status,
    wl.name as work_location,
    st.name as shift_type,
    m.first_name || ' ' || m.last_name as manager
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
LEFT JOIN employee_types et ON e.employee_type_id = et.id
LEFT JOIN employment_status es ON e.employment_status_id = es.id
LEFT JOIN work_locations wl ON e.work_location_id = wl.id
LEFT JOIN shift_types st ON e.shift_type_id = st.id
LEFT JOIN employees m ON e.manager_id = m.id
WHERE e.is_active = true
ORDER BY e.created_at DESC;
```

## 🎯 Next Steps

With master tables in place, you can now:

1. **Add Master Data Management** - Admin interface to manage departments, positions, etc.
2. **Enhanced Reporting** - Better reports with consistent data
3. **Role-Based Permissions** - Department-specific access controls
4. **Advanced Filtering** - Filter employees by multiple criteria
5. **Organizational Charts** - Visual hierarchy based on manager relationships

Your ERP system now has a solid foundation for scalable employee management! 🎉
