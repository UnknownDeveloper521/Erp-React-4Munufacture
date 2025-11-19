import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

const InventoryStock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Dummy stock data
  const [stockItems, setStockItems] = useState([
    {
      id: 1,
      itemCode: 'ITM001',
      itemName: 'Wireless Mouse',
      category: 'Electronics',
      brand: 'Logitech',
      description: 'Wireless optical mouse with USB receiver',
      currentStock: 15,
      reservedStock: 3,
      availableStock: 12,
      reorderLevel: 20,
      maxStock: 100,
      unitCost: 25.99,
      sellingPrice: 39.99,
      supplier: 'Tech Supplies Co.',
      location: 'Warehouse A - Shelf 12',
      lastUpdated: '2024-11-18',
      status: 'low_stock',
      image: '/api/placeholder/150/150'
    },
    {
      id: 2,
      itemCode: 'ITM002',
      itemName: 'Office Chair',
      category: 'Furniture',
      brand: 'Herman Miller',
      description: 'Ergonomic office chair with lumbar support',
      currentStock: 8,
      reservedStock: 2,
      availableStock: 6,
      reorderLevel: 10,
      maxStock: 50,
      unitCost: 149.99,
      sellingPrice: 249.99,
      supplier: 'Office Furniture Ltd.',
      location: 'Warehouse B - Section 3',
      lastUpdated: '2024-11-17',
      status: 'low_stock',
      image: '/api/placeholder/150/150'
    },
    {
      id: 3,
      itemCode: 'ITM003',
      itemName: 'A4 Paper',
      category: 'Stationery',
      brand: 'HP',
      description: 'Premium white A4 printing paper - 500 sheets',
      currentStock: 45,
      reservedStock: 5,
      availableStock: 40,
      reorderLevel: 30,
      maxStock: 200,
      unitCost: 4.99,
      sellingPrice: 7.99,
      supplier: 'Paper World Inc.',
      location: 'Warehouse A - Shelf 5',
      lastUpdated: '2024-11-18',
      status: 'in_stock',
      image: '/api/placeholder/150/150'
    },
    {
      id: 4,
      itemCode: 'ITM004',
      itemName: 'Laptop Stand',
      category: 'Electronics',
      brand: 'Rain Design',
      description: 'Aluminum laptop stand with cooling design',
      currentStock: 2,
      reservedStock: 1,
      availableStock: 1,
      reorderLevel: 5,
      maxStock: 30,
      unitCost: 35.50,
      sellingPrice: 59.99,
      supplier: 'Tech Supplies Co.',
      location: 'Warehouse A - Shelf 15',
      lastUpdated: '2024-11-16',
      status: 'critical',
      image: '/api/placeholder/150/150'
    },
    {
      id: 5,
      itemCode: 'ITM005',
      itemName: 'Desk Lamp',
      category: 'Electronics',
      brand: 'Philips',
      description: 'LED desk lamp with adjustable brightness',
      currentStock: 25,
      reservedStock: 0,
      availableStock: 25,
      reorderLevel: 15,
      maxStock: 60,
      unitCost: 29.99,
      sellingPrice: 49.99,
      supplier: 'Lighting Solutions',
      location: 'Warehouse B - Shelf 8',
      lastUpdated: '2024-11-18',
      status: 'in_stock',
      image: '/api/placeholder/150/150'
    },
    {
      id: 6,
      itemCode: 'ITM006',
      itemName: 'Whiteboard Markers',
      category: 'Stationery',
      brand: 'Sharpie',
      description: 'Set of 4 colored whiteboard markers',
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      reorderLevel: 20,
      maxStock: 100,
      unitCost: 8.99,
      sellingPrice: 14.99,
      supplier: 'Office Supplies Plus',
      location: 'Warehouse A - Shelf 3',
      lastUpdated: '2024-11-15',
      status: 'out_of_stock',
      image: '/api/placeholder/150/150'
    }
  ]);

  const categories = ['all', ...new Set(stockItems.map(item => item.category))];
  const statuses = ['all', 'in_stock', 'low_stock', 'critical', 'out_of_stock'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'out_of_stock': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock': return <CheckCircle className="w-4 h-4" />;
      case 'low_stock': return <TrendingDown className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'out_of_stock': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredAndSortedItems = stockItems
    .filter(item => {
      const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.itemName.toLowerCase();
          bValue = b.itemName.toLowerCase();
          break;
        case 'stock':
          aValue = a.currentStock;
          bValue = b.currentStock;
          break;
        case 'value':
          aValue = a.currentStock * a.unitCost;
          bValue = b.currentStock * b.unitCost;
          break;
        case 'updated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        default:
          aValue = a.itemName.toLowerCase();
          bValue = b.itemName.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const totalStockValue = stockItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  const lowStockCount = stockItems.filter(item => item.status === 'low_stock' || item.status === 'critical').length;
  const outOfStockCount = stockItems.filter(item => item.status === 'out_of_stock').length;

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAndSortedItems.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200">
            <img
              src={item.image}
              alt={item.itemName}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">{item.itemName}</h3>
                <p className="text-xs text-gray-500">{item.itemCode}</p>
                <p className="text-xs text-gray-400">{item.brand}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
                <span className="ml-1">{item.status.replace('_', ' ')}</span>
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Stock:</span>
                <span className="font-medium">{item.currentStock} units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Available:</span>
                <span className="font-medium">{item.availableStock} units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Value:</span>
                <span className="font-medium">${(item.currentStock * item.unitCost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Location:</span>
                <span className="font-medium text-xs">{item.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button className="p-1 text-blue-600 hover:text-blue-900">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-green-600 hover:text-green-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-900 font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Levels
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pricing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
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
            {filteredAndSortedItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-lg object-cover" src={item.image} alt={item.itemName} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                      <div className="text-sm text-gray-500">{item.itemCode}</div>
                      <div className="text-xs text-gray-400">{item.brand} • {item.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>Current: <span className="font-medium">{item.currentStock}</span></div>
                    <div>Available: <span className="font-medium">{item.availableStock}</span></div>
                    <div>Reserved: <span className="font-medium">{item.reservedStock}</span></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>Cost: <span className="font-medium">${item.unitCost}</span></div>
                    <div>Price: <span className="font-medium">${item.sellingPrice}</span></div>
                    <div>Value: <span className="font-medium">${(item.currentStock * item.unitCost).toFixed(2)}</span></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.location}</div>
                  <div className="text-sm text-gray-500">{item.supplier}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1">{item.status.replace('_', ' ')}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="w-4 h-4" />
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
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600">Monitor and manage your inventory stock levels</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-semibold text-gray-900">{stockItems.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">${totalStockValue.toFixed(0)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-semibold text-orange-600">{lowStockCount}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-semibold text-red-600">{outOfStockCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
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
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="stock">Sort by Stock</option>
                <option value="value">Sort by Value</option>
                <option value="updated">Sort by Updated</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Table
                </button>
              </div>
              <button className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedItems.length} of {stockItems.length} items
          </p>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? renderGridView() : renderTableView()}
      </div>
    </div>
  );
};

export default InventoryStock;
