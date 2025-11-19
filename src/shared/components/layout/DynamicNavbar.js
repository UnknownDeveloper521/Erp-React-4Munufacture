import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ProfileMenu } from '../common';
import { 
  ChevronDown, 
  Users, 
  UserPlus, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  FileText, 
  Settings,
  Search,
  Bell,
  Download,
  Upload,
  Key,
  RefreshCw,
  Package,
  Home,
  Plus,
  ArrowRightLeft,
  Edit,
  ShoppingCart,
  BarChart3,
  Lock
} from 'lucide-react';

const DynamicNavbar = ({ activeModule, onNavAction }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleMouseEnter = (dropdownId) => {
    setActiveDropdown(dropdownId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleAction = (action, data = null) => {
    onNavAction(action, data);
    setActiveDropdown(null);
    setShowNotifications(false);
  };

  const renderDashboardNavbar = () => {
    const notifications = [
      { id: 1, title: 'New employee added', time: 'Just now' },
      { id: 2, title: 'Payroll run completed', time: '10 min ago' },
      { id: 3, title: 'System backup successful', time: '1 hour ago' },
    ];

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between sm:justify-start space-x-6">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <button 
            onClick={() => handleAction('refresh')}
            className="p-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-full"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <div className="relative">
            <button 
              className="p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowNotifications(prev => !prev)}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((item) => (
                    <div key={item.id} className="px-4 py-3 border-b border-gray-50 last:border-b-0">
                      <p className="text-sm text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Profile Menu */}
          <ProfileMenu onAction={handleAction} />
        </div>
      </div>
    );
  };

  const renderHRNavbar = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center justify-between sm:justify-start space-x-6">
        <h2 className="text-xl font-semibold text-gray-900">Human Resources</h2>
        
        {/* Employee Management Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('employees')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <Users className="w-4 h-4 mr-2" />
            Employees
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'employees' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handleAction('view-employees')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Users className="w-4 h-4 mr-3" />
                  View All Employees
                </button>
                <button
                  onClick={() => handleAction('add-employee')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserPlus className="w-4 h-4 mr-3" />
                  Add New Employee
                </button>
                <button
                  onClick={() => handleAction('employee-directory')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Employee Directory
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleAction('bulk-import')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Upload className="w-4 h-4 mr-3" />
                  Bulk Import
                </button>
                <button
                  onClick={() => handleAction('export-employees')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="w-4 h-4 mr-3" />
                  Export Data
                </button>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Attendance & Leave Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('attendance')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Attendance & Leave
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'attendance' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handleAction('attendance-overview')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Attendance Overview
                </button>
                <button
                  onClick={() => handleAction('leave-requests')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserCheck className="w-4 h-4 mr-3" />
                  Leave Requests
                </button>
                <button
                  onClick={() => handleAction('time-tracking')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Time Tracking
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleAction('attendance-reports')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Attendance Reports
                </button>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Payroll Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('payroll')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Payroll
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'payroll' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handleAction('salary-management')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <DollarSign className="w-4 h-4 mr-3" />
                  Salary Management
                </button>
                <button
                  onClick={() => handleAction('payroll-processing')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Payroll Processing
                </button>
                <button
                  onClick={() => handleAction('tax-management')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Tax Management
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleAction('payroll-reports')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="w-4 h-4 mr-3" />
                  Payroll Reports
                </button>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Performance & Training Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('performance')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Performance
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'performance' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handleAction('performance-reviews')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserCheck className="w-4 h-4 mr-3" />
                  Performance Reviews
                </button>
                <button
                  onClick={() => handleAction('goal-management')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Goal Management
                </button>
                <button
                  onClick={() => handleAction('training-programs')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Training Programs
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleAction('performance-analytics')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Performance Analytics
                </button>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search employees..."
            className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => handleAction('hr-search', e.target.value)}
          />
        </div>

        {/* Profile Menu */}
        <ProfileMenu onAction={handleAction} />
      </div>
    </div>
  );

  const renderUsersNavbar = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center justify-between sm:justify-start space-x-6">
        <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>

        {/* Users Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('admin-users')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <Users className="w-4 h-4 mr-2" />
            Users
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'admin-users' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => handleAction('admin-users')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Users className="w-4 h-4 mr-3" />
                    User Management
                  </button>
                  <button
                    onClick={() => handleAction('admin-invite')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserPlus className="w-4 h-4 mr-3" />
                    Invite User
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('admin-security')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Security
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'admin-security' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => handleAction('admin-roles')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Key className="w-4 h-4 mr-3" />
                    Roles & Permissions
                  </button>
                  <button
                    onClick={() => handleAction('admin-access')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Lock className="w-4 h-4 mr-3" />
                    Access Control
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('admin-system')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            System
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'admin-system' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => handleAction('admin-settings')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    System Settings
                  </button>
                  <button
                    onClick={() => handleAction('admin-logs')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Audit Logs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            onChange={(e) => handleAction('users-search', e.target.value)}
          />
        </div>

        {/* Profile Menu */}
        <ProfileMenu onAction={handleAction} />
      </div>
    </div>
  );

  const renderInventoryNavbar = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center justify-between sm:justify-start space-x-6">
        <h2 className="text-xl font-semibold text-gray-900">Inventory Management</h2>
        
        {/* Stock Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('stock')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <Package className="w-4 h-4 mr-2" />
            Stock
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'stock' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handleAction('inventory-dashboard')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Home className="w-4 h-4 mr-3" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleAction('inventory-stock')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Package className="w-4 h-4 mr-3" />
                  View All Stock
                </button>
                <button
                  onClick={() => handleAction('inventory-add-item')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Add New Item
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleAction('inventory-export')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="w-4 h-4 mr-3" />
                  Export Data
                </button>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Transfers Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('transfers')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Transfers
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'transfers' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handleAction('inventory-transfers')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-3" />
                  View All Transfers
                </button>
                <button
                  onClick={() => handleAction('inventory-create-transfer')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Create Transfer
                </button>
                <button
                  onClick={() => handleAction('inventory-pending-transfers')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Pending Transfers
                </button>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Adjustments Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('adjustments')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Adjustments
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'adjustments' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handleAction('inventory-adjustments')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-3" />
                  View Adjustments
                </button>
                <button
                  onClick={() => handleAction('inventory-create-adjustment')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  New Adjustment
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleAction('inventory-adjustment-history')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Adjustment History
                </button>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Reordering Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('reordering')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Reordering
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'reordering' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handleAction('inventory-reordering')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ShoppingCart className="w-4 h-4 mr-3" />
                  Reorder Points
                </button>
                <button
                  onClick={() => handleAction('inventory-low-stock')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Low Stock Alerts
                </button>
                <button
                  onClick={() => handleAction('inventory-purchase-orders')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Purchase Orders
                </button>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Reports Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter('reports')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Reports
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {activeDropdown === 'reports' && (
            <div className="absolute left-0 top-full pt-2 w-56 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handleAction('inventory-reports')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <BarChart3 className="w-4 h-4 mr-3" />
                  View Reports
                </button>
                <button
                  onClick={() => handleAction('inventory-stock-levels')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Stock Levels
                </button>
                <button
                  onClick={() => handleAction('inventory-movements')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-3" />
                  Movement History
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleAction('inventory-valuation')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <DollarSign className="w-4 h-4 mr-3" />
                  Inventory Valuation
                </button>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            onChange={(e) => handleAction('inventory-search', e.target.value)}
          />
        </div>

        {/* Profile Menu */}
        <ProfileMenu onAction={handleAction} />
      </div>
    </div>
  );

  const renderNavbarByModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return renderDashboardNavbar();
      case 'hr':
        return renderHRNavbar();
      case 'users':
        return renderUsersNavbar();
      case 'inventory':
        return renderInventoryNavbar();
      default:
        return (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeModule.charAt(0).toUpperCase() + activeModule.slice(1)} Module
            </h2>
            <div className="text-sm text-gray-500">Coming Soon</div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {renderNavbarByModule()}
    </div>
  );
};

export default DynamicNavbar;
