import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { employeeService } from '../services/employeeService';

// Simple reusable pie chart component (SVG based)
const PieChartComponent = ({ data, colors, size = 220 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 text-sm">No data to display</p>
      </div>
    );
  }

  let currentAngle = -90; // start from top
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  const segments = data.map((item, index) => {
    const value = item.value || 0;
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    let pathData;
    if (data.length === 1 || Math.abs(angle - 360) < 0.01) {
      const topX = centerX;
      const topY = centerY - radius;
      const bottomX = centerX;
      const bottomY = centerY + radius;
      pathData = `M ${centerX} ${centerY} L ${topX} ${topY} A ${radius} ${radius} 0 1 1 ${bottomX} ${bottomY} A ${radius} ${radius} 0 1 1 ${topX} ${topY} Z`;
    } else if (angle === 0) {
      pathData = '';
    } else {
      const largeArcFlag = angle > 180 ? 1 : 0;
      pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');
    }

    currentAngle = endAngle;

    return {
      path: pathData,
      color: colors[index % colors.length],
      label: item.label || 'Unknown',
      value,
      percentage: percentage.toFixed(1),
    };
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mb-4">
        <svg
          width="100%"
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {segments.map((segment, index) =>
            segment.path ? (
              <path
                key={index}
                d={segment.path}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ) : null
          )}
        </svg>
      </div>
      <div className="w-full space-y-2">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: segment.color }}
              ></span>
              <span className="text-gray-700">{segment.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-900 font-medium">{segment.value}</span>
              <span className="text-gray-500 text-xs">
                ({segment.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HRModuleEnhanced = ({ activeView = 'employees' }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [shiftTypeFilter, setShiftTypeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Load employees and stats on component mount
  useEffect(() => {
    loadEmployees();
    loadStats();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await employeeService.getAll();
      
      if (error) {
        setError(error.message);
      } else {
        // Transform data to match component expectations
        const transformedEmployees = data.map(emp => ({
          id: emp.id,
          name: `${emp.first_name} ${emp.last_name}`,
          position: emp.position?.title || emp.position || 'No Position',
          department: emp.department?.name || 'No Department',
          email: emp.email,
          phone: emp.phone || 'N/A',
          location: emp.work_location?.name || emp.city || emp.state || 'Not specified',
          status: emp.employment_status?.name || emp.status || 'Active', // Fallback to old status or default
          avatar: `${emp.first_name?.[0] || ''}${emp.last_name?.[0] || ''}`,
          salary: emp.salary,
          hireDate: emp.hire_date,
          lastLogin: 'N/A', // This would come from auth data
          performance: 'N/A', // This would need a separate performance table
          employeeId: emp.employee_id,
          employeeType: emp.employee_type?.name || 'Employee',
          manager: emp.manager ? `${emp.manager.first_name} ${emp.manager.last_name}` : 'No Manager',
          shiftType: emp.shift_type?.name || 'Standard',
          shiftTypeId: emp.shift_type_id || null,
          workLocationId: emp.work_location_id || null,
          positionId: emp.position_id || null
        }));
        setEmployees(transformedEmployees);
      }
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await employeeService.getStats();
      if (!error && data) {
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Sample attendance data
  const attendanceData = [
    { id: 1, employee: 'John Doe', date: '2024-01-10', checkIn: '09:00', checkOut: '17:30', status: 'Present' },
    { id: 2, employee: 'Jane Smith', date: '2024-01-10', checkIn: '08:45', checkOut: '17:15', status: 'Present' },
    { id: 3, employee: 'Mike Johnson', date: '2024-01-10', checkIn: '-', checkOut: '-', status: 'On Leave' },
  ];

  // Sample leave requests
  const leaveRequests = [
    { id: 1, employee: 'John Doe', type: 'Vacation', startDate: '2024-01-15', endDate: '2024-01-19', status: 'Pending', days: 5 },
    { id: 2, employee: 'Jane Smith', type: 'Sick Leave', startDate: '2024-01-12', endDate: '2024-01-12', status: 'Approved', days: 1 },
    { id: 3, employee: 'Mike Johnson', type: 'Personal', startDate: '2024-01-08', endDate: '2024-01-10', status: 'Approved', days: 3 },
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && employee.status === 'Active') ||
                         (selectedFilter === 'leave' && (employee.status === 'On Leave' || employee.status === 'Leave'));
    
    const matchesLocation = !locationFilter || employee.location === locationFilter;
    const matchesPosition = !positionFilter || employee.position === positionFilter;
    const matchesShiftType = !shiftTypeFilter || employee.shiftType === shiftTypeFilter;
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (employee.name && employee.name.toLowerCase().includes(lowerSearch)) ||
      (employee.email && employee.email.toLowerCase().includes(lowerSearch)) ||
      (employee.employeeId && employee.employeeId.toLowerCase().includes(lowerSearch)) ||
      (employee.department && employee.department.toLowerCase().includes(lowerSearch));
    
    return matchesFilter && matchesLocation && matchesPosition && matchesShiftType && matchesDepartment && matchesSearch;
  });

  const pageSize = 7;
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, locationFilter, positionFilter, shiftTypeFilter, departmentFilter, searchTerm]);

  // Get unique values for filters
  const uniqueLocations = [...new Set(employees.map(emp => emp.location).filter(Boolean))].sort();
  const uniquePositions = [...new Set(employees.map(emp => emp.position).filter(Boolean))].sort();
  const uniqueShiftTypes = [...new Set(employees.map(emp => emp.shiftType).filter(Boolean))].sort();
  const uniqueDepartments = [...new Set(employees.map(emp => emp.department).filter(Boolean))].sort();

  const getDistribution = (items, key) => {
    const map = {};
    items.forEach((item) => {
      const label = item[key] || 'Not specified';
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([label, value]) => ({ label, value }));
  };

  const departmentDistribution = getDistribution(employees, 'department');
  const statusDistribution = getDistribution(employees, 'status');
  const locationDistribution = getDistribution(employees, 'location');
  const shiftTypeDistribution = getDistribution(employees, 'shiftType');

  const getMaxValue = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((max, item) => (item.value > max ? item.value : max), 0);
  };

  const maxDept = getMaxValue(departmentDistribution);
  const maxStatus = getMaxValue(statusDistribution);
  const maxLocation = getMaxValue(locationDistribution);
  const maxShift = getMaxValue(shiftTypeDistribution);

  const attendanceSummary = attendanceData.reduce(
    (acc, record) => {
      if (record.status === 'Present') acc.present += 1;
      if (record.status === 'On Leave') acc.onLeave += 1;
      return acc;
    },
    { present: 0, onLeave: 0 }
  );

  const renderAttendanceReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Reports</h3>
        <p className="text-sm text-gray-600 mb-4">
          Summary of attendance status for the current period.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Records</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{attendanceData.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Present</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{attendanceSummary.present}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">On Leave</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{attendanceSummary.onLeave}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Make refresh function available globally for MainLayout
  React.useEffect(() => {
    const refreshData = () => {
      loadEmployees();
      loadStats();
    };

    window.refreshHRData = refreshData;
    return () => {
      delete window.refreshHRData;
    };
  }, []);

  const renderEmployeeDirectory = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading employees...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={loadEmployees}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total || employees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.active || employees.filter(e => e.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.onLeave || employees.filter(e => e.status === 'On Leave').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(employees.map(emp => emp.department)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            All Employees ({employees.length})
          </button>
          <button 
            onClick={() => setSelectedFilter('active')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedFilter === 'active' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            Active ({employees.filter(emp => emp.status === 'Active').length})
          </button>
          <button 
            onClick={() => setSelectedFilter('leave')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedFilter === 'leave' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            On Leave ({employees.filter(emp => emp.status === 'On Leave').length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employees..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Position
            </label>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Positions</option>
              {uniquePositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Shift Type
            </label>
            <select
              value={shiftTypeFilter}
              onChange={(e) => setShiftTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Shift Types</option>
              {uniqueShiftTypes.map((shiftType) => (
                <option key={shiftType} value={shiftType}>
                  {shiftType}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(locationFilter || positionFilter || shiftTypeFilter || departmentFilter) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setLocationFilter('');
                setPositionFilter('');
                setShiftTypeFilter('');
                setDepartmentFilter('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Employee Directory</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {paginatedEmployees.map((employee) => (
            <div key={employee.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {employee.avatar}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{employee.name}</h4>
                    <p className="text-gray-600">{employee.position}</p>
                    <p className="text-sm text-gray-500">{employee.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {employee.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {employee.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {employee.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status}
                    </span>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredEmployees.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {filteredEmployees.length === 0 ? 0 : startIndex + 1}
              -{Math.min(startIndex + pageSize, filteredEmployees.length)} of {filteredEmployees.length} employees
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPageSafe === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span>
                Page {currentPageSafe} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPageSafe === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    );
  };

  const renderAttendanceView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.employee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

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

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.filter(e => e.status === 'Active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-gray-900">{employees.filter(e => e.status === 'On Leave').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(employees.map(emp => emp.department)).size}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Employees by Department</h3>
          {departmentDistribution.length === 0 ? (
            <p className="text-sm text-gray-500">No department data available.</p>
          ) : (
            <PieChartComponent
              data={departmentDistribution}
              colors={chartColors}
              size={240}
            />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Employees by Status</h3>
          {statusDistribution.length === 0 ? (
            <p className="text-sm text-gray-500">No status data available.</p>
          ) : (
            <PieChartComponent
              data={statusDistribution}
              colors={chartColors}
              size={240}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Employees by Location</h3>
          {locationDistribution.length === 0 ? (
            <p className="text-sm text-gray-500">No location data available.</p>
          ) : (
            <div className="space-y-3">
              {locationDistribution.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${maxLocation ? (item.value / maxLocation) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Employees by Shift Type</h3>
          {shiftTypeDistribution.length === 0 ? (
            <p className="text-sm text-gray-500">No shift type data available.</p>
          ) : (
            <div className="space-y-3">
              {shiftTypeDistribution.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-teal-500"
                      style={{ width: `${maxShift ? (item.value / maxShift) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-2">Today's Attendance</h3>
          <p className="text-sm text-gray-600 mb-4">Sample overview based on attendance records</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Present</span>
              <span className="font-semibold text-green-700">{attendanceSummary.present}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">On Leave</span>
              <span className="font-semibold text-yellow-700">{attendanceSummary.onLeave}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Attendance Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">{record.employee}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-500">{record.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-500">{record.checkIn}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-500">{record.checkOut}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'Present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeaveRequests = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests</h3>
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{request.employee}</h4>
                  <p className="text-sm text-gray-600">{request.type} - {request.days} days</p>
                  <p className="text-sm text-gray-500">{request.startDate} to {request.endDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                  {request.status === 'Pending' && (
                    <div className="flex space-x-1">
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (activeView) {
      case 'employees':
      case 'view-employees':
      case 'employee-directory':
        return renderEmployeeDirectory();
      case 'attendance-overview':
      case 'time-tracking':
        return renderAttendanceView();
      case 'leave-requests':
        return renderLeaveRequests();
      case 'attendance-reports':
        return renderAttendanceReports();
      case 'bulk-import':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Import Employees</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload a CSV file with employee details to quickly onboard multiple employees.
              </p>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-gray-600 mb-2">Drag and drop CSV file here, or click to browse</p>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">Choose File</button>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-semibold mb-1">Template format</p>
                  <p>Required columns: first_name, last_name, email, department, position, hire_date, employment_status.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'export-employees':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Employees</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download employee data for external reporting or backups.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 text-left">
                  Export all employees (CSV)
                </button>
                <button className="px-4 py-3 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 text-left">
                  Export active employees only
                </button>
                <button className="px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 text-left">
                  Export by department
                </button>
              </div>
            </div>
          </div>
        );
      case 'salary-management':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Maintain base salaries and allowances for employees. This view is currently illustrative only.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.slice(0, 5).map((emp) => (
                      <tr key={emp.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-900">{emp.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">{emp.department}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">{emp.position}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-gray-900">
                          {emp.salary ? `₹${emp.salary.toLocaleString()}` : '—'}
                        </td>
                      </tr>
                    ))}
                    {employees.length === 0 && (
                      <tr>
                        <td className="px-4 py-4 text-center text-gray-500" colSpan={4}>
                          No employees loaded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'payroll-processing':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Processing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Run monthly payroll cycles. This is a UI placeholder and not connected to backend yet.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600">Last Run</p>
                  <p className="text-base font-semibold text-gray-900">Jan 2024</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600">Employees Processed</p>
                  <p className="text-base font-semibold text-gray-900">3</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="text-base font-semibold text-gray-900">Completed</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Start new payroll run
              </button>
            </div>
          </div>
        );
      case 'tax-management':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage tax settings and deductions used during payroll processing.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Default tax regime</span>
                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-800">New</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Professional tax</span>
                  <span className="text-gray-900 font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Other deductions</span>
                  <span className="text-gray-900 font-medium">Configured</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'payroll-reports':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Reports</h3>
              <p className="text-sm text-gray-600 mb-4">
                View high-level payroll summaries for completed runs.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Run Date</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Total Gross</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Total Net</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-900">Jan 2024</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-500">2024-01-31</td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-gray-900">3</td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-gray-900">₹15,000</td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-gray-900">₹12,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'performance-reviews':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Reviews</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track performance reviews completed for employees.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-900">Sample Employee A</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-500">OctDec 2023</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-900">Exceeds Expectations</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-900">Sample Employee B</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-500">OctDec 2023</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-900">Meets Expectations</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'goal-management':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                View key goals assigned to employees and their progress.
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Improve customer satisfaction scores</p>
                  <p className="text-xs text-gray-500 mb-2">Due: 2024-06-30</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600">Progress: 60%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Complete advanced HR certification</p>
                  <p className="text-xs text-gray-500 mb-2">Due: 2024-09-30</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                    <div className="h-2 rounded-full bg-yellow-500" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600">Progress: 0%</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'training-programs':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Programs</h3>
              <p className="text-sm text-gray-600 mb-4">
                Overview of active and upcoming training programs.
              </p>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">Onboarding Program</p>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-800">Active</span>
                  </div>
                  <p className="text-sm text-gray-600">New hire onboarding program</p>
                  <p className="text-xs text-gray-500 mt-1">2024-02-01 to 2024-02-15  Head Office</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">Leadership Essentials</p>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-800">Upcoming</span>
                  </div>
                  <p className="text-sm text-gray-600">Leadership training for managers</p>
                  <p className="text-xs text-gray-500 mt-1">2024-03-10 to 2024-03-20  Online</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'performance-analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analytics</h3>
              <p className="text-sm text-gray-600 mb-4">
                High-level view of performance distribution across the organization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600">High performers</p>
                  <p className="text-base font-semibold text-gray-900">40%</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600">Solid performers</p>
                  <p className="text-base font-semibold text-gray-900">50%</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600">Needs improvement</p>
                  <p className="text-base font-semibold text-gray-900">10%</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Analytics currently based on sample data only.</p>
            </div>
          </div>
        );
      default:
        return renderAnalyticsView();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-gray-600">Manage employees and HR processes efficiently</p>
      </div>
      {renderView()}
    </div>
  );
};

export default HRModuleEnhanced;
