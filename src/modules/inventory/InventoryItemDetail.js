import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRightLeft,
  Calendar,
  ClipboardList,
  DollarSign,
  Edit,
  FileText,
  Hash,
  MapPin,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  User,
  XCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import InventoryBreadcrumbs from './components/InventoryBreadcrumbs';
import InfoTooltip from './components/InfoTooltip';

const InventoryItemDetail = ({ item, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);

  const itemData = item || {
    id: 1,
    sku: 'PROD-001',
    name: 'Product A',
    description: 'High-quality product description goes here. This product is designed for optimal performance and durability.',
    category: 'Electronics',
    quantity: 150,
    reorderPoint: 20,
    location: 'Warehouse A',
    batch: 'BATCH-001',
    serial: null,
    status: 'In Stock',
    value: 15000.0,
    unitPrice: 100.0,
    lastUpdated: '2024-01-15',
    supplier: 'Supplier ABC',
    expiryDate: '2025-12-31'
  };

  const stockMovements = [
    { id: 1, type: 'In', quantity: 50, reason: 'Purchase Order', date: '2024-01-15', user: 'John Doe', reference: 'PO-001' },
    { id: 2, type: 'Out', quantity: 25, reason: 'Sales Order', date: '2024-01-14', user: 'Jane Smith', reference: 'SO-001' },
    { id: 3, type: 'Transfer', quantity: 30, reason: 'Warehouse Transfer', date: '2024-01-13', user: 'Mike Johnson', reference: 'TR-001' },
    { id: 4, type: 'Adjustment', quantity: -5, reason: 'Damaged Goods', date: '2024-01-12', user: 'Sarah Wilson', reference: 'ADJ-001' }
  ];

  const transactionHistory = [
    { id: 1, type: 'Purchase', date: '2024-01-15', amount: 5000.0, quantity: 50, status: 'Completed', reference: 'PO-001' },
    { id: 2, type: 'Sale', date: '2024-01-14', amount: 2500.0, quantity: 25, status: 'Completed', reference: 'SO-001' },
    { id: 3, type: 'Transfer', date: '2024-01-13', amount: 0, quantity: 30, status: 'Completed', reference: 'TR-001' }
  ];

  const notes = [
    { id: 1, content: 'Product received in good condition. All items verified.', author: 'John Doe', date: '2024-01-15', time: '10:30 AM' },
    { id: 2, content: 'Quality check completed. No issues found.', author: 'Jane Smith', date: '2024-01-14', time: '2:15 PM' }
  ];

  const tabs = [
    { id: 'general', label: 'General Info', icon: Package },
    { id: 'movements', label: 'Stock Movements', icon: ArrowRightLeft },
    { id: 'transactions', label: 'Transaction History', icon: DollarSign },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  const quickActions = [
    {
      id: 'transfer',
      label: 'Transfer',
      description: 'Move stock to another warehouse',
      icon: ArrowRightLeft,
      view: 'transfers',
      style: 'border-purple-200 text-purple-700 bg-purple-50'
    },
    {
      id: 'adjust',
      label: 'Adjust Stock',
      description: 'Balance counts or record losses',
      icon: ClipboardList,
      view: 'adjustments',
      style: 'border-orange-200 text-orange-700 bg-orange-50'
    },
    {
      id: 'reorder',
      label: 'Reorder',
      description: 'Trigger a purchase order',
      icon: ShoppingCart,
      view: 'reordering',
      style: 'border-green-200 text-green-700 bg-green-50'
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'In Stock': 'bg-green-100 text-green-800 border-green-200',
      'Low Stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Out of Stock': 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
      'In Stock': CheckCircle,
      'Low Stock': AlertTriangle,
      'Out of Stock': XCircle
    };

    const IconComponent = icons[status] || AlertTriangle;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        <IconComponent className="w-4 h-4 mr-1.5" />
        {status}
      </span>
    );
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case 'In':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'Out':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'Transfer':
        return <ArrowRightLeft className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
  };

  const breadcrumbItems = [
    { label: 'Inventory', href: 'dashboard' },
    { label: 'Stock List', href: 'stock' },
    { label: itemData.name }
  ];

  return (
    <div className="p-6 space-y-6">
      <InventoryBreadcrumbs
        items={breadcrumbItems}
        onCrumbClick={(crumb) => crumb.href && onNavigate && onNavigate(crumb.href)}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Back to inventory list"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">{itemData.name}</h1>
              <InfoTooltip
                title="Product detail"
                description="Review stock health, history, and notes, then trigger operational actions."
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">SKU: {itemData.sku}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(itemData.status)}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            aria-label="Edit item"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onNavigate && onNavigate(action.view)}
              className={`flex items-center justify-between border rounded-lg p-4 text-left ${action.style} transition-colors hover:bg-white`}
            >
              <div>
                <p className="text-sm font-semibold">{action.label}</p>
                <p className="text-xs text-gray-600">{action.description}</p>
              </div>
              <IconComponent className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{itemData.quantity}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${itemData.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reorder Point</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{itemData.reorderPoint}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Location</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{itemData.location}</p>
            </div>
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 px-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-label={tab.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <p className="text-sm text-gray-900">{itemData.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <p className="text-sm text-gray-900">{itemData.sku}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-sm text-gray-900">{itemData.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <p className="text-sm text-gray-900">{itemData.supplier}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                  <p className="text-sm text-gray-900">${itemData.unitPrice.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                  <p className="text-sm text-gray-900">{itemData.batch || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <p className="text-sm text-gray-900">{itemData.serial || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <p className="text-sm text-gray-900">{itemData.expiryDate || '—'}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900">{itemData.description}</p>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                Last updated: {itemData.lastUpdated}
              </div>
            </div>
          )}

          {activeTab === 'movements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-900">Movement pulse</p>
                  <p>{stockMovements.length} events this week</p>
                </div>
                <InfoTooltip
                  title="Movement history"
                  description="Use these entries to audit inbound and outbound adjustments."
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockMovements.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {getMovementIcon(movement.type)}
                            <span className="ml-2 text-sm font-medium text-gray-900">{movement.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-sm font-semibold ${
                            movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{movement.reason}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{movement.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <User className="w-4 h-4 text-gray-400 mr-1" />
                            {movement.user}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{movement.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p className="font-semibold text-gray-900">Recent financial activity</p>
                <InfoTooltip
                  title="Transactions"
                  description="Reconcile orders, transfers, and adjustments tied to this item."
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactionHistory.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{transaction.type}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{transaction.quantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {transaction.amount > 0 ? `$${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{transaction.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">Notes & Comments</h3>
                  <InfoTooltip
                    title="Notes"
                    description="Capture audit details, QA reminders, or supplier communications."
                  />
                </div>
                <button
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                  aria-label="Add new note"
                >
                  Add Note
                </button>
              </div>
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{note.author}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {note.date} at {note.time}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryItemDetail;

