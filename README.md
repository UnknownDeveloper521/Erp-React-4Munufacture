# Tassos ERP System

A modern Enterprise Resource Planning (ERP) system built with React and Supabase, featuring role-based access control and comprehensive HR management.

## ✨ Features

### **🔐 Authentication & Security**
- Supabase authentication with role-based access control
- Admin, HR, and Employee role management
- Secure user profile management

### **👥 HR Management**
- Complete employee lifecycle management
- Master data-driven forms (departments, positions, employee types)
- Automatic user account creation with generated passwords
- Employee directory with advanced filtering

### **🏢 Master Data Management**
- Departments with hierarchy support
- Position levels and salary ranges
- Employment status tracking
- Work locations and shift types

### **🎨 Modern UI/UX**
- Built with TailwindCSS and Lucide React icons
- Responsive design for all devices
- Intuitive navigation and user experience

## 🚀 Quick Start

### **Option 1: Automated Setup (Recommended)**

```bash
# Clone the repository
git clone https://github.com/your-username/ERP-React.git
cd ERP-React

# Run automated setup
npm install
npm run setup

# Follow the prompts to configure your environment
```

### **Option 2: Manual Setup**

```bash
# Clone and install
git clone https://github.com/your-username/ERP-React.git
cd ERP-React
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# Then start the development server
npm start
```

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Supabase Account** - [Sign up](https://supabase.com/)

## 🔧 Configuration

### **1. Supabase Setup**
1. Create a new project at [supabase.com](https://supabase.com/)
2. Get your project URL and anon key from Settings > API
3. Add them to `.env.local`:
   ```env
   REACT_APP_SUPABASE_URL=your_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   ```

### **2. Database Setup**
Run the database schema in Supabase SQL Editor:
```sql
-- Copy and paste: database/master-tables-schema.sql
```

## 📚 Available Scripts

- `npm start` - Start development server
- `npm run setup` - Run automated project setup
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues
- `npm run dev` - Alias for npm start

## 📁 Project Structure

```
ERP-React/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── MainLayout.js    # Main application layout
│   │   ├── Sidebar.js       # Navigation sidebar
│   │   ├── DynamicNavbar.js # Dynamic navigation bar
│   │   ├── PrivateRoute.js  # Route protection
│   │   └── AddEmployeeModalEnhanced.js  # Employee creation modal
│   ├── modules/             # Feature modules
│   │   ├── HRModuleEnhanced.js    # HR management
│   │   ├── UsersModule.js         # User management
│   │   └── DashboardModule.js     # Dashboard overview
│   ├── services/            # API services
│   │   ├── authService.js         # Authentication
│   │   ├── employeeService.js     # Employee management
│   │   ├── userService.js         # User management
│   │   └── masterDataService.js   # Master data operations
│   ├── contexts/            # React contexts
│   │   └── AuthContext.js         # Authentication state
│   ├── lib/                 # Utilities and configurations
│   │   └── supabase.js            # Supabase client
│   └── pages/               # Page components
│       ├── Login.js               # Login page
│       └── Signup.js              # Signup page
├── database/                # Database schemas and scripts
│   ├── master-tables-schema.sql   # Complete database setup
│   └── safe-fix-relationships.sql # Relationship fixes
├── docs/                    # Documentation
│   ├── CONTRIBUTING.md            # Contribution guide
│   ├── SUPABASE_SETUP.md          # Supabase setup guide
│   └── MASTER_TABLES_SETUP_GUIDE.md  # Database guide
├── .env.example             # Environment template
├── setup.js                 # Automated setup script
└── package.json             # Dependencies and scripts
```

## 🎯 Module Status

- ✅ **Authentication** - Complete with role-based access
- ✅ **Human Resources** - Employee management with master data
- ✅ **User Management** - Admin user control
- ⏳ **Inventory Management** - Coming soon
- ⏳ **Financial Management** - Coming soon
- ⏳ **Customer Relationship** - Coming soon
- ⏳ **Sales & Orders** - Coming soon

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### **Quick Contribution Steps:**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📖 Documentation

- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Supabase Setup](SUPABASE_SETUP.md)** - Database configuration
- **[Master Tables Guide](MASTER_TABLES_SETUP_GUIDE.md)** - Database schema setup

## 🐛 Troubleshooting

### **Common Issues:**
- **Environment variables not loading**: Ensure file is named `.env.local`
- **Database errors**: Run `database/safe-fix-relationships.sql`
- **Build failures**: Delete `node_modules` and run `npm install`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** - UI framework
- **Supabase** - Backend and authentication
- **TailwindCSS** - Styling framework
- **Lucide React** - Icon library

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/ERP-React/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ERP-React/discussions)
- **Documentation**: Check the `/docs` folder

---

**Made with ❤️ for modern businesses**
