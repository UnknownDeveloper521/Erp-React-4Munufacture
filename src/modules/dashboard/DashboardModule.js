import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Settings, 
  BarChart3,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  PieChart
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Pie Chart Component with Animation
const PieChartComponent = ({ data, colors, size = 200 }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Ensure we always have data to display
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  
  // If total is 0, show empty state
  if (total === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 text-sm">No data to display</p>
      </div>
    );
  }

  let currentAngle = -90; // Start from top
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;
  
  const segments = data.map((item, index) => {
    const value = item.value || 0;
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    // Calculate path for pie slice
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    // For single record (full circle), we need special handling
    let pathData;
    if (data.length === 1 || Math.abs(angle - 360) < 0.01) {
      // Full circle - draw complete circle using two 180-degree arcs
      // Start from top (0 degrees), go to bottom (180 degrees), then back to top
      const topX = centerX;
      const topY = centerY - radius;
      const bottomX = centerX;
      const bottomY = centerY + radius;
      pathData = `M ${centerX} ${centerY} L ${topX} ${topY} A ${radius} ${radius} 0 1 1 ${bottomX} ${bottomY} A ${radius} ${radius} 0 1 1 ${topX} ${topY} Z`;
    } else if (angle === 0) {
      // Zero angle - don't draw anything (shouldn't happen, but handle it)
      pathData = '';
    } else {
      const largeArcFlag = angle > 180 ? 1 : 0;
      pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
    }
    
    currentAngle = endAngle;
    
    return {
      path: pathData,
      color: colors[index % colors.length],
      label: item.label || 'Unknown',
      value: value,
      percentage: percentage.toFixed(1)
    };
  });
  
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mb-4">
        <svg
          width="100%"
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.path}
              fill={segment.color}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-80 transition-all duration-300 cursor-pointer hover:scale-105"
              style={{
                transformOrigin: `${centerX}px ${centerY}px`,
                animation: isAnimated ? `pieSliceGrow 0.8s ease-out ${index * 0.1}s both` : 'none'
              }}
            />
          ))}
        </svg>
      </div>
      <div className="w-full space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="chart-legend-item flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2 transition-transform hover:scale-110" 
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-gray-700">{segment.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-900 font-medium">{segment.value}</span>
              <span className="text-gray-500">({segment.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardModule = () => {
  const [employeeAnalytics, setEmployeeAnalytics] = useState({
    byDepartment: [],
    byStatus: [],
    loading: true
  });

  const loadEmployeeAnalytics = async () => {
    try {
      // Fetch employees with all necessary relations for analytics
      const { data: employees, error } = await supabase
        .from('employees')
        .select(`
          *,
          department:departments!department_id(id, name, code),
          employment_status:employment_status!employment_status_id(id, name, code)
        `);
      
      if (error) {
        console.error('Error loading employee analytics:', error);
        setEmployeeAnalytics({ byDepartment: [], byStatus: [], loading: false });
        return;
      }

      if (employees && employees.length > 0) {
        // Group by Department
        const departmentMap = {};
        employees.forEach(emp => {
          const deptName = emp.department?.name || 'No Department';
          departmentMap[deptName] = (departmentMap[deptName] || 0) + 1;
        });
        
        const byDepartment = Object.entries(departmentMap).map(([label, value]) => ({
          label,
          value
        }));

        // Group by Status
        const statusMap = {};
        employees.forEach(emp => {
          const status = emp.employment_status?.name || emp.status || 'Active';
          statusMap[status] = (statusMap[status] || 0) + 1;
        });
        
        const byStatus = Object.entries(statusMap).map(([label, value]) => ({
          label,
          value
        }));

        setEmployeeAnalytics({ byDepartment, byStatus, loading: false });
      } else {
        setEmployeeAnalytics({ byDepartment: [], byStatus: [], loading: false });
      }
    } catch (error) {
      console.error('Error loading employee analytics:', error);
      setEmployeeAnalytics({ byDepartment: [], byStatus: [], loading: false });
    }
  };

  const refreshData = () => {
    loadEmployeeAnalytics();
  };

  useEffect(() => {
    loadEmployeeAnalytics();
    window.refreshDashboardData = refreshData;
    return () => {
      delete window.refreshDashboardData;
    };
  }, [refreshData]);

  const chartColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ];

  const stats = [
    {
      title: 'Total Users',
      value: '1',
      icon: Users,
      color: 'bg-blue-500',
      change: '+0%',
      changeType: 'neutral'
    },
    {
      title: 'Active Modules',
      value: '2',
      icon: Package,
      color: 'bg-green-500',
      change: '+100%',
      changeType: 'positive'
    },
    {
      title: 'System Status',
      value: 'Online',
      icon: Settings,
      color: 'bg-yellow-500',
      change: '99.9%',
      changeType: 'positive'
    },
    {
      title: 'Performance',
      value: '98%',
      icon: BarChart3,
      color: 'bg-purple-500',
      change: '+2%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'User logged in',
      user: 'System',
      time: 'Just now',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      action: 'Dashboard module loaded',
      user: 'System',
      time: '2 minutes ago',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      id: 3,
      action: 'ERP system initialized',
      user: 'System',
      time: '5 minutes ago',
      icon: Settings,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your ERP system dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-gray-100`}>
                    <IconComponent className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">by {activity.user}</p>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Package className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">View Inventory</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">View Reports</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Settings className="w-6 h-6 text-gray-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Settings</p>
            </button>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Version</p>
            <p className="text-lg font-semibold text-gray-900">v1.0.0</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Last Updated</p>
            <p className="text-lg font-semibold text-gray-900">Today</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Environment</p>
            <p className="text-lg font-semibold text-gray-900">Development</p>
          </div>
        </div>
      </div>

      {/* Employee Analytics */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <PieChart className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Employee Analytics</h3>
        </div>
        
        {employeeAnalytics.loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading analytics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Employees by Department */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Employees by Department</h4>
              {employeeAnalytics.byDepartment.length > 0 ? (
                <PieChartComponent 
                  data={employeeAnalytics.byDepartment} 
                  colors={chartColors}
                  size={250}
                />
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No department data available</p>
                </div>
              )}
            </div>

            {/* Employees by Status */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Employees by Status</h4>
              {employeeAnalytics.byStatus.length > 0 ? (
                <PieChartComponent 
                  data={employeeAnalytics.byStatus} 
                  colors={chartColors}
                  size={250}
                />
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No status data available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardModule;
