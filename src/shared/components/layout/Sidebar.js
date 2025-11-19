import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { userService } from '../../../modules/users/services';
import { 
  Home,
  Users, 
  Package, 
  DollarSign, 
  FileText, 
  BarChart3, 
  Calendar,
  Truck,
  ShoppingCart,
  Building2,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  // Determine active module from current path
  const getActiveModuleFromPath = (pathname) => {
    const pathParts = pathname.split('/').filter(Boolean);
    return pathParts.length > 0 ? pathParts[0] : 'dashboard';
  };

  const activeModule = getActiveModuleFromPath(location.pathname);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { isAdmin } = await userService.isCurrentUserAdmin();
        setIsAdmin(isAdmin);
      }
    };
    checkAdminStatus();
  }, [user]);

  const modules = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      color: 'text-blue-600',
      comingSoon: false
    },
    {
      id: 'hr',
      name: 'Human Resources',
      icon: Users,
      color: 'text-blue-600',
      comingSoon: false
    },
    {
      id: 'users',
      name: 'User Management',
      icon: Shield,
      color: 'text-red-600',
      comingSoon: false,
      adminOnly: true
    },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: Package,
      color: 'text-green-600',
      comingSoon: false
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: DollarSign,
      color: 'text-yellow-600',
      comingSoon: true
    },
    {
      id: 'crm',
      name: 'Customer Relations',
      icon: Building2,
      color: 'text-purple-600',
      comingSoon: true
    },
    {
      id: 'sales',
      name: 'Sales & Orders',
      icon: ShoppingCart,
      color: 'text-red-600',
      comingSoon: true
    },
    {
      id: 'supply',
      name: 'Supply Chain',
      icon: Truck,
      color: 'text-indigo-600',
      comingSoon: true
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: BarChart3,
      color: 'text-pink-600',
      comingSoon: true
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: FileText,
      color: 'text-teal-600',
      comingSoon: true
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: Calendar,
      color: 'text-orange-600',
      comingSoon: true
    }
  ];

  const handleModuleClick = (module) => {
    if (module.comingSoon && module.id !== 'dashboard') {
      alert(`${module.name} module is coming soon!`);
    } else {
      navigate(`/${module.id}`);
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/assets/images/logos/logo.png" 
            alt="Tassos ERP Logo" 
            className="h-10 w-auto"
          />
          <div>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3">
          {modules.map((module) => {
            // Hide admin-only modules for non-admin users
            if (module.adminOnly && !isAdmin) {
              return null;
            }

            const IconComponent = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <div key={module.id}>
                <button
                  onClick={() => handleModuleClick(module)}
                  className={`w-full flex items-center px-3 py-2.5 mb-1 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent 
                    className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700' : module.color}`} 
                  />
                  <span className="font-medium">{module.name}</span>
                  {module.comingSoon && module.id !== 'dashboard' && (
                    <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                  {module.adminOnly && (
                    <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Tassos ERP System
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
