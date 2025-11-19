import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  MapPin,
  Calendar,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';

const InventoryTransfers = () => {
  const [activeTab, setActiveTab] = useState('all-transfers');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Dummy transfer data
  const [transfers, setTransfers] = useState([
    {
      id: 'TRF001',
      fromLocation: 'Warehouse A',
      toLocation: 'Warehouse B',
      requestedBy: 'John Smith',
      requestDate: '2024-11-18',
      expectedDate: '2024-11-20',
      completedDate: null,
      status: 'pending',
      priority: 'high',
      reason: 'Stock rebalancing',
      items: [
        { itemCode: 'ITM001', itemName: 'Wireless Mouse', quantity: 10, unitCost: 25.99 },
        { itemCode: 'ITM003', itemName: 'A4 Paper', quantity: 20, unitCost: 4.99 }
      ],
      notes: 'Urgent transfer required for retail store restocking',
      totalValue: 359.70
    },
    {
      id: 'TRF002',
      fromLocation: 'Warehouse B',
      toLocation: 'Retail Store 1',
      requestedBy: 'Sarah Johnson',
      requestDate: '2024-11-17',
      expectedDate: '2024-11-19',
      completedDate: null,
      status: 'approved',
      priority: 'medium',
      reason: 'Store restocking',
      items: [
        { itemCode: 'ITM002', itemName: 'Office Chair', quantity: 5, unitCost: 149.99 },
        { itemCode: 'ITM005', itemName: 'Desk Lamp', quantity: 8, unitCost: 29.99 }
      ],
      notes: 'Regular weekly transfer to retail location',
      totalValue: 989.87
    },
    {
      id: 'TRF003',
      fromLocation: 'Warehouse A',
      toLocation: 'Warehouse C',
      requestedBy: 'Mike Wilson',
      requestDate: '2024-11-16',
      expectedDate: '2024-11-18',
      completedDate: '2024-11-18',
      status: 'completed',
      priority: 'low',
      reason: 'Overflow management',
      items: [
        { itemCode: 'ITM004', itemName: 'Laptop Stand', quantity: 15, unitCost: 35.50 }
      ],
      notes: 'Moving excess inventory to secondary warehouse',
      totalValue: 532.50
    },
    {
      id: 'TRF004',
      fromLocation: 'Retail Store 2',
      toLocation: 'Warehouse A',
      requestedBy: 'Lisa Chen',
      requestDate: '2024-11-15',
      expectedDate: '2024-11-17',
      completedDate: null,
      status: 'in_transit',
      priority: 'medium',
      reason: 'Return to warehouse',
      items: [
        { itemCode: 'ITM006', itemName: 'Whiteboard Markers', quantity: 12, unitCost: 8.99 }
      ],
      notes: 'Returning damaged items for inspection',
      totalValue: 107.88
    },
    {
      id: 'TRF005',
      fromLocation: 'Warehouse B',
      toLocation: 'Warehouse A',
      requestedBy: 'David Brown',
      requestDate: '2024-11-14',
      expectedDate: '2024-11-16',
      completedDate: null,
      status: 'cancelled',
      priority: 'low',
      reason: 'Consolidation',
      items: [
        { itemCode: 'ITM001', itemName: 'Wireless Mouse', quantity: 25, unitCost: 25.99 }
      ],
      notes: 'Transfer cancelled due to space constraints',
      totalValue: 649.75
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'in_transit': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'in_transit': return <ArrowRightLeft className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transfer.status === filterStatus;
    const matchesTab = activeTab === 'all-transfers' || 
                      (activeTab === 'pending' && transfer.status === 'pending') ||
                      (activeTab === 'in-progress' && ['approved', 'in_transit'].includes(transfer.status)) ||
                      (activeTab === 'completed' && transfer.status === 'completed');
    return matchesSearch && matchesStatus && matchesTab;
  });

  const transferStats = {
    total: transfers.length,
    pending: transfers.filter(t => t.status === 'pending').length,
    inProgress: transfers.filter(t => ['approved', 'in_transit'].includes(t.status)).length,
    completed: transfers.filter(t => t.status === 'completed').length,
    totalValue: transfers.reduce((sum, t) => sum + t.totalValue, 0)
  };

  const renderTransferCard = (transfer) => (
    <div key={transfer.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{transfer.id}</h3>
            <p className="text-sm text-gray-500">Requested by {transfer.requestedBy}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transfer.status)}`}>
              {getStatusIcon(transfer.status)}
              <span className="ml-1">{transfer.status.replace('_', ' ').toUpperCase()}</span>
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(transfer.priority)}`}>
              {transfer.priority.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">${transfer.totalValue.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Total Value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">From: {transfer.fromLocation}</p>
            <p className="text-sm font-medium text-gray-900">To: {transfer.toLocation}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Requested: {transfer.requestDate}</p>
            <p className="text-sm text-gray-500">Expected: {transfer.expectedDate}</p>
            {transfer.completedDate && (
              <p className="text-sm text-green-600">Completed: {transfer.completedDate}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Reason:</span> {transfer.reason}
        </p>
        {transfer.notes && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {transfer.notes}
          </p>
        )}
      </div>

      <div className="border-t pt-4 mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Items ({transfer.items.length})</h4>
        <div className="space-y-2">
          {transfer.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium">{item.itemName}</span>
                <span className="text-gray-500 ml-2">({item.itemCode})</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{item.quantity} units</span>
                <span className="text-gray-500 ml-2">@ ${item.unitCost}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-4 border-t">
        <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
        {transfer.status === 'pending' && (
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
              Cancel
            </button>
          </>
        )}
        {transfer.status === 'approved' && (
          <button className="flex items-center px-3 py-2 text-sm text-purple-600 hover:text-purple-900">
            <ArrowRightLeft className="w-4 h-4 mr-1" />
            Start Transfer
          </button>
        )}
        {transfer.status === 'in_transit' && (
          <button className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-900">
            <CheckCircle className="w-4 h-4 mr-1" />
            Mark Complete
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Transfers</h1>
          <p className="text-gray-600">Manage inventory transfers between locations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transfers</p>
                <p className="text-2xl font-semibold text-gray-900">{transferStats.total}</p>
              </div>
              <ArrowRightLeft className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-yellow-600">{transferStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-purple-600">{transferStats.inProgress}</p>
              </div>
              <ArrowRightLeft className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-green-600">{transferStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">${transferStats.totalValue.toFixed(0)}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all-transfers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all-transfers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Transfers
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
                {transferStats.pending > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {transferStats.pending}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('in-progress')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'in-progress'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                In Progress
                {transferStats.inProgress > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {transferStats.inProgress}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed
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
                placeholder="Search transfers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_transit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
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
              Create Transfer
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredTransfers.length} of {transfers.length} transfers
          </p>
        </div>

        {/* Transfers List */}
        <div className="space-y-4">
          {filteredTransfers.length > 0 ? (
            filteredTransfers.map(transfer => renderTransferCard(transfer))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <ArrowRightLeft className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first inventory transfer to get started.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Transfer
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryTransfers;
