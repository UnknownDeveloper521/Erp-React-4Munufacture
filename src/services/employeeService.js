import { supabase } from '../lib/supabase';

export const employeeService = {
  // Get all employees
  getAll: async (filters = {}) => {
    try {
      let query = supabase
        .from('employees')
        .select(`
          *,
          department:departments!department_id(id, name, code)
        `);

      // Apply filters
      if (filters.department) {
        query = query.eq('department_id', filters.department);
      }
      // Note: Status filtering disabled until master tables are set up
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%, last_name.ilike.%${filters.search}%, email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching employees:', error);
      return { data: null, error };
    }
  },

  // Get employee by ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          department:departments!department_id(id, name, code)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching employee:', error);
      return { data: null, error };
    }
  },

  // Create new employee
  create: async (employeeData) => {
    try {
      // Handle department lookup by name
      if (employeeData.department_name && !employeeData.department_id) {
        const { data: department } = await supabase
          .from('departments')
          .select('id')
          .eq('name', employeeData.department_name)
          .single();
        
        if (department) {
          employeeData.department_id = department.id;
        }
        delete employeeData.department_name; // Remove the name field
      }

      // Generate employee ID if not provided
      if (!employeeData.employee_id) {
        // Get the highest employee ID number
        const { data: employees } = await supabase
          .from('employees')
          .select('employee_id')
          .order('employee_id', { ascending: false })
          .limit(1);
        
        let nextNumber = 1;
        if (employees && employees.length > 0) {
          const lastId = employees[0].employee_id;
          if (lastId && lastId.startsWith('EMP')) {
            const currentNumber = parseInt(lastId.replace('EMP', ''));
            nextNumber = isNaN(currentNumber) ? 1 : currentNumber + 1;
          }
        }
        
        employeeData.employee_id = `EMP${nextNumber.toString().padStart(3, '0')}`;
        
        // Double-check for uniqueness
        const { data: existingEmployee } = await supabase
          .from('employees')
          .select('id')
          .eq('employee_id', employeeData.employee_id)
          .single();
        
        // If still exists, use timestamp-based ID
        if (existingEmployee) {
          const timestamp = Date.now().toString().slice(-4);
          employeeData.employee_id = `EMP${timestamp}`;
        }
      }

      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select(`
          *,
          department:departments!department_id(id, name, code)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating employee:', error);
      return { data: null, error };
    }
  },

  // Update employee
  update: async (id, employeeData) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating employee:', error);
      return { data: null, error };
    }
  },

  // Delete employee
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting employee:', error);
      return { error };
    }
  },

  // Create employee with user account
  createWithUser: async (employeeData) => {
    try {
      // First create the employee
      const { data: employee, error: empError } = await employeeService.create(employeeData);
      
      if (empError) {
        return { data: null, error: empError };
      }

      // Generate password: [firstname]@123
      const password = `${employeeData.first_name}@123`;

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: employeeData.email,
        password: password,
        options: {
          data: {
            first_name: employeeData.first_name,
            last_name: employeeData.last_name,
            full_name: `${employeeData.first_name} ${employeeData.last_name}`
          }
        }
      });

      if (authError) {
        console.error('User creation error:', authError);
        // Employee was created but user creation failed
        return { 
          data: employee, 
          error: null, 
          userError: authError,
          password: password 
        };
      }

      // Link user profile to employee
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ employee_id: employee.id })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Profile linking error:', profileError);
        }
      }

      return { 
        data: employee, 
        error: null, 
        user: authData.user,
        password: password 
      };
    } catch (error) {
      console.error('Error creating employee with user:', error);
      return { data: null, error };
    }
  },

  // Get employee statistics
  getStats: async () => {
    try {
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select(`
          employment_status_id, 
          department_id,
          employment_status:employment_status(name)
        `)
        .eq('is_active', true);

      if (employeesError) throw employeesError;

      const { data: departments, error: deptError } = await supabase
        .from('departments')
        .select('id, name')
        .eq('is_active', true);

      if (deptError) throw deptError;

      const stats = {
        total: employees.length,
        active: employees.filter(emp => emp.employment_status?.name === 'Active').length,
        onLeave: employees.filter(emp => emp.employment_status?.name === 'On Leave').length,
        inactive: employees.filter(emp => emp.employment_status?.name === 'Inactive').length,
        departments: departments.length,
        departmentBreakdown: departments.map(dept => ({
          name: dept.name,
          count: employees.filter(emp => emp.department_id === dept.id).length
        }))
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      return { data: null, error };
    }
  }
};

export default employeeService;
