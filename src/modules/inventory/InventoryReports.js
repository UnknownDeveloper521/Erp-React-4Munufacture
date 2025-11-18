import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Download,
  Filter,
  FileText,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import InventoryBreadcrumbs from './components/InventoryBreadcrumbs';
import InfoTooltip from './components/InfoTooltip';

const summaryCards = [
  {
    title: 'Inventory Value',
    value: '$245,680',
    change: '+8.5%',
    trend: 'positive',
    icon: BarChart3
  },
  {
    title: 'Stock at Risk',
    value: '23 items',
    change: '+4 items',
    trend: 'negative',
    icon: Package
  },
  {
    title: 'Pending Transfers',
    value: '5 queues',
    change: '-2 vs last week',
    trend: 'positive',
    icon: FileText
  }
];

const reorderTable = [
  { id: 1, sku: 'PROD-002', name: 'Product B', location: 'Warehouse B', current: 8, reorderPoint: 15, supplier: 'Supplier Beta', eta: '7 days' },
  { id: 2, sku: 'PROD-003', name: 'Product C', location: 'Warehouse A', current: 0, reorderPoint: 10, supplier: 'Supplier Gamma', eta: 'Pending' }
];

const reportsTable = [
  { id: 'RPT-001', name: 'Weekly Stock Snapshot', type: 'Inventory', updated: '2024-01-15', owner: 'Operations', status: 'Scheduled' },
  { id: 'RPT-002', name: 'Warehouse Valuation', type: 'Finance', updated: '2024-01-14', owner: 'Finance', status: 'Manual' },
  { id: 'RPT-003', name: 'Low Stock Summary', type: 'Inventory', updated: '2024-01-13', owner: 'Supply Chain', status: 'Scheduled' }
];

const InventoryReports = ({ view = 'reports' }) => {
  const [filters, setFilters] = useState({
    warehouse: 'all',
    dateRange: 'Last 30 days',
    status: 'all'
  });

  const breadcrumbItems = [
    { label: 'Inventory', href: 'dashboard' },
    { label: view === 'reordering' ? 'Reordering' : 'Reports' }
  ];

  if (view === 'reordering') {
    return (
      <div className="p-6 space-y-6">
        <InventoryBreadcrumbs
          items={breadcrumbItems}
          onCrumbClick={(crumb) => crumb.href && window?.scrollTo && window.scrollTo({ top: 0 })}
        />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reordering Workbench</h1>
            <p className="text-sm text-gray-600 mt-1">Evaluate reorder points, pending POs, and supplier ETAs.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Create Purchase Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaryCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div key={card.title} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  </div>
                  <IconComponent className="w-8 h-8 text-gray-400" />
                </div>
                <p className={`text-sm mt-3 ${card.trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend === 'positive' ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
                  {card.change}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-900">Reorder Queue</h2>
              <InfoTooltip
                title="Reorder queue"
                description="View items below reorder point with supplier and ETA context."
              />
            </div>
            <button className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium">
              Export list
              <Download className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Point</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ETA</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reorderTable.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.location}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{row.current}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.reorderPoint}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.supplier}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.eta}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex items-center text-sm text-green-600 hover:text-green-800 font-medium">
                        Create PO
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <InventoryBreadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl 天天中彩票和 font-bold text-gray-900">Inventory Reports & Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Export, schedule, and visualize inventory KPIs.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            {filters.dateRange}
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            All Warehouses
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.title} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <IconComponent className="w-8 h-8 text-gray-300" />
              </div>
              <p className={`text-sm mt-3 ${card.trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {card.trend === 'positive' ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
                {card.change}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">Saved Reports</h2>
            <InfoTooltip
              title="Saved reports"
              description="Access curated and scheduled inventory analytics with one click."
            />
          </div>
          <button className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium">
            Create report
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportsTable.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{report.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{report.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{report.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{report.updated}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{report.owner}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${report.status === 'Scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center text-sm text-green-600 hover:text-green-800 font-medium">
                      View
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryReports;

