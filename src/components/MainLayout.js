import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import DynamicNavbar from './DynamicNavbar';
import AddEmployeeModalEnhanced from './AddEmployeeModalEnhanced';
import DashboardModule from '../modules/DashboardModule';
import HRModuleEnhanced from '../modules/HRModuleEnhanced';
import UsersModule from '../modules/UsersModule';
import InventoryModule from '../modules/InventoryModule';
import { employeeService } from '../services/employeeService';

const MainLayout = () => {
  const { logout } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNavAction = (action, data) => {
    console.log('Nav action:', action, data);
    // Handle different navbar actions
    switch (action) {
      case 'add-employee':
        setIsAddEmployeeModalOpen(true);
        break;
      case 'view-employees':
      case 'employee-directory':
        setActiveView('employees');
        break;
      case 'attendance-overview':
      case 'time-tracking':
        setActiveView('attendance-overview');
        break;
      case 'leave-requests':
        setActiveView('leave-requests');
        break;
      case 'salary-management':
      case 'payroll-processing':
      case 'tax-management':
      case 'payroll-reports':
        setActiveView(action);
        break;
      case 'performance-reviews':
      case 'goal-management':
      case 'training-programs':
      case 'performance-analytics':
        setActiveView(action);
        break;
      case 'search':
        console.log('Searching for:', data);
        break;
      case 'logout':
        logout();
        break;
      case 'refresh':
        if (activeModule === 'dashboard' && window.refreshDashboardData) {
          window.refreshDashboardData();
        } else if (activeModule === 'hr' && window.refreshHRData) {
          window.refreshHRData();
        } else {
          console.log('Refresh action with no handler for module:', activeModule);
        }
        break;
      case 'admin-users':
        if (activeModule !== 'users') {
          setActiveModule('users');
          setActiveView('users');
        }
        break;
      case 'admin-invite':
        if (activeModule !== 'users') {
          setActiveModule('users');
          setActiveView('users');
        }
        if (window.openInviteUserModal) {
          window.openInviteUserModal();
        }
        break;
      // Inventory actions
      case 'inventory-dashboard':
        setActiveView('dashboard');
        break;
      case 'inventory-stock':
        setActiveView('stock');
        break;
      case 'inventory-transfers':
      case 'inventory-create-transfer':
      case 'inventory-pending-transfers':
        setActiveView('transfers');
        break;
      case 'inventory-adjustments':
      case 'inventory-create-adjustment':
      case 'inventory-adjustment-history':
        setActiveView('adjustments');
        break;
      case 'inventory-reordering':
      case 'inventory-low-stock':
      case 'inventory-purchase-orders':
        setActiveView('reordering');
        break;
      case 'inventory-reports':
      case 'inventory-stock-levels':
      case 'inventory-movements':
      case 'inventory-valuation':
        setActiveView('reports');
        break;
      case 'inventory-search':
        console.log('Searching inventory:', data);
        break;
      case 'inventory-add-item':
        alert('Add item functionality coming soon!');
        break;
      case 'inventory-export':
        alert('Export functionality coming soon!');
        break;
      default:
        alert(`${action} functionality coming soon!`);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      console.log('Adding employee:', employeeData);
      
      // The enhanced modal already provides data in the correct format
      // Just ensure required fields are present
      const dbEmployeeData = {
        ...employeeData,
        // Convert empty strings to null for optional fields
        phone: employeeData.phone || null,
        date_of_birth: employeeData.date_of_birth || null,
        gender: employeeData.gender || null,
        address: employeeData.address || null,
        city: employeeData.city || null,
        state: employeeData.state || null,
        postal_code: employeeData.postal_code || null,
        country: employeeData.country || null,
        work_location_id: employeeData.work_location_id || null,
        shift_type_id: employeeData.shift_type_id || null,
        manager_id: employeeData.manager_id || null,
        probation_end_date: employeeData.probation_end_date || null,
        confirmation_date: employeeData.confirmation_date || null
      };

      const { data, error, userError, password } = await employeeService.createWithUser(dbEmployeeData);
      
      if (error) {
        alert(`Error adding employee: ${error.message}`);
        return;
      }

      let message = 'Employee added successfully!';
      
      if (userError) {
        message += `\n\nNote: Employee created but user account creation failed: ${userError.message}`;
      } else if (password) {
        message += `\n\nUser account created with password: ${password}`;
        message += `\nPlease share these credentials with the employee.`;
      }

      alert(message);
      setIsAddEmployeeModalOpen(false);
      
      // Refresh the HR module if it's active
      if (activeModule === 'hr' && window.refreshHRData) {
        window.refreshHRData();
      }
      
    } catch (error) {
      console.error('Error adding employee:', error);
      alert(`Error adding employee: ${error.message}`);
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'hr':
        return <HRModuleEnhanced activeView={activeView} />;
      case 'users':
        return <UsersModule />;
      case 'inventory':
        return <InventoryModule activeView={activeView} />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isMobile ? 'hidden' : 'block'}`}>
        <Sidebar 
          activeModule={activeModule} 
          onModuleChange={(module) => {
            setActiveModule(module);
            setActiveView(module); // Reset view when switching modules
          }}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile Header - Show sidebar content on mobile */}
        {isMobile && (
          <div className="bg-white shadow-sm border-b px-4 py-3 lg:hidden flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Tassos ERP</h1>
              <p className="text-sm text-gray-600">Tap menu to navigate modules</p>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Menu
            </button>
          </div>
        )}
        
        <div className="flex flex-col h-full">
          <DynamicNavbar 
            activeModule={activeModule} 
            onNavAction={handleNavAction}
          />
          <div className="flex-1 overflow-y-auto">
            {renderModule()}
          </div>
        </div>
      </div>
      
      {/* Add Employee Modal */}
      <AddEmployeeModalEnhanced
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        onSubmit={handleAddEmployee}
      />

      {/* Mobile sidebar overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-50">
            <Sidebar
              activeModule={activeModule}
              onModuleChange={(module) => {
                setActiveModule(module);
                setActiveView(module);
                setIsMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
