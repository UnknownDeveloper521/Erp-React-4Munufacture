# Login & User Management Setup Guide

## ✅ What's Been Completed

### 🔐 Authentication System
- **Login Page**: Updated to work with Supabase authentication
- **Signup Page**: Updated with email verification support
- **AuthContext**: Fully integrated with Supabase auth
- **Session Management**: Automatic session handling and persistence

### 👥 User Management System
- **Users Module**: Admin-only module for managing system users
- **Role-Based Access**: Admin, HR, and Employee roles
- **User Service**: Complete CRUD operations for user management
- **Admin Controls**: Role assignment, user deletion, statistics

### 🛡️ Security Features
- **Row Level Security**: Database policies protect user data
- **Admin-Only Access**: Users module only visible to administrators
- **Role Verification**: Server-side role checking
- **Session Protection**: Automatic logout on session expiry

## 🚀 Testing Your Setup

### 1. Create Your First User
1. **Start the app**: `npm start`
2. **Go to Signup**: Click "Create Account" on login page
3. **Register**: Fill out the form with your details
4. **Check Email**: Look for Supabase verification email (may be in spam)
5. **Verify**: Click the verification link in the email

### 2. Make Yourself Admin
1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/jprqunpbtysaxpvqplfa
2. **Open SQL Editor**
3. **Run this query** (replace with your email):
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'your-email@example.com'
);
```
4. **Verify**: Check that the update worked:
```sql
SELECT up.first_name, up.last_name, up.role, au.email
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE up.role = 'admin';
```

### 3. Test Admin Features
1. **Logout and Login**: To refresh your session
2. **Check Sidebar**: You should now see "User Management" with red "Admin" badge
3. **Access Users Module**: Click on "User Management"
4. **View User Stats**: See total users, admins, employees
5. **Manage Roles**: Try changing user roles (create a test user first)

## 📊 Users Module Features

### 🔍 User Overview
- **User Statistics**: Total users, admins, employees, recent signups
- **User List**: Complete user directory with roles and details
- **Employee Linking**: Shows which users are linked to employee records

### ⚙️ Admin Controls
- **Role Management**: Change user roles (Admin, HR, Employee)
- **User Deletion**: Remove users from the system
- **User Editing**: Modify user profiles (coming soon)
- **User Invitation**: Invite new users (coming soon)

### 🛡️ Security Features
- **Access Control**: Only admins can access the Users module
- **Role Protection**: Users can't change their own role
- **Audit Trail**: Track user creation and modifications

## 🔧 Database Schema

### User-Related Tables
- **auth.users**: Supabase authentication (email, password, etc.)
- **user_profiles**: Extended user info (name, role, employee link)
- **employees**: Employee records (can be linked to users)

### Role Hierarchy
1. **Admin**: Full system access, user management
2. **HR**: Employee management, attendance, leave requests
3. **Employee**: Basic access, own data only

## 🚨 Important Notes

### Email Verification
- **Required**: Supabase requires email verification by default
- **Check Spam**: Verification emails often go to spam folder
- **Custom Domain**: You can configure custom email templates in Supabase

### Admin Setup
- **First User**: Must be manually promoted to admin via SQL
- **Security**: Keep admin accounts secure and limited
- **Backup**: Always have at least 2 admin users

### Role-Based Access
- **Automatic**: Sidebar modules show/hide based on user role
- **Server-Side**: All permissions are enforced in the database
- **Real-Time**: Role changes take effect immediately

## 🎯 Next Steps

### Immediate Testing
1. **Register** your first user account
2. **Verify** your email address
3. **Promote** yourself to admin via SQL
4. **Test** the Users module functionality

### Advanced Setup
1. **Create HR Users**: Add users with HR role for testing
2. **Link Employees**: Connect user accounts to employee records
3. **Test Permissions**: Verify role-based access works correctly
4. **Configure Email**: Set up custom email templates in Supabase

## 🔍 Troubleshooting

### Common Issues
1. **Can't see Users module**: Make sure you're an admin and logged in
2. **Email not verified**: Check spam folder, resend verification
3. **Role not updating**: Logout and login to refresh session
4. **Database errors**: Check Supabase logs in dashboard

### Useful SQL Queries
```sql
-- Check all users and roles
SELECT au.email, up.first_name, up.last_name, up.role 
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id;

-- Make someone admin
UPDATE user_profiles SET role = 'admin' WHERE id = 'user-uuid-here';

-- Check admin users
SELECT * FROM user_profiles WHERE role = 'admin';
```

## ✅ Success Checklist
- [ ] User registration works
- [ ] Email verification received and clicked
- [ ] Admin role assigned via SQL
- [ ] Users module visible in sidebar
- [ ] User statistics display correctly
- [ ] Role changes work properly
- [ ] Login/logout functions correctly

Your authentication and user management system is now fully functional! 🎉
