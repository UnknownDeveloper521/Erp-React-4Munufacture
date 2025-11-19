import React, { useState } from 'react';
import {
  Edit,
  Plus,
  Trash2,
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  Calendar,
  User,
  DollarSign
} from 'lucide-react';

const InventoryAdjustments = () => {
  const [activeTab, setActiveTab] = useState('all-adjustments');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Dummy adjustments data
  const [adjustments, setAdjustments] = useState([
    {
      id: 'ADJ001',
      type: 'increase',
      reason: 'Found inventory',
      adjustedBy: 'John Smith',
      adjustmentDate: '2024-11-18',
      status: 'approved',
      items: [
        { 
          itemCode: 'ITM001', 
          itemName: 'Wireless Mouse', 
          currentStock: 15, 
          adjustedQuantity: 5, 
          newStock: 20,
          unitCost: 25.99,
          totalValue: 129.95,
          location: 'Warehouse A - Shelf 12'
        }
      ],
      totalValue: 129.95,
      notes: 'Found additional units during physical count',
      approvedBy: 'Sarah Johnson',
      approvedDate: '2024-11-18'
    },
    {
      id: 'ADJ002',
      type: 'decrease',
      reason: 'Damaged goods',
      adjustedBy: 'Mike Wilson',
      adjustmentDate: '2024-11-17',
      status: 'pending',
      items: [
        { 
          itemCode: 'ITM002', 
          itemName: 'Office Chair', 
          currentStock: 8, 
          adjustedQuantity: -2, 
          newStock: 6,
          unitCost: 149.99,
          totalValue: -299.98,
          location: 'Warehouse B - Section 3'
        },
        { 
          itemCode: 'ITM005', 
          itemName: 'Desk Lamp', 
          currentStock: 25, 
          adjustedQuantity: -1, 
          newStock: 24,
          unitCost: 29.99,
          totalValue: -29.99,
          location: 'Warehouse B - Shelf 8'
        }
      ],
      totalValue: -329.97,
      notes: 'Items damaged during transport, need to be written off',
      approvedBy: null,
      approvedDate: null
    },
    {
      id: 'ADJ003',
      type: 'cycle_count',
      reason: 'Cycle count adjustment',
      adjustedBy: 'Lisa Chen',
      adjustmentDate: '2024-11-16',
      status: 'approved',
      items: [
        { 
          itemCode: 'ITM003', 
          itemName: 'A4 Paper', 
          currentStock: 45, 
          adjustedQuantity: -5, 
          newStock: 40,
          unitCost: 4.99,
          totalValue: -24.95,
          location: 'Warehouse A - Shelf 5'
        },
        { 
          itemCode: 'ITM004', 
          itemName: 'Laptop Stand', 
          currentStock: 2, 
          adjustedQuantity: 3, 
          newStock: 5,
          unitCost: 35.50,
          totalValue: 106.50,
          location: 'Warehouse A - Shelf 15'
        }
      ],
      totalValue: 81.55,
      notes: 'Monthly cycle count discrepancies corrected',
      approvedBy: 'David Brown',
      approvedDate: '2024-11-16'
    },
    {
      id: 'ADJ004',
      type: 'decrease',
      reason: 'Theft/Loss',
      adjustedBy: 'Sarah Johnson',
      adjustmentDate: '2024-11-15',
      status: 'rejected',
      items: [
        { 
          itemCode: 'ITM006', 
          itemName: 'Whiteboard Markers', 
          currentStock: 0, 
          adjustedQuantity: -10, 
          newStock: -10,
          unitCost: 8.99,
          totalValue: -89.90,
          location: 'Warehouse A - Shelf 3'
        }
      ],
      totalValue: -89.90,
      notes: 'Suspected theft, requires further investigation',
      approvedBy: 'David Brown',
      approvedDate: '2024-11-15',
      rejectionReason: 'Insufficient evidence, requires security review'
    },
    {
      id: 'ADJ005',
      type: 'increase',
      reason: 'Supplier correction',
      adjustedBy: 'David Brown',
      adjustmentDate: '2024-11-14',
      status: 'approved',
      items: [
        { 
          itemCode: 'ITM001', 
          itemName: 'Wireless Mouse', 
          currentStock: 10, 
          adjustedQuantity: 5, 
          newStock: 15,
          unitCost: 25.99,
          totalValue: 129.95,
          location: 'Warehouse A - Shelf 12'
        }
      ],
      totalValue: 129.95,
      notes: 'Supplier delivered extra units, invoice corrected',
      approvedBy: 'Sarah Johnson',
      approvedDate: '2024-11-14'
    }
  ]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'increase': return 'text-green-600 bg-green-100';
      case 'decrease': return 'text-red-600 bg-red-100';
      case 'cycle_count': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'increase': return <TrendingUp className="w-4 h-4" />;
      case 'decrease': return <TrendingDown className="w-4 h-4" />;
      case 'cycle_count': return <Package className="w-4 h-4" />;
      default: return <Edit className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filteredAdjustments = adjustments.filter(adjustment => {
    const matchesSearch = adjustment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adjustment.adjustedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adjustment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adjustment.items.some(item => 
                           item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesType = filterType === 'all' || adjustment.type === filterType;
    const matchesStatus = filterStatus === 'all' || adjustment.status === filterStatus;
    const matchesTab = activeTab === 'all-adjustments' || 
                      (activeTab === 'pending' && adjustment.status === 'pending') ||
                      (activeTab === 'approved' && adjustment.status === 'approved') ||
                      (activeTab === 'rejected' && adjustment.status === 'rejected');
    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  const adjustmentStats = {
    total: adjustments.length,
    pending: adjustments.filter(a => a.status === 'pending').length,
    approved: adjustments.filter(a => a.status === 'approved').length,
    rejected: adjustments.filter(a => a.status === 'rejected').length,
    totalValue: adjustments.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.totalValue, 0),
    increases: adjustments.filter(a => a.type === 'increase' && a.status === 'approved').length,
    decreases: adjustments.filter(a => a.type === 'decrease' && a.status === 'approved').length
  };

  const renderAdjustmentCard = (adjustment) => (
    <div key={adjustment.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{adjustment.id}</h3>
            <p className="text-sm text-gray-500">Adjusted by {adjustment.adjustedBy}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(adjustment.type)}`}>
              {getTypeIcon(adjustment.type)}
              <span className="ml-1">{adjustment.type.replace('_', ' ').toUpperCase()}</span>
            </span>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(adjustment.status)}`}>
              {getStatusIcon(adjustment.status)}
              <span className="ml-1">{adjustment.status.toUpperCase()}</span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${adjustment.totalValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {adjustment.totalValue >= 0 ? '+' : ''}${adjustment.totalValue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Total Impact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Adjustment Date</p>
            <p className="text-sm text-gray-500">{adjustment.adjustmentDate}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Reason</p>
            <p className="text-sm text-gray-500">{adjustment.reason}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Package className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Items Affected</p>
            <p className="text-sm text-gray-500">{adjustment.items.length} item(s)</p>
          </div>
        </div>
      </div>

      {adjustment.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {adjustment.notes}
          </p>
        </div>
      )}

      {adjustment.status === 'rejected' && adjustment.rejectionReason && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <span className="font-medium">Rejection Reason:</span> {adjustment.rejectionReason}
          </p>
        </div>
      )}

      <div className="border-t pt-4 mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Adjustment Details</h4>
        <div className="space-y-3">
          {adjustment.items.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-gray-900">{item.itemName}</span>
                  <span className="text-gray-500 ml-2">({item.itemCode})</span>
                </div>
                <span className={`font-medium ${item.adjustedQuantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.adjustedQuantity >= 0 ? '+' : ''}{item.adjustedQuantity} units
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Current:</span>
                  <span className="font-medium ml-1">{item.currentStock}</span>
                </div>
                <div>
                  <span className="text-gray-500">New:</span>
                  <span className="font-medium ml-1">{item.newStock}</span>
                </div>
                <div>
                  <span className="text-gray-500">Unit Cost:</span>
                  <span className="font-medium ml-1">${item.unitCost}</span>
                </div>
                <div>
                  <span className="text-gray-500">Value Impact:</span>
                  <span className={`font-medium ml-1 ${item.totalValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.totalValue >= 0 ? '+' : ''}${item.totalValue.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Location: {item.location}
              </div>
            </div>
          ))}
        </div>
      </div>

      {adjustment.approvedBy && adjustment.approvedDate && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-medium">Approved by:</span> {adjustment.approvedBy} on {adjustment.approvedDate}
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 pt-4 border-t">
        <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
        {adjustment.status === 'pending' && (
          <>
            <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-900">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-900">
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </button>
            <button className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-900">
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </button>
          </>
        )}
        {adjustment.status === 'approved' && (
          <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-900">
            <FileText className="w-4 h-4 mr-1" />
            Print Report
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Adjustments</h1>
          <p className="text-gray-600">Manage inventory quantity adjustments and corrections</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Adjustments</p>
                <p className="text-2xl font-semibold text-gray-900">{adjustmentStats.total}</p>
              </div>
              <Edit className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-semibold text-yellow-600">{adjustmentStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Increases</p>
                <p className="text-2xl font-semibold text-green-600">{adjustmentStats.increases}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Value Impact</p>
                <p className={`text-2xl font-semibold ${adjustmentStats.totalValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {adjustmentStats.totalValue >= 0 ? '+' : ''}${adjustmentStats.totalValue.toFixed(0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all-adjustments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all-adjustments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Adjustments
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending
                {adjustmentStats.pending > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {adjustmentStats.pending}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approved'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rejected'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rejected
              </button>
            </nav>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search adjustments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
              <option value="cycle_count">Cycle Count</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Adjustment
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAdjustments.length} of {adjustments.length} adjustments
          </p>
        </div>

        {/* Adjustments List */}
        <div className="space-y-4">
          {filteredAdjustments.length > 0 ? (
            filteredAdjustments.map(adjustment => renderAdjustmentCard(adjustment))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <Edit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No adjustments found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first inventory adjustment to get started.'
                }
              </p>
              {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Adjustment
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryAdjustments;
