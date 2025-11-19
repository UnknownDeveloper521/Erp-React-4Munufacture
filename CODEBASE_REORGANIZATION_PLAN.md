# ERP Application Codebase Reorganization Plan

## Current Structure Issues
- All modules in single `modules/` folder
- Mixed components in `components/` folder (shared + module-specific)
- Services not organized by module
- No clear separation of concerns
- Difficult to scale for new modules

## New Proposed Structure

```
src/
├── App.js
├── index.js
├── index.css
├── 
├── shared/                          # Shared across all modules
│   ├── components/                  # Reusable UI components
│   │   ├── ui/                     # Basic UI components
│   │   │   ├── Button.js
│   │   │   ├── Modal.js
│   │   │   ├── Input.js
│   │   │   └── index.js
│   │   ├── layout/                 # Layout components
│   │   │   ├── MainLayout.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Navbar.js
│   │   │   └── index.js
│   │   └── common/                 # Common business components
│   │       ├── PrivateRoute.js
│   │       ├── ProfileMenu.js
│   │       └── index.js
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useLocalStorage.js
│   │   └── index.js
│   ├── utils/                      # Utility functions
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   ├── constants.js
│   │   └── index.js
│   └── services/                   # Shared services
│       ├── api.js
│       ├── auth.js
│       └── index.js
├── 
├── modules/                        # Feature modules
│   ├── dashboard/
│   │   ├── index.js               # Module entry point
│   │   ├── DashboardModule.js     # Main module component
│   │   ├── components/            # Dashboard-specific components
│   │   │   ├── StatsCard.js
│   │   │   ├── ChartWidget.js
│   │   │   └── index.js
│   │   └── hooks/                 # Dashboard-specific hooks
│   │       └── useDashboardData.js
│   │
│   ├── hr/
│   │   ├── index.js               # Module entry point
│   │   ├── HRModule.js            # Main module component
│   │   ├── components/            # HR-specific components
│   │   │   ├── EmployeeList.js
│   │   │   ├── AddEmployeeModal.js
│   │   │   ├── AttendanceView.js
│   │   │   ├── LeaveRequestView.js
│   │   │   ├── PayrollView.js
│   │   │   ├── PerformanceView.js
│   │   │   └── index.js
│   │   ├── services/              # HR-specific services
│   │   │   ├── employeeService.js
│   │   │   ├── attendanceService.js
│   │   │   └── index.js
│   │   └── hooks/                 # HR-specific hooks
│   │       ├── useEmployees.js
│   │       └── useAttendance.js
│   │
│   ├── inventory/
│   │   ├── index.js
│   │   ├── InventoryModule.js
│   │   ├── components/
│   │   │   ├── StockView.js
│   │   │   ├── TransfersView.js
│   │   │   ├── AdjustmentsView.js
│   │   │   ├── ReportsView.js
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── inventoryService.js
│   │   │   └── index.js
│   │   └── hooks/
│   │       └── useInventory.js
│   │
│   ├── users/
│   │   ├── index.js
│   │   ├── UsersModule.js
│   │   ├── components/
│   │   │   ├── UserList.js
│   │   │   ├── InviteUserModal.js
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── userService.js
│   │   │   └── index.js
│   │   └── hooks/
│   │       └── useUsers.js
│   │
│   └── [future-modules]/          # Template for new modules
│       ├── index.js
│       ├── ModuleName.js
│       ├── components/
│       ├── services/
│       └── hooks/
│
├── pages/                         # Route-level page components
│   ├── auth/
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── index.js
│   ├── profile/
│   │   ├── ViewProfile.js
│   │   ├── AccountSettings.js
│   │   ├── ChangePassword.js
│   │   └── index.js
│   └── index.js
│
├── contexts/                      # React contexts
│   ├── AuthContext.js
│   └── index.js
│
└── lib/                          # External library configurations
    ├── supabase.js
    └── index.js
```

## Migration Steps

### Phase 1: Create New Structure
1. ✅ Create new folder structure
2. Create index files for clean imports
3. Move shared components to `shared/components/`
4. Move layout components to `shared/components/layout/`

### Phase 2: Reorganize Modules
1. Move dashboard module to `modules/dashboard/`
2. Break down HR module into components
3. Reorganize inventory module
4. Reorganize users module

### Phase 3: Organize Services
1. Move shared services to `shared/services/`
2. Move module-specific services to respective module folders
3. Create service index files

### Phase 4: Update Imports
1. Update all import paths throughout the codebase
2. Create barrel exports (index.js files)
3. Test all imports work correctly

### Phase 5: Pages Organization
1. Move auth pages to `pages/auth/`
2. Move profile pages to `pages/profile/`
3. Update routing imports

## Benefits of New Structure

### 1. Scalability
- Easy to add new modules
- Clear separation of concerns
- Modular architecture

### 2. Maintainability
- Related code grouped together
- Easy to find components/services
- Consistent structure across modules

### 3. Developer Experience
- Clear import paths
- Barrel exports for clean imports
- Self-documenting structure

### 4. Team Collaboration
- Clear ownership boundaries
- Easy to work on different modules simultaneously
- Reduced merge conflicts

## Module Template

Each new module should follow this structure:

```javascript
// modules/[module-name]/index.js
export { default } from './ModuleName';
export * from './components';
export * from './services';
export * from './hooks';

// modules/[module-name]/ModuleName.js
import React from 'react';
import { ComponentA, ComponentB } from './components';

const ModuleName = ({ activeView }) => {
  // Module logic here
  return (
    <div>
      {/* Module content */}
    </div>
  );
};

export default ModuleName;

// modules/[module-name]/components/index.js
export { default as ComponentA } from './ComponentA';
export { default as ComponentB } from './ComponentB';
```

## Import Examples

### Before (Current)
```javascript
import DashboardModule from '../modules/DashboardModule';
import HRModuleEnhanced from '../modules/HRModuleEnhanced';
import { employeeService } from '../services/employeeService';
import MainLayout from '../components/MainLayout';
```

### After (New Structure)
```javascript
import { DashboardModule } from '../modules/dashboard';
import { HRModule } from '../modules/hr';
import { employeeService } from '../modules/hr/services';
import { MainLayout } from '../shared/components/layout';
```

## Implementation Priority

1. **High Priority**: Fix compilation errors and basic structure
2. **Medium Priority**: Move modules and update imports
3. **Low Priority**: Create hooks and utility functions
4. **Future**: Add TypeScript support and better tooling
