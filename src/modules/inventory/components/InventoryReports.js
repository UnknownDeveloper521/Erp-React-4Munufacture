import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  ArrowRightLeft,
  AlertTriangle,
  Eye,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';

const InventoryReports = () => {
  const [activeReport, setActiveReport] = useState('stock-levels');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dummy data for reports
  const stockLevelsData = [
    { category: 'Electronics', totalItems: 45, totalValue: 12450.50, lowStock: 8, outOfStock: 2 },
    { category: 'Furniture', totalItems: 23, totalValue: 8750.25, lowStock: 3, outOfStock: 1 },
    { category: 'Stationery', totalItems: 67, totalValue: 2340.75, lowStock: 12, outOfStock: 5 },
    { category: 'Office Supplies', totalItems: 34, totalValue: 1890.30, lowStock: 6, outOfStock: 0 }
  ];

  const movementData = [
    { date: '2024-11-18', inbound: 150, outbound: 89, adjustments: 5, netChange: 66 },
    { date: '2024-11-17', inbound: 75, outbound: 120, adjustments: -3, netChange: -48 },
    { date: '2024-11-16', inbound: 200, outbound: 95, adjustments: 8, netChange: 113 },
    { date: '2024-11-15', inbound: 45, outbound: 78, adjustments: -2, netChange: -35 },
    { date: '2024-11-14', inbound: 180, outbound: 156, adjustments: 12, netChange: 36 }
  ];

  const valuationData = [
    { location: 'Warehouse A', items: 89, totalValue: 15670.25, avgValue: 176.18 },
    { location: 'Warehouse B', items: 67, totalValue: 12340.80, avgValue: 184.19 },
    { location: 'Warehouse C', items: 34, totalValue: 5890.45, avgValue: 173.25 },
    { location: 'Retail Store 1', items: 45, totalValue: 8750.60, avgValue: 194.46 },
    { location: 'Retail Store 2', items: 23, totalValue: 4560.30, avgValue: 198.27 }
  ];

  const topMovingItems = [
    { itemName: 'Wireless Mouse', itemCode: 'ITM001', totalMoved: 145, value: 3765.55, trend: 'up' },
    { itemName: 'A4 Paper', itemCode: 'ITM003', totalMoved: 89, value: 444.11, trend: 'up' },
    { itemName: 'Office Chair', itemCode: 'ITM002', totalMoved: 67, value: 10049.33, trend: 'down' },
    { itemName: 'Desk Lamp', itemCode: 'ITM005', totalMoved: 45, value: 1349.55, trend: 'up' },
    { itemName: 'Laptop Stand', itemCode: 'ITM004', totalMoved: 23, value: 816.50, trend: 'down' }
  ];

  const lowStockItems = [
    { itemName: 'Laptop Stand', itemCode: 'ITM004', currentStock: 2, reorderLevel: 5, daysUntilOut: 3 },
    { itemName: 'Wireless Mouse', itemCode: 'ITM001', currentStock: 15, reorderLevel: 20, daysUntilOut: 8 },
    { itemName: 'Office Chair', itemCode: 'ITM002', currentStock: 8, reorderLevel: 10, daysUntilOut: 12 },
    { itemName: 'Whiteboard Markers', itemCode: 'ITM006', currentStock: 0, reorderLevel: 20, daysUntilOut: 0 }
  ];

  const renderStockLevelsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stockLevelsData.reduce((sum, cat) => sum + cat.totalItems, 0)}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stockLevelsData.reduce((sum, cat) => sum + cat.totalValue, 0).toFixed(0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-semibold text-orange-600">
                {stockLevelsData.reduce((sum, cat) => sum + cat.lowStock, 0)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-semibold text-red-600">
                {stockLevelsData.reduce((sum, cat) => sum + cat.outOfStock, 0)}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Stock Levels by Category</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Low Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Out of Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockLevelsData.map((category, index) => {
                const healthScore = Math.round(((category.totalItems - category.lowStock - category.outOfStock) / category.totalItems) * 100);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.totalItems}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${category.totalValue.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        {category.lowStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {category.outOfStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${healthScore >= 80 ? 'bg-green-600' : healthScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                            style={{ width: `${healthScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{healthScore}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMovementReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Movement Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-600">
              {movementData.reduce((sum, day) => sum + day.inbound, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Inbound</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600">
              {movementData.reduce((sum, day) => sum + day.outbound, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Outbound</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">
              {movementData.reduce((sum, day) => sum + day.adjustments, 0)}
            </p>
            <p className="text-sm text-gray-600">Adjustments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">
              {movementData.reduce((sum, day) => sum + day.netChange, 0)}
            </p>
            <p className="text-sm text-gray-600">Net Change</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inbound</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outbound</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjustments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movementData.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{day.inbound}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-{day.outbound}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {day.adjustments >= 0 ? '+' : ''}{day.adjustments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={day.netChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {day.netChange >= 0 ? '+' : ''}{day.netChange}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Moving Items</h3>
        <div className="space-y-3">
          {topMovingItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${item.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {item.trend === 'up' ? 
                    <TrendingUp className="w-4 h-4 text-green-600" /> : 
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.itemName}</p>
                  <p className="text-sm text-gray-500">{item.itemCode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{item.totalMoved} units</p>
                <p className="text-sm text-gray-500">${item.value.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderValuationReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Inventory Valuation by Location</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {valuationData.map((location, index) => {
                const totalValue = valuationData.reduce((sum, loc) => sum + loc.totalValue, 0);
                const percentage = ((location.totalValue / totalValue) * 100).toFixed(1);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{location.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{location.items}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${location.totalValue.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${location.avgValue.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="h-2 bg-blue-600 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Valuation Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Inventory Value:</span>
              <span className="font-semibold text-gray-900">
                ${valuationData.reduce((sum, loc) => sum + loc.totalValue, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items:</span>
              <span className="font-semibold text-gray-900">
                {valuationData.reduce((sum, loc) => sum + loc.items, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Item Value:</span>
              <span className="font-semibold text-gray-900">
                ${(valuationData.reduce((sum, loc) => sum + loc.totalValue, 0) / 
                   valuationData.reduce((sum, loc) => sum + loc.items, 0)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Highest Value Location:</span>
              <span className="font-semibold text-gray-900">
                {valuationData.reduce((max, loc) => loc.totalValue > max.totalValue ? loc : max).location}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Low Stock Alerts</h4>
          <div className="space-y-3">
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{item.itemName}</p>
                  <p className="text-sm text-gray-500">{item.itemCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    {item.currentStock}/{item.reorderLevel}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.daysUntilOut === 0 ? 'Out of stock' : `${item.daysUntilOut} days left`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const reportTabs = [
    { id: 'stock-levels', name: 'Stock Levels', icon: Package },
    { id: 'movement', name: 'Movement History', icon: ArrowRightLeft },
    { id: 'valuation', name: 'Inventory Valuation', icon: DollarSign },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Reports</h1>
          <p className="text-gray-600">Comprehensive inventory analytics and reporting</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-90-days">Last 90 Days</option>
                <option value="last-year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="stationery">Stationery</option>
                <option value="office-supplies">Office Supplies</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              <button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Schedule Report
              </button>
            </div>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {reportTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveReport(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeReport === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Report Content */}
        <div>
          {activeReport === 'stock-levels' && renderStockLevelsReport()}
          {activeReport === 'movement' && renderMovementReport()}
          {activeReport === 'valuation' && renderValuationReport()}
        </div>
      </div>
    </div>
  );
};

export default InventoryReports;
