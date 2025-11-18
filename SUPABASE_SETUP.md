# Supabase Setup Guide for Tassos ERP

## Prerequisites
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase

## Required Information
I need the following information from your Supabase project:

### 1. Project URL
- Go to your Supabase project dashboard
- Navigate to Settings → API
- Copy the "Project URL" (looks like: `https://your-project-id.supabase.co`)

### 2. Anonymous Key
- In the same API settings page
- Copy the "anon public" key (starts with `eyJ...`)

### 3. Service Role Key (Optional, for admin operations)
- Copy the "service_role" key (also starts with `eyJ...`)
- ⚠️ Keep this secret! Never expose in frontend code

## Setup Steps

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Environment Configuration
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:
```env
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the contents of `database/schema.sql` to create tables and policies
4. Optionally run `database/sample-data.sql` for test data

### 4. Authentication Setup
1. In Supabase dashboard, go to Authentication → Settings
2. Configure your site URL: `http://localhost:3000` (for development)
3. Add any additional redirect URLs you need

### 5. Row Level Security (RLS)
The schema includes RLS policies that:
- Allow all users to read departments and employee data
- Restrict employee modifications to HR/admin roles
- Allow users to see their own attendance/leave data
- Allow managers to see their team's data

## Database Schema Overview

### Tables Created:
- `departments` - Company departments
- `employees` - Employee information
- `attendance` - Daily attendance records
- `leave_requests` - Leave/vacation requests
- `user_profiles` - Extended user information

### Key Features:
- UUID primary keys for security
- Automatic timestamp tracking
- Row Level Security policies
- Foreign key relationships
- Enum types for consistent data

## Testing the Setup

1. Start your React app: `npm start`
2. Try registering a new user
3. Check if the user appears in Supabase Auth dashboard
4. Test employee creation through the Add Employee modal

## Next Steps After Setup

1. Update the AuthContext to use Supabase authentication
2. Replace mock data in components with real Supabase queries
3. Implement real-time subscriptions for live data updates
4. Add file upload for employee avatars/documents
5. Set up email templates for authentication

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure your site URL is configured in Supabase
2. **RLS Policies**: If data isn't showing, check RLS policies
3. **Environment Variables**: Ensure `.env.local` is not in `.gitignore`
4. **Database Permissions**: Make sure anon key has proper permissions

### Useful Supabase SQL Queries:
```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS policies
SELECT * FROM pg_policies;

-- View user profiles
SELECT * FROM user_profiles;

-- Check employee data
SELECT e.*, d.name as department_name FROM employees e 
LEFT JOIN departments d ON e.department_id = d.id;
```

## Security Notes
- Never commit your `.env.local` file
- Use environment variables for all sensitive data
- The anon key is safe to use in frontend (it's public)
- Service role key should only be used in backend/server functions
- RLS policies protect your data even with public keys
