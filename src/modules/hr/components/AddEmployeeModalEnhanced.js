import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, FileText } from 'lucide-react';
import { masterDataService } from '../../../shared/services/masterDataService';

const AddEmployeeModalEnhanced = ({ isOpen, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [masterData, setMasterData] = useState({
    departments: [],
    positions: [],
    employeeTypes: [],
    employmentStatus: [],
    workLocations: [],
    shiftTypes: [],
    managers: []
  });
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    
    // Address
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    
    // Employment Details
    department_id: '',
    position_id: '',
    employee_type_id: '',
    employment_status_id: '',
    work_location_id: '',
    shift_type_id: '',
    manager_id: '',
    hire_date: '',
    salary: '',
    
    // Additional
    probation_end_date: '',
    confirmation_date: ''
  });

  const [errors, setErrors] = useState({});

  // Load master data on component mount
  useEffect(() => {
    if (isOpen) {
      loadMasterData();
    }
  }, [isOpen]);

  // Filter positions when department changes
  useEffect(() => {
    if (formData.department_id) {
      filterPositionsByDepartment(formData.department_id);
    } else {
      setFilteredPositions(masterData.positions);
    }
  }, [formData.department_id, masterData.positions]);

  const loadMasterData = async () => {
    setLoading(true);
    try {
      const data = await masterDataService.utils.getAllMasterData();
      setMasterData(data);
      setFilteredPositions(data.positions);
    } catch (error) {
      console.error('Error loading master data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPositionsByDepartment = async (departmentId) => {
    try {
      const { data } = await masterDataService.utils.getPositionsByDepartment(departmentId);
      setFilteredPositions(data || []);
      
      // Clear position if it's not in the filtered list
      if (formData.position_id && !data.find(p => p.id === formData.position_id)) {
        setFormData(prev => ({ ...prev, position_id: '' }));
      }
    } catch (error) {
      console.error('Error filtering positions:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.department_id) newErrors.department_id = 'Department is required';
    if (!formData.position_id) newErrors.position_id = 'Position is required';
    if (!formData.employee_type_id) newErrors.employee_type_id = 'Employee type is required';
    if (!formData.employment_status_id) newErrors.employment_status_id = 'Employment status is required';
    if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Salary validation
    if (formData.salary && (isNaN(formData.salary) || parseFloat(formData.salary) < 0)) {
      newErrors.salary = 'Please enter a valid salary amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert salary to number if provided
    const submitData = {
      ...formData,
      salary: formData.salary ? parseFloat(formData.salary) : null
    };

    onSubmit(submitData);
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      department_id: '',
      position_id: '',
      employee_type_id: '',
      employment_status_id: '',
      work_location_id: '',
      shift_type_id: '',
      manager_id: '',
      hire_date: '',
      salary: '',
      probation_end_date: '',
      confirmation_date: ''
    });
    setErrors({});
    setActiveTab('personal');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'compensation', label: 'Compensation', icon: DollarSign }
  ];

  const renderPersonalTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.first_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter first name"
          />
          {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.last_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter last name"
          />
          {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="2"
          placeholder="Enter full address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter city"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter state"
          />
        </div>
      </div>
    </div>
  );

  const renderEmploymentTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department *
          </label>
          <select
            value={formData.department_id}
            onChange={(e) => handleInputChange('department_id', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.department_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select department</option>
            {masterData.departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position *
          </label>
          <select
            value={formData.position_id}
            onChange={(e) => handleInputChange('position_id', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.position_id ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={!formData.department_id}
          >
            <option value="">Select position</option>
            {filteredPositions.map(pos => (
              <option key={pos.id} value={pos.id}>
                {pos.title} (Level {pos.level})
              </option>
            ))}
          </select>
          {errors.position_id && <p className="text-red-500 text-xs mt-1">{errors.position_id}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee Type *
          </label>
          <select
            value={formData.employee_type_id}
            onChange={(e) => handleInputChange('employee_type_id', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.employee_type_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select employee type</option>
            {masterData.employeeTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.employee_type_id && <p className="text-red-500 text-xs mt-1">{errors.employee_type_id}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employment Status *
          </label>
          <select
            value={formData.employment_status_id}
            onChange={(e) => handleInputChange('employment_status_id', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.employment_status_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select employment status</option>
            {masterData.employmentStatus.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
          {errors.employment_status_id && <p className="text-red-500 text-xs mt-1">{errors.employment_status_id}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Location
          </label>
          <select
            value={formData.work_location_id}
            onChange={(e) => handleInputChange('work_location_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select work location</option>
            {masterData.workLocations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name} - {location.city}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shift Type
          </label>
          <select
            value={formData.shift_type_id}
            onChange={(e) => handleInputChange('shift_type_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select shift type</option>
            {masterData.shiftTypes.map(shift => (
              <option key={shift.id} value={shift.id}>
                {shift.name} ({shift.start_time} - {shift.end_time})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manager
          </label>
          <select
            value={formData.manager_id}
            onChange={(e) => handleInputChange('manager_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select manager</option>
            {masterData.managers.map(manager => (
              <option key={manager.id} value={manager.id}>
                {manager.first_name} {manager.last_name} ({manager.employee_id})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hire Date *
          </label>
          <input
            type="date"
            value={formData.hire_date}
            onChange={(e) => handleInputChange('hire_date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.hire_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.hire_date && <p className="text-red-500 text-xs mt-1">{errors.hire_date}</p>}
        </div>
      </div>
    </div>
  );

  const renderCompensationTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salary
          </label>
          <input
            type="number"
            value={formData.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.salary ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter annual salary"
            min="0"
            step="0.01"
          />
          {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Probation End Date
          </label>
          <input
            type="date"
            value={formData.probation_end_date}
            onChange={(e) => handleInputChange('probation_end_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmation Date
          </label>
          <input
            type="date"
            value={formData.confirmation_date}
            onChange={(e) => handleInputChange('confirmation_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Employee</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            ) : (
              <>
                {activeTab === 'personal' && renderPersonalTab()}
                {activeTab === 'employment' && renderEmploymentTab()}
                {activeTab === 'compensation' && renderCompensationTab()}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModalEnhanced;
