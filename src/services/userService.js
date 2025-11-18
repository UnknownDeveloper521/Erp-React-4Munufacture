import { supabase } from '../lib/supabase';

export const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          first_name,
          last_name,
          role,
          employee_id,
          created_at,
          employee:employees!fk_user_employee(
            id,
            employee_id,
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: null, error };
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { data: null, error };
    }
  },

  // Update user profile
  updateUser: async (id, userData) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(userData)
        .eq('id', id)
        .select('*');

      if (error) throw error;

      // If no rows were updated, surface this as an error so callers know
      if (!data || data.length === 0) {
        const noRowError = new Error('No user_profile row found for the given id');
        console.error(noRowError);
        return { data: null, error: noRowError };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      return { data: null, error };
    }
  },

  // Update user role (admin only)
  updateUserRole: async (id, role) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { data: null, error };
    }
  },

  // Delete user (admin only) - This will also delete from auth.users via cascade
  deleteUser: async (id) => {
    try {
      // First delete the user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (profileError) throw profileError;

      // Then delete from auth (requires service role key in production)
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      
      if (authError) {
        console.warn('Could not delete from auth (requires admin privileges):', authError);
        // In production, you'd handle this via a server function
      }

      return { error: null };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { error };
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('role, created_at');

      if (usersError) throw usersError;

      const stats = {
        total: users.length,
        admins: users.filter(user => user.role === 'admin').length,
        hr: users.filter(user => user.role === 'hr').length,
        employees: users.filter(user => user.role === 'employee').length,
        recentSignups: users.filter(user => {
          const signupDate = new Date(user.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return signupDate > weekAgo;
        }).length
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return { data: null, error };
    }
  },

  // Check if current user is admin
  isCurrentUserAdmin: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAdmin: false, error: null };

      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return { isAdmin: data?.role === 'admin', error: null };
    } catch (error) {
      console.error('Error checking admin status:', error);
      return { isAdmin: false, error };
    }
  },

  // Invite new user (admin only)
  inviteUser: async (email, role = 'employee') => {
    try {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { role },
        redirectTo: `${window.location.origin}/signup`
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error inviting user:', error);
      return { data: null, error };
    }
  }
};

export default userService;
