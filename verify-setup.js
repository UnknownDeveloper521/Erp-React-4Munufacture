#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Tassos ERP setup...\n');

const checks = [
  {
    name: 'Node.js version',
    check: () => {
      const version = process.version;
      const major = parseInt(version.slice(1).split('.')[0]);
      return { 
        passed: major >= 16, 
        message: major >= 16 ? `✅ ${version}` : `❌ ${version} (requires v16+)` 
      };
    }
  },
  {
    name: 'package.json exists',
    check: () => {
      const exists = fs.existsSync(path.join(__dirname, 'package.json'));
      return { 
        passed: exists, 
        message: exists ? '✅ Found' : '❌ Missing' 
      };
    }
  },
  {
    name: 'node_modules installed',
    check: () => {
      const exists = fs.existsSync(path.join(__dirname, 'node_modules'));
      return { 
        passed: exists, 
        message: exists ? '✅ Dependencies installed' : '❌ Run npm install' 
      };
    }
  },
  {
    name: 'Environment file',
    check: () => {
      const envLocal = fs.existsSync(path.join(__dirname, '.env.local'));
      const envExample = fs.existsSync(path.join(__dirname, '.env.example'));
      
      if (envLocal) {
        return { passed: true, message: '✅ .env.local found' };
      } else if (envExample) {
        return { passed: false, message: '⚠️  Copy .env.example to .env.local' };
      } else {
        return { passed: false, message: '❌ No environment files found' };
      }
    }
  },
  {
    name: 'Database schemas',
    check: () => {
      const dbDir = path.join(__dirname, 'database');
      const masterSchema = fs.existsSync(path.join(dbDir, 'master-tables-schema.sql'));
      
      if (masterSchema) {
        return { passed: true, message: '✅ Database schemas found' };
      } else {
        return { passed: false, message: '❌ Database schemas missing' };
      }
    }
  },
  {
    name: 'Source files',
    check: () => {
      const srcDir = path.join(__dirname, 'src');
      const appJs = fs.existsSync(path.join(srcDir, 'App.js'));
      const components = fs.existsSync(path.join(srcDir, 'components'));
      const modules = fs.existsSync(path.join(srcDir, 'modules'));
      
      if (appJs && components && modules) {
        return { passed: true, message: '✅ Source structure complete' };
      } else {
        return { passed: false, message: '❌ Source files incomplete' };
      }
    }
  }
];

let allPassed = true;

checks.forEach(({ name, check }) => {
  const result = check();
  console.log(`${name.padEnd(20)} ${result.message}`);
  if (!result.passed) allPassed = false;
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 Setup verification passed!');
  console.log('\n📋 Next steps:');
  console.log('1. Configure .env.local with Supabase credentials');
  console.log('2. Set up Supabase database with provided schemas');
  console.log('3. Run: npm start');
} else {
  console.log('⚠️  Setup verification found issues.');
  console.log('\n🔧 To fix issues:');
  console.log('- Run: npm install (if dependencies missing)');
  console.log('- Run: npm run setup (for automated setup)');
  console.log('- Check: CONTRIBUTING.md for detailed setup guide');
}

console.log('\n📚 Documentation:');
console.log('- README.md - Project overview');
console.log('- CONTRIBUTING.md - Setup and contribution guide');
console.log('- SUPABASE_SETUP.md - Database configuration');

console.log('\n🆘 Need help? Create an issue on GitHub.');
