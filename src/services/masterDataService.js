import { supabase } from '../lib/supabase';

export const masterDataService = {
  // =============================================
  // DEPARTMENTS
  // =============================================
  departments: {
    getAll: async () => {
      try {
        const { data, error } = await supabase
          .from('departments')
          .select(`
            id,
            code,
            name,
            description,
            location,
            is_active,
            parent_department:departments!parent_department_id(name),
            department_head:employees!department_head_id(first_name, last_name)
          `)
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching departments:', error);
        return { data: null, error };
      }
    },

    getById: async (id) => {
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching department:', error);
        return { data: null, error };
      }
    },

    create: async (departmentData) => {
      try {
        const { data, error } = await supabase
          .from('departments')
          .insert([departmentData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error creating department:', error);
        return { data: null, error };
      }
    }
  },

  // =============================================
  // POSITIONS
  // =============================================
  positions: {
    getAll: async () => {
      try {
        const { data, error } = await supabase
          .from('positions')
          .select(`
            id,
            code,
            title,
            description,
            level,
            min_salary,
            max_salary,
            required_experience,
            is_active,
            department:departments(id, name)
          `)
          .eq('is_active', true)
          .order('title');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching positions:', error);
        return { data: null, error };
      }
    },

    getByDepartment: async (departmentId) => {
      try {
        const { data, error } = await supabase
          .from('positions')
          .select('id, code, title, level, min_salary, max_salary')
          .eq('department_id', departmentId)
          .eq('is_active', true)
          .order('title');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching positions by department:', error);
        return { data: null, error };
      }
    },

    create: async (positionData) => {
      try {
        const { data, error } = await supabase
          .from('positions')
          .insert([positionData])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error creating position:', error);
        return { data: null, error };
      }
    }
  },

  // =============================================
  // EMPLOYEE TYPES
  // =============================================
  employeeTypes: {
    getAll: async () => {
      try {
        const { data, error } = await supabase
          .from('employee_types')
          .select('id, code, name, description')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching employee types:', error);
        return { data: null, error };
      }
    }
  },

  // =============================================
  // EMPLOYMENT STATUS
  // =============================================
  employmentStatus: {
    getAll: async () => {
      try {
        const { data, error } = await supabase
          .from('employment_status')
          .select('id, code, name, description')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching employment status:', error);
        return { data: null, error };
      }
    }
  },

  // =============================================
  // WORK LOCATIONS
  // =============================================
  workLocations: {
    getAll: async () => {
      try {
        const { data, error } = await supabase
          .from('work_locations')
          .select('id, code, name, address, city, state, country')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching work locations:', error);
        return { data: null, error };
      }
    }
  },

  // =============================================
  // SHIFT TYPES
  // =============================================
  shiftTypes: {
    getAll: async () => {
      try {
        const { data, error } = await supabase
          .from('shift_types')
          .select('id, code, name, start_time, end_time, break_duration')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching shift types:', error);
        return { data: null, error };
      }
    }
  },

  // =============================================
  // EMPLOYEES (for manager dropdown)
  // =============================================
  employees: {
    getManagers: async () => {
      try {
        const { data, error } = await supabase
          .from('employees')
          .select(`
            id,
            employee_id,
            first_name,
            last_name,
            position:positions(title, level)
          `)
          .eq('is_active', true)
          .gte('positions.level', 4) // Level 4+ are managers/leads
          .order('first_name');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching managers:', error);
        return { data: null, error };
      }
    },

    getAll: async () => {
      try {
        const { data, error } = await supabase
          .from('employees')
          .select(`
            id,
            employee_id,
            first_name,
            last_name,
            email,
            phone,
            hire_date,
            salary,
            is_active,
            department:departments(id, name),
            position:positions(id, title, level),
            employee_type:employee_types(name),
            employment_status:employment_status(name),
            work_location:work_locations(name),
            shift_type:shift_types(name),
            manager:employees!manager_id(first_name, last_name)
          `)
          .eq('is_active', true)
          .order('first_name');

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching employees:', error);
        return { data: null, error };
      }
    }
  },

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================
  utils: {
    // Get all master data at once for forms
    getAllMasterData: async () => {
      try {
        const [
          departments,
          positions,
          employeeTypes,
          employmentStatus,
          workLocations,
          shiftTypes,
          managers
        ] = await Promise.all([
          masterDataService.departments.getAll(),
          masterDataService.positions.getAll(),
          masterDataService.employeeTypes.getAll(),
          masterDataService.employmentStatus.getAll(),
          masterDataService.workLocations.getAll(),
          masterDataService.shiftTypes.getAll(),
          masterDataService.employees.getManagers()
        ]);

        return {
          departments: departments.data || [],
          positions: positions.data || [],
          employeeTypes: employeeTypes.data || [],
          employmentStatus: employmentStatus.data || [],
          workLocations: workLocations.data || [],
          shiftTypes: shiftTypes.data || [],
          managers: managers.data || [],
          error: null
        };
      } catch (error) {
        console.error('Error fetching master data:', error);
        return {
          departments: [],
          positions: [],
          employeeTypes: [],
          employmentStatus: [],
          workLocations: [],
          shiftTypes: [],
          managers: [],
          error
        };
      }
    },

    // Get positions filtered by department
    getPositionsByDepartment: async (departmentId) => {
      if (!departmentId) return { data: [], error: null };
      return await masterDataService.positions.getByDepartment(departmentId);
    }
  }
};
