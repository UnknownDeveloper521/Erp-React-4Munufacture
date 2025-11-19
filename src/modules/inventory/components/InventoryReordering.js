import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

const InventoryReordering = () => {
  const [activeTab, setActiveTab] = useState('reorder-points');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Dummy data for reorder points
  const [reorderPoints, setReorderPoints] = useState([
    {
      id: 1,
      itemCode: 'ITM001',
      itemName: 'Wireless Mouse',
      category: 'Electronics',
      currentStock: 15,
      reorderLevel: 20,
      reorderQuantity: 50,
      supplier: 'Tech Supplies Co.',
      status: 'below_reorder',
      lastUpdated: '2024-11-15',
      unitCost: 25.99,
      leadTime: 7
    },
    {
      id: 2,
      itemCode: 'ITM002',
      itemName: 'Office Chair',
      category: 'Furniture',
      currentStock: 8,
      reorderLevel: 10,
      reorderQuantity: 25,
      supplier: 'Office Furniture Ltd.',
      status: 'below_reorder',
      lastUpdated: '2024-11-14',
      unitCost: 149.99,
      leadTime: 14
    },
    {
      id: 3,
      itemCode: 'ITM003',
      itemName: 'A4 Paper',
      category: 'Stationery',
      currentStock: 45,
      reorderLevel: 30,
      reorderQuantity: 100,
      supplier: 'Paper World Inc.',
      status: 'normal',
      lastUpdated: '2024-11-16',
      unitCost: 4.99,
      leadTime: 3
    },
    {
      id: 4,
      itemCode: 'ITM004',
      itemName: 'Laptop Stand',
      category: 'Electronics',
      currentStock: 2,
      reorderLevel: 5,
      reorderQuantity: 20,
      supplier: 'Tech Supplies Co.',
      status: 'critical',
      lastUpdated: '2024-11-13',
      unitCost: 35.50,
      leadTime: 5
    }
  ]);

  // Dummy data for purchase orders
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 'PO001',
      supplier: 'Tech Supplies Co.',
      orderDate: '2024-11-18',
      expectedDate: '2024-11-25',
      status: 'pending',
      totalAmount: 1299.50,
      items: [
        { itemCode: 'ITM001', itemName: 'Wireless Mouse', quantity: 50, unitCost: 25.99 }
      ]
    },
    {
      id: 'PO002',
      supplier: 'Office Furniture Ltd.',
      orderDate: '2024-11-17',
      expectedDate: '2024-12-01',
      status: 'approved',
      totalAmount: 3749.75,
      items: [
        { itemCode: 'ITM002', itemName: 'Office Chair', quantity: 25, unitCost: 149.99 }
      ]
    },
    {
      id: 'PO003',
      supplier: 'Paper World Inc.',
      orderDate: '2024-11-16',
      expectedDate: '2024-11-19',
      status: 'shipped',
      totalAmount: 499.00,
      items: [
        { itemCode: 'ITM003', itemName: 'A4 Paper', quantity: 100, unitCost: 4.99 }
      ]
    }
  ]);

  // Dummy data for low stock alerts
  const lowStockAlerts = reorderPoints.filter(item => 
    item.status === 'below_reorder' || item.status === 'critical'
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'below_reorder': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPOStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-green-600 bg-green-100';
      case 'delivered': return 'text-green-700 bg-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredReorderPoints = reorderPoints.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderReorderPointsTab = () => (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
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
            <option value="critical">Critical</option>
            <option value="below_reorder">Below Reorder</option>
            <option value="normal">Normal</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reorder Point
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{reorderPoints.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Stock</p>
              <p className="text-2xl font-semibold text-red-600">
                {reorderPoints.filter(item => item.status === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Below Reorder</p>
              <p className="text-2xl font-semibold text-orange-600">
                {reorderPoints.filter(item => item.status === 'below_reorder').length}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Normal Stock</p>
              <p className="text-2xl font-semibold text-green-600">
                {reorderPoints.filter(item => item.status === 'normal').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Reorder Points Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReorderPoints.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                      <div className="text-sm text-gray-500">{item.itemCode}</div>
                      <div className="text-xs text-gray-400">{item.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.currentStock}</div>
                    <div className="text-xs text-gray-500">units</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.reorderLevel}</div>
                    <div className="text-xs text-gray-500">min level</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.reorderQuantity}</div>
                    <div className="text-xs text-gray-500">${(item.reorderQuantity * item.unitCost).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.supplier}</div>
                    <div className="text-xs text-gray-500">{item.leadTime} days lead time</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPurchaseOrdersTab = () => (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium text-gray-900">Purchase Orders</h3>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </button>
          <button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Order
          </button>
        </div>
      </div>

      {/* Purchase Orders List */}
      <div className="grid gap-4">
        {purchaseOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{order.id}</h4>
                  <p className="text-sm text-gray-500">{order.supplier}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPOStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Total Amount</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="text-sm font-medium text-gray-900">{order.orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Date</p>
                <p className="text-sm font-medium text-gray-900">{order.expectedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Items</p>
                <p className="text-sm font-medium text-gray-900">{order.items.length} item(s)</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Order Items</h5>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.itemName}</span>
                      <span className="text-gray-500 ml-2">({item.itemCode})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{item.quantity} × ${item.unitCost}</span>
                      <span className="text-gray-500 ml-2">= ${(item.quantity * item.unitCost).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t">
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-900">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              {order.status === 'pending' && (
                <button className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-900">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLowStockTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {lowStockAlerts.length} items need attention
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {lowStockAlerts.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${item.status === 'critical' ? 'bg-red-100' : 'bg-orange-100'}`}>
                  <AlertTriangle className={`w-5 h-5 ${item.status === 'critical' ? 'text-red-600' : 'text-orange-600'}`} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{item.itemName}</h4>
                  <p className="text-sm text-gray-500">{item.itemCode} • {item.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{item.currentStock} units</p>
                <p className="text-sm text-gray-500">Current Stock</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Reorder Level</p>
                <p className="text-sm font-medium text-gray-900">{item.reorderLevel} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Suggested Order</p>
                <p className="text-sm font-medium text-gray-900">{item.reorderQuantity} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Cost</p>
                <p className="text-sm font-medium text-gray-900">${(item.reorderQuantity * item.unitCost).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lead Time</p>
                <p className="text-sm font-medium text-gray-900">{item.leadTime} days</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t">
              <button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <ShoppingCart className="w-4 h-4 mr-1" />
                Create Order
              </button>
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-1" />
                Update Levels
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Reordering</h1>
          <p className="text-gray-600">Manage reorder points, purchase orders, and stock alerts</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('reorder-points')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reorder-points'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reorder Points
              </button>
              <button
                onClick={() => setActiveTab('purchase-orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'purchase-orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Purchase Orders
              </button>
              <button
                onClick={() => setActiveTab('low-stock')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'low-stock'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Low Stock Alerts
                {lowStockAlerts.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {lowStockAlerts.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'reorder-points' && renderReorderPointsTab()}
          {activeTab === 'purchase-orders' && renderPurchaseOrdersTab()}
          {activeTab === 'low-stock' && renderLowStockTab()}
        </div>
      </div>
    </div>
  );
};

export default InventoryReordering;
