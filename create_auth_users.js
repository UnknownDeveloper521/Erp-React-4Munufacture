// Script to create Supabase Auth users for all employees
// Run this in your browser console or as a Node.js script after setting up Supabase client

// You'll need to run this with admin privileges or use Supabase CLI
// This is a reference script - adapt it to your needs

const employees = [
  { email: 'rajesh.kumar@tassosconsultancy.com', firstName: 'Rajesh', lastName: 'Kumar' },
  { email: 'priya.sharma@tassosconsultancy.com', firstName: 'Priya', lastName: 'Sharma' },
  { email: 'amit.patel@tassosconsultancy.com', firstName: 'Amit', lastName: 'Patel' },
  { email: 'sneha.reddy@tassosconsultancy.com', firstName: 'Sneha', lastName: 'Reddy' },
  { email: 'vikram.singh@tassosconsultancy.com', firstName: 'Vikram', lastName: 'Singh' },
  { email: 'kavya.nair@tassosconsultancy.com', firstName: 'Kavya', lastName: 'Nair' },
  { email: 'rohit.gupta@tassosconsultancy.com', firstName: 'Rohit', lastName: 'Gupta' },
  { email: 'meera.joshi@tassosconsultancy.com', firstName: 'Meera', lastName: 'Joshi' },
  { email: 'arjun.menon@tassosconsultancy.com', firstName: 'Arjun', lastName: 'Menon' },
  { email: 'pooja.agarwal@tassosconsultancy.com', firstName: 'Pooja', lastName: 'Agarwal' },
  { email: 'karan.malhotra@tassosconsultancy.com', firstName: 'Karan', lastName: 'Malhotra' },
  { email: 'deepika.iyer@tassosconsultancy.com', firstName: 'Deepika', lastName: 'Iyer' },
  { email: 'rahul.verma@tassosconsultancy.com', firstName: 'Rahul', lastName: 'Verma' },
  { email: 'ananya.das@tassosconsultancy.com', firstName: 'Ananya', lastName: 'Das' },
  { email: 'siddharth.chopra@tassosconsultancy.com', firstName: 'Siddharth', lastName: 'Chopra' },
  { email: 'ritu.bhatt@tassosconsultancy.com', firstName: 'Ritu', lastName: 'Bhatt' },
  { email: 'aarav.jain@tassosconsultancy.com', firstName: 'Aarav', lastName: 'Jain' },
  { email: 'ishita.bansal@tassosconsultancy.com', firstName: 'Ishita', lastName: 'Bansal' },
  { email: 'nikhil.rao@tassosconsultancy.com', firstName: 'Nikhil', lastName: 'Rao' },
  { email: 'divya.pillai@tassosconsultancy.com', firstName: 'Divya', lastName: 'Pillai' }
];

// Function to create users using Supabase Admin API
async function createEmployeeUsers() {
  // You need to import and configure Supabase with service role key
  // import { createClient } from '@supabase/supabase-js'
  // const supabase = createClient(url, serviceRoleKey)
  
  console.log('Creating Supabase Auth users for employees...');
  console.log('Password format: [firstName]@123');
  console.log('');
  
  for (const employee of employees) {
    const password = `${employee.firstName.toLowerCase()}@123`;
    
    try {
      // This requires service role key and admin privileges
      const { data, error } = await supabase.auth.admin.createUser({
        email: employee.email,
        password: password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name: employee.firstName,
          last_name: employee.lastName,
          full_name: `${employee.firstName} ${employee.lastName}`
        }
      });
      
      if (error) {
        console.error(`❌ Failed to create user ${employee.email}:`, error.message);
      } else {
        console.log(`✅ Created user: ${employee.email} | Password: ${password}`);
      }
    } catch (err) {
      console.error(`❌ Error creating user ${employee.email}:`, err.message);
    }
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('');
  console.log('🎉 User creation process completed!');
  console.log('');
  console.log('📋 Login Credentials Summary:');
  console.log('================================');
  
  employees.forEach(employee => {
    const password = `${employee.firstName.toLowerCase()}@123`;
    console.log(`${employee.firstName} ${employee.lastName}: ${employee.email} | ${password}`);
  });
}

// Alternative: Manual user creation commands for Supabase CLI
function generateSupabaseCLICommands() {
  console.log('Supabase CLI Commands to create users:');
  console.log('=====================================');
  console.log('');
  
  employees.forEach(employee => {
    const password = `${employee.firstName.toLowerCase()}@123`;
    console.log(`supabase auth users create ${employee.email} --password "${password}"`);
  });
}

// Alternative: SQL commands for manual insertion (if you have direct DB access)
function generateSQLCommands() {
  console.log('SQL Commands for manual user creation:');
  console.log('====================================');
  console.log('-- Note: This is for reference only. Use Supabase Auth API instead.');
  console.log('');
  
  employees.forEach(employee => {
    const password = `${employee.firstName.toLowerCase()}@123`;
    console.log(`-- User: ${employee.firstName} ${employee.lastName}`);
    console.log(`-- Email: ${employee.email}`);
    console.log(`-- Password: ${password}`);
    console.log('');
  });
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createEmployeeUsers,
    generateSupabaseCLICommands,
    generateSQLCommands,
    employees
  };
}

// If running in browser console, you can call:
// createEmployeeUsers() - requires Supabase client setup
// generateSupabaseCLICommands() - shows CLI commands
// generateSQLCommands() - shows reference SQL

console.log('🔐 Employee Auth Users Script Loaded');
console.log('');
console.log('Available functions:');
console.log('- createEmployeeUsers() - Create users via Supabase API');
console.log('- generateSupabaseCLICommands() - Show CLI commands');
console.log('- generateSQLCommands() - Show reference SQL');
console.log('');
console.log('📝 All passwords follow format: [firstName]@123');
console.log('Example: rajesh@123, priya@123, amit@123, etc.');
