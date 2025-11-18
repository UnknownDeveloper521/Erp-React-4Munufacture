import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowRightLeft,
  ArrowUp,
  ArrowUpDown,
  Download,
  Edit,
  Eye,
  Hash,
  MapPin,
  MoreVertical,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Tag,
  XCircle
} from 'lucide-react';
import InventoryBreadcrumbs from './InventoryBreadcrumbs';
import InfoTooltip from './InfoTooltip';

const InventoryList = ({ onItemSelect, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    status: '',
    category: '',
    tracking: 'all'
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [quickView, setQuickView] = useState('all');

  const inventoryData = [
    {
      id: 1,
      sku: 'PROD-001',
      name: 'Product A',
      category: 'Electronics',
      quantity: 150,
      reorderPoint: 20,
      location: 'Warehouse A',
      batch: 'BATCH-001',
      serial: null,
      status: 'In Stock',
      value: 15000.0,
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      sku: 'PROD-002',
      name: 'Product B',
      category: 'Furniture',
      quantity: 8,
      reorderPoint: 15,
      location: 'Warehouse B',
      batch: 'BATCH-002',
      serial: 'SERIAL-001',
      status: 'Low Stock',
      value: 2400.0,
      lastUpdated: '2024-01-14'
    },
    {
      id: 3,
      sku: 'PROD-003',
      name: 'Product C',
      category: 'Electronics',
      quantity: 0,
      reorderPoint: 10,
      location: 'Warehouse A',
      batch: null,
      serial: null,
      status: 'Out of Stock',
      value: 0.0,
      lastUpdated: '2024-01-13'
    },
    {
      id: 4,
      sku: 'PROD-004',
      name: 'Product D',
      category: 'Office Supplies',
      quantity: 45,
      reorderPoint: 30,
      location: 'Warehouse C',
      batch: 'BATCH-003',
      serial: null,
      status: 'In Stock',
      value: 2250.0,
      lastUpdated: '2024-01-15'
    }
  ];

  const locations = ['All Locations', 'Warehouse A', 'Warehouse B', 'Warehouse C'];
  const statuses = ['All Statuses', 'In Stock', 'Low Stock', 'Out of Stock'];
  const categories = ['All Categories', 'Electronics', 'Furniture', 'Office Supplies'];
  const quickViews = [
    { id: 'all', label: 'All inventory' },
    { id: 'low', label: 'Low stock' },
    { id: 'risk', label: 'At risk', helper: 'Qty <= reorder' },
    { id: 'batch', label: 'Batch/serial' }
  ];

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = inventoryData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        !selectedFilters.location ||
        selectedFilters.location === 'All Locations' ||
        item.location === selectedFilters.location;
      const matchesStatus =
        !selectedFilters.status ||
        selectedFilters.status === 'All Statuses' ||
        item.status === selectedFilters.status;
      const matchesCategory =
        !selectedFilters.category ||
        selectedFilters.category === 'All Categories' ||
        item.category === selectedFilters.category;
      const matchesTracking =
        selectedFilters.tracking === 'all'
          ? true
          : selectedFilters.tracking === 'tracked'
            ? Boolean(item.batch || item.serial)
            : !item.batch && !item.serial;

      let matchesQuickView = true;
      if (quickView === 'low') {
        matchesQuickView = item.status === 'Low Stock';
      } else if (quickView === 'risk') {
        matchesQuickView = item.quantity <= item.reorderPoint;
      } else if (quickView === 'batch') {
        matchesQuickView = Boolean(item.batch || item.serial);
      }

      return (
        matchesSearch &&
        matchesLocation &&
        matchesStatus &&
        matchesCategory &&
        matchesTracking &&
        matchesQuickView
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return filtered;
  }, [inventoryData, selectedFilters, searchTerm, sortConfig, quickView]);

  const getStatusBadge = (status) => {
    const styles = {
      'In Stock': 'bg-green-100 text-green-800 border-green-200',
      'Low Stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Out of Stock': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          styles[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  };

  const activeFilterChips = [
    selectedFilters.location && {
      key: 'location',
      label: `Location: ${selectedFilters.location}`
    },
    selectedFilters.status && {
      key: 'status',
      label: `Status: ${selectedFilters.status}`
    },
    selectedFilters.category && {
      key: 'category',
      label: `Category: ${selectedFilters.category}`
    },
    selectedFilters.tracking !== 'all' && {
      key: 'tracking',
      label: selectedFilters.tracking === 'tracked' ? 'Tracked lots' : 'Untracked items'
    },
    quickView !== 'all' && {
      key: 'quickView',
      label: `View: ${quickViews.find((view) => view.id === quickView)?.label}`
    }
  ].filter(Boolean);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredAndSortedData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleRowAction = (event, view) => {
    event.stopPropagation();
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const quantityProgress = (item) => {
    if (item.reorderPoint === 0) return 100;
    return Math.min(100, Math.round((item.quantity / item.reorderPoint) * 100));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="w-4 h-4 text-green-600" />
      : <ArrowDown className="w-4 h-4 text-green-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      <InventoryBreadcrumbs
        items={[
          { label: 'Inventory', href: 'dashboard' },
          { label: 'Stock List' }
        ]}
        onCrumbClick={(crumb) => crumb.href && onNavigate && onNavigate(crumb.href)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Inventory Stock</h1>
            <InfoTooltip
              title="Interactive Grid"
              description="Search, filter, and trigger transfer, adjustment, or reorder flows straight from the grid."
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">Manage batch, location, and availability for every SKU.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFiltersExpanded((prev) => !prev)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {filtersExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Export inventory"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            aria-label="Add new item"
            onClick={() => onNavigate && onNavigate('stock')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {filtersExpanded && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, SKU, category or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                aria-label="Search inventory"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {quickViews.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setQuickView(view.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    quickView === view.id
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'text-gray-600 border-gray-200'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 flex items-center mb-1">
                Location
                <InfoTooltip title="Warehouse filter" description="Limit the result set to a single warehouse or view all locations." />
              </label>
              <select
                value={selectedFilters.location}
                onChange={(e) => setSelectedFilters((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                aria-label="Filter by location"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc === 'All Locations' ? '' : loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 flex items-center mb-1">
                Status
                <InfoTooltip title="Stock status" description="Highlight ready, low, or out-of-stock products." />
              </label>
              <select
                value={selectedFilters.status}
                onChange={(e) => setSelectedFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                aria-label="Filter by status"
              >
                {statuses.map((status) => (
                  <option key={status} value={status === 'All Statuses' ? '' : status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 flex items-center mb-1">Category</label>
              <select
                value={selectedFilters.category}
                onChange={(e) => setSelectedFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                aria-label="Filter by category"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 flex items-center mb-1">
                Tracking
                <InfoTooltip title="Batch/Serial" description="Surface only tracked lots or non-tracked SKUs." />
              </label>
              <select
                value={selectedFilters.tracking}
                onChange={(e) => setSelectedFilters((prev) => ({ ...prev, tracking: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                aria-label="Filter by tracking"
              >
                <option value="all">All</option>
                <option value="tracked">Batch/Serial</option>
                <option value="untracked">Untracked</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {activeFilterChips.map((chip) => (
            <span key={chip.key} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200">
              <Tag className="w-3 h-3 mr-1" />
              {chip.label}
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  if (chip.key === 'quickView') {
                    setQuickView('all');
                  } else if (chip.key === 'tracking') {
                    setSelectedFilters((prev) => ({ ...prev, tracking: 'all' }));
                  } else {
                    setSelectedFilters((prev) => ({ ...prev, [chip.key]: '' }));
                  }
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
        <span>
          Showing <strong>{filteredAndSortedData.length}</strong> of <strong>{inventoryData.length}</strong> items
        </span>
        {selectedItems.length > 0 && (
          <span className="text-green-600 font-medium">
            {selectedItems.length} item(s) selected
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    aria-label="Select all items"
                    checked={selectedItems.length === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('sku')}
                >
                  <div className="flex items-center space-x-1">
                    <span>SKU</span>
                    <SortIcon columnKey="sku" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Product Name</span>
                    <SortIcon columnKey="name" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Quantity</span>
                    <SortIcon columnKey="quantity" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch/Serial
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('value')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Value</span>
                    <SortIcon columnKey="value" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No items found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onItemSelect && onItemSelect(item)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        aria-label={`Select ${item.name}`}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{item.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{item.quantity}</div>
                      <div className="text-xs text-gray-500">Reorder: {item.reorderPoint}</div>
                      <div className="mt-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${item.quantity <= item.reorderPoint ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${quantityProgress(item)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {item.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.batch && (
                          <span className="inline-flex items-center">
                            <Hash className="w-3 h-3 text-gray-400 mr-1" />
                            {item.batch}
                          </span>
                        )}
                        {item.serial && (
                          <span className="ml-2 inline-flex items-center">
                            <Hash className="w-3 h-3 text-gray-400 mr-1" />
                            {item.serial}
                          </span>
                        )}
                        {!item.batch && !item.serial && <span className="text-gray-400">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onItemSelect && onItemSelect(item)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          aria-label={`View details for ${item.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(event) => handleRowAction(event, 'transfers')}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                          aria-label={`Transfer ${item.name}`}
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(event) => handleRowAction(event, 'adjustments')}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                          aria-label={`Adjust ${item.name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                          aria-label={`More options for ${item.name}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
