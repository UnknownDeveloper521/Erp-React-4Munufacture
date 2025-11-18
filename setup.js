#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Tassos ERP System...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required. Current version:', nodeVersion);
  console.log('📥 Please download the latest Node.js from: https://nodejs.org/');
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Creating .env.local from template...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env.local created successfully');
    console.log('⚠️  Please edit .env.local with your Supabase credentials');
  } else {
    console.log('⚠️  .env.example not found, creating basic .env.local...');
    const basicEnv = `# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Environment
REACT_APP_ENVIRONMENT=development
`;
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Basic .env.local created');
  }
} else {
  console.log('✅ .env.local already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Check if database folder exists
const dbPath = path.join(__dirname, 'database');
if (fs.existsSync(dbPath)) {
  console.log('✅ Database schemas found');
} else {
  console.log('⚠️  Database folder not found');
}

console.log('\n🎉 Setup completed successfully!\n');

console.log('📋 Next Steps:');
console.log('1. Edit .env.local with your Supabase credentials');
console.log('2. Create a Supabase project at https://supabase.com');
console.log('3. Run the database schema: database/master-tables-schema.sql');
console.log('4. Start the development server: npm start');

console.log('\n📚 Useful Commands:');
console.log('- npm start          # Start development server');
console.log('- npm run build      # Build for production');
console.log('- npm test           # Run tests');
console.log('- npm run lint       # Check code style');

console.log('\n📖 Documentation:');
console.log('- CONTRIBUTING.md    # Contribution guide');
console.log('- SUPABASE_SETUP.md  # Supabase setup guide');
console.log('- MASTER_TABLES_SETUP_GUIDE.md  # Database setup');

console.log('\n🆘 Need help? Check the documentation or create an issue on GitHub.');
console.log('\nHappy coding! 🚀');
