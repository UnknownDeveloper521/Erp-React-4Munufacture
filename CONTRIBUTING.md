# Contributing to Tassos ERP System

Welcome! This guide will help you set up the project locally and start contributing.

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Supabase Account** - [Sign up here](https://supabase.com/)

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/ERP-React.git
cd ERP-React
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your Supabase credentials** in `.env.local`:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### **4. Database Setup**
1. **Create a new Supabase project** at [supabase.com](https://supabase.com/)
2. **Run the database schema** in Supabase SQL Editor:
   ```sql
   -- Copy and paste the contents of database/master-tables-schema.sql
   ```
3. **Optional: Run relationship fixes** if needed:
   ```sql
   -- Copy and paste the contents of database/safe-fix-relationships.sql
   ```

### **5. Start Development Server**
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📋 Project Structure

```
ERP-React/
├── src/
│   ├── components/          # Reusable UI components
│   ├── modules/            # Feature modules (HR, Users, etc.)
│   ├── services/           # API services
│   ├── contexts/           # React contexts
│   └── lib/               # Utilities and configurations
├── database/              # Database schemas and scripts
├── public/               # Static assets
└── docs/                # Documentation files
```

## 🔧 Development Workflow

### **Available Scripts**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### **Making Changes**
1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test thoroughly

3. **Commit with descriptive messages:**
   ```bash
   git add .
   git commit -m "feat: add employee management feature"
   ```

4. **Push and create a Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🏗️ Key Features

### **Authentication System**
- Supabase Auth integration
- Role-based access control (Admin, HR, Employee)
- User profile management

### **HR Module**
- Employee management with master data
- Department and position hierarchies
- Employee creation with automatic user accounts

### **Master Data Management**
- Departments, Positions, Employee Types
- Employment Status, Work Locations, Shift Types
- Dropdown-driven forms for data consistency

## 🔍 Testing

### **Manual Testing Checklist**
- [ ] Login/Signup functionality
- [ ] HR Module loads without errors
- [ ] Employee creation works
- [ ] User Management (admin only)
- [ ] Master data dropdowns populate correctly

### **Test Accounts**
After setting up the database, create test accounts:
1. **Admin User** - Full access to all modules
2. **HR User** - Access to HR module
3. **Employee User** - Limited access

## 🐛 Troubleshooting

### **Common Issues**

#### **"Column employees.status does not exist"**
- **Solution**: Run `database/safe-fix-relationships.sql`
- **Cause**: Old database structure

#### **"Could not find relationship between tables"**
- **Solution**: Run the full `database/master-tables-schema.sql`
- **Cause**: Missing foreign key relationships

#### **Environment Variables Not Loading**
- **Check**: File is named `.env.local` (not `.env`)
- **Check**: Variables start with `REACT_APP_`
- **Restart**: Development server after changes

#### **Supabase Connection Issues**
- **Verify**: URL and keys are correct
- **Check**: Project is not paused in Supabase dashboard
- **Ensure**: RLS policies allow access

## 📚 Useful Resources

- **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com/)
- **React Documentation**: [reactjs.org](https://reactjs.org/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)
- **Lucide Icons**: [lucide.dev](https://lucide.dev/)

## 🤝 Code Standards

### **Code Style**
- Use **functional components** with hooks
- Follow **ESLint** rules (run `npm run lint`)
- Use **Tailwind CSS** for styling
- Add **PropTypes** for component props

### **Naming Conventions**
- **Components**: PascalCase (`UserProfile.js`)
- **Services**: camelCase (`userService.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

### **Commit Messages**
Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests

## 📞 Getting Help

- **Issues**: Create a GitHub issue
- **Questions**: Start a GitHub discussion
- **Documentation**: Check the `/docs` folder

## 🎯 Contribution Areas

We welcome contributions in:
- **Bug fixes** and improvements
- **New features** and modules
- **Documentation** improvements
- **Testing** and quality assurance
- **UI/UX** enhancements

Thank you for contributing to the Tassos ERP System! 🎉
