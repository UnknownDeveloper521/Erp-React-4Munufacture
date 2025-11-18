import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowRightLeft,
  BarChart3,
  Building2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  DollarSign,
  Edit,
  Layers,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import InventoryBreadcrumbs from './components/InventoryBreadcrumbs';
import InfoTooltip from './components/InfoTooltip';
import GuidedTourPanel from './components/GuidedTourPanel';

const InventoryDashboard = ({ onNavigate }) => {
  const [role, setRole] = useState('warehouse_manager');
  const [stats] = useState({
    totalItems: 1247,
    totalValue: 245680.5,
    lowStockItems: 23,
    pendingTransfers: 5,
    expiringSoon: 8,
    recentTransactions: 12
  });
  const [insightsCollapsed, setInsightsCollapsed] = useState(false);
  const [actionsCollapsed, setActionsCollapsed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setLastUpdated(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  const formattedUpdatedTime = useMemo(
    () => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(lastUpdated),
    [lastUpdated]
  );

  const lowStockItems = [
    { id: 1, name: 'Product A', currentStock: 5, reorderPoint: 20, location: 'Warehouse A', urgency: 'High' },
    { id: 2, name: 'Product B', currentStock: 8, reorderPoint: 15, location: 'Warehouse B', urgency: 'Medium' },
    { id: 3, name: 'Product C', currentStock: 12, reorderPoint: 25, location: 'Warehouse A', urgency: 'Medium' }
  ];

  const pendingTransfers = [
    { id: 1, from: 'Warehouse A', to: 'Warehouse B', items: 3, status: 'Pending', date: '2024-01-15' },
    { id: 2, from: 'Warehouse B', to: 'Warehouse C', items: 5, status: 'In Transit', date: '2024-01-14' }
  ];

  const pendingAdjustments = [
    { id: 1, reason: 'Damage audit', location: 'Warehouse C', items: 12, status: 'Awaiting Approval', date: '2024-01-13' },
    { id: 2, reason: 'Cycle count variance', location: 'Warehouse A', items: 7, status: 'Draft', date: '2024-01-12' }
  ];

  const expiringItems = [
    { id: 1, name: 'Product X', batch: 'BATCH-001', expiryDate: '2024-01-20', daysLeft: 5 },
    { id: 2, name: 'Product Y', batch: 'BATCH-002', expiryDate: '2024-01-25', daysLeft: 10 }
  ];

  const recentTransactions = [
    { id: 1, type: 'In', product: 'Product A', quantity: 50, location: 'Warehouse A', time: '2 hours ago' },
    { id: 2, type: 'Out', product: 'Product B', quantity: 25, location: 'Warehouse B', time: '4 hours ago' },
    { id: 3, type: 'Transfer', product: 'Product C', quantity: 30, from: 'Warehouse A', to: 'Warehouse B', time: '6 hours ago' }
  ];

  const warehouseStock = [
    { id: 1, name: 'Warehouse A', percentage: 45, value: 110320, trend: '+4%', color: 'bg-green-500' },
    { id: 2, name: 'Warehouse B', percentage: 32, value: 78500, trend: '-2%', color: 'bg-blue-500' },
    { id: 3, name: 'Warehouse C', percentage: 23, value: 56860, trend: '+1%', color: 'bg-purple-500' }
  ];

  const guidedSteps = [
    { title: 'Monitor Stock Value', description: 'Use the real-time stock widget to track total value and prioritize actions.' },
    { title: 'Resolve Operations Faster', description: 'Head to the action center to approve transfers and adjustments in one tap.' },
    { title: 'Stay Audit Ready', description: 'Use the reporting panel to export stock trends and share insights.' }
  ];

  const reportShortcuts = [
    { id: 'trend', label: 'Stock Trends', description: 'View historical levels and forecast', action: () => onNavigate && onNavigate('reports') },
    { id: 'value', label: 'Inventory Value', description: 'Breakdown by warehouse & category', action: () => onNavigate && onNavigate('reports') },
    { id: 'transactions', label: 'Transaction Log', description: 'Filter by type or date range', action: () => onNavigate && onNavigate('stock') }
  ];

  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems.toLocaleString(),
      icon: Package,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+8.5%',
      changeType: 'positive'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      change: '-3',
      changeType: 'positive'
    },
    {
      title: 'Pending Transfers',
      value: stats.pendingTransfers,
      icon: ArrowRightLeft,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+2',
      changeType: 'negative'
    }
  ];

  const keyTrends = useMemo(
    () => [
      {
        id: 'value',
        label: 'Inventory Value',
        value: `$${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        change: '+$18k vs last month',
        changeType: 'positive',
        icon: Activity
      },
      {
        id: 'risk',
        label: 'Stock At Risk',
        value: '14 items',
        change: '+4 flagged items',
        changeType: 'negative',
        icon: ShieldAlert
      },
      {
        id: 'velocity',
        label: 'Pick Velocity',
        value: '318 lines/day',
        change: '+6% throughput',
        changeType: 'positive',
        icon: Layers
      }
    ],
    [stats.totalValue]
  );

  const roleWidgets = useMemo(
    () => ({
      warehouse_manager: [
        {
          title: 'Stock at Risk',
          value: '23 items',
          helper: 'Below reorder or expiring',
          status: 'High priority',
          icon: ShieldAlert,
          accent: 'bg-red-50 text-red-700'
        },
        {
          title: 'Awaiting Approvals',
          value: '4 workflows',
          helper: 'Transfers & adjustments',
          status: 'Review today',
          icon: ClipboardList,
          accent: 'bg-yellow-50 text-yellow-700'
        }
      ],
      staff: [
        {
          title: 'Today’s Picks',
          value: '32 orders',
          helper: 'Assigned to you',
          status: 'Due in 3 hrs',
          icon: Activity,
          accent: 'bg-blue-50 text-blue-700'
        },
        {
          title: 'Cycle Counts',
          value: '5 tasks',
          helper: 'Awaiting check',
          status: 'Start after lunch',
          icon: Layers,
          accent: 'bg-green-50 text-green-700'
        }
      ]
    }),
    []
  );

  const widgetsForRole = roleWidgets[role] || [];

  const operationalQueue = [
    {
      id: 'transfers',
      label: 'Pending Transfers',
      count: stats.pendingTransfers,
      cta: 'Manage Transfers',
      color: 'bg-purple-50 text-purple-700',
      icon: ArrowRightLeft,
      view: 'transfers',
      items: pendingTransfers
    },
    {
      id: 'adjustments',
      label: 'Stock Adjustments',
      count: pendingAdjustments.length,
      cta: 'Review Adjustments',
      color: 'bg-orange-50 text-orange-700',
      icon: Edit,
      view: 'adjustments',
      items: pendingAdjustments
    }
  ];

  const lowStockBadges = lowStockItems.slice(0, 3);

  const reportPanelItems = [
    { label: 'Export Snapshot', description: 'Download CSV or PDF', actionLabel: 'Export', view: 'reports' },
    { label: 'Schedule Email', description: 'Automate weekly KPIs', actionLabel: 'Schedule', view: 'reports' },
    { label: 'Open Report Builder', description: 'Custom metrics & filters', actionLabel: 'Open', view: 'reports' }
  ];

  return (
    <div className="p-6 space-y-6">
      <InventoryBreadcrumbs
        items={[
          { label: 'Inventory', href: 'dashboard' },
          { label: 'Overview Dashboard' }
        ]}
        onCrumbClick={(crumb) => crumb.href && onNavigate && onNavigate(crumb.href)}
      />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
            <InfoTooltip
              title="Live Dashboard"
              description="Monitor value, risk, and action queues with accessible, responsive insights."
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">Real-time overview of value, risk, and workload</p>
          <p className="text-xs text-gray-500 mt-1">
            Synced at <span className="font-semibold text-gray-700">{formattedUpdatedTime}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setInsightsCollapsed(!insightsCollapsed)}
            className="inline-flex items-center px-3 py-2 text-sm border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {insightsCollapsed ? 'Show Insights' : 'Hide Insights'}
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View as:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              aria-label="Select role view"
            >
              <option value="warehouse_manager">Warehouse Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span
                  className={`font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {widgetsForRole.map((widget) => {
          const IconComponent = widget.icon;
          return (
            <div key={widget.title} className="rounded-xl border border-gray-200 p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{widget.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{widget.value}</p>
                  <p className="text-sm text-gray-600 mt-2">{widget.helper}</p>
                  <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full mt-3 ${widget.accent}`}>
                    {widget.status}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <IconComponent className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Real-time Stock Value</h2>
                  <p className="text-xs text-gray-500">Updates every minute</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLastUpdated(new Date())}
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </button>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Based on {stats.totalItems.toLocaleString()} tracked SKUs
              </p>
              <div className="mt-6 border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Stock at Risk</p>
                  <p className="text-lg font-semibold text-red-600">14 items</p>
                  <span className="text-xs text-gray-500">Needs action within 24h</span>
                </div>
                <div>
                  <p className="text-gray-500">Healthy Stock</p>
                  <p className="text-lg font-semibold text-green-600">89%</p>
                  <span className="text-xs text-gray-500">Above reorder level</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold text-gray-900">Stock by Warehouse</h2>
                  <InfoTooltip
                    title="Warehouse Distribution"
                    description="Visual breakdown of stock value and growth trend per warehouse. Use it to rebalance inventory."
                  />
                </div>
                <Building2 className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <div className="space-y-4">
                {warehouseStock.map((warehouse) => (
                  <div key={warehouse.id}>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>{warehouse.name}</span>
                      <span className="font-semibold text-gray-900">{warehouse.trend}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className={`${warehouse.color} h-2 rounded-full`}
                          style={{ width: `${warehouse.percentage}%` }}
                        />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">{warehouse.percentage}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Value: ${warehouse.value.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">Stock Level Trends</h2>
                <InfoTooltip
                  title="Trend Insights"
                  description="Use historical levels to anticipate replenishment cycles and identify anomalies."
                />
              </div>
              <button
                onClick={() => onNavigate && onNavigate('reports')}
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
                aria-label="View detailed reports"
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <BarChart3 className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600">Chart placeholder</p>
              <p className="text-xs text-gray-500">Connect analytics to render live chart.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">Key Trends</h2>
                <InfoTooltip
                  title="Key Trends"
                  description="Condensed KPIs highlighting abnormal behaviour such as high-risk stock or throughput changes."
                />
              </div>
              <button
                type="button"
                onClick={() => setInsightsCollapsed(!insightsCollapsed)}
                className="text-gray-600 hover:text-gray-900"
              >
                {insightsCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </button>
            </div>
            {!insightsCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                {keyTrends.map((trend) => {
                  const IconComponent = trend.icon;
                  return (
                    <div key={trend.id} className="rounded-lg border border-gray-100 p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">{trend.label}</p>
                        <IconComponent className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-xl font-semibold text-gray-900 mt-2">{trend.value}</p>
                      <p
                        className={`text-sm mt-1 ${
                          trend.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {trend.change}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button
                onClick={() => onNavigate && onNavigate('stock')}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
                aria-label="View all transactions"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === 'In'
                          ? 'bg-green-100'
                          : transaction.type === 'Out'
                          ? 'bg-red-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      {transaction.type === 'In' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : transaction.type === 'Out' ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.product}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.type === 'Transfer'
                          ? `${transaction.from} → ${transaction.to}`
                          : transaction.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{transaction.quantity} units</p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">Action Center</h2>
                <InfoTooltip
                  title="Pending Actions"
                  description="Resolve transfers and adjustments directly to keep operations moving."
                />
              </div>
              <button
                type="button"
                onClick={() => setActionsCollapsed(!actionsCollapsed)}
                className="text-gray-600 hover:text-gray-900"
              >
                {actionsCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </button>
            </div>
            {!actionsCollapsed && (
              <div className="p-6 space-y-4">
                {operationalQueue.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <div key={action.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:bg-white transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`${action.color} inline-flex items-center justify-center w-10 h-10 rounded-full mr-3`}>
                            <IconComponent className="w-5 h-5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                            <p className="text-xs text-gray-500">
                              {action.count} workflow{action.count !== 1 ? 's' : ''} awaiting action
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate(action.view)}
                          className="text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                          {action.cta}
                        </button>
                      </div>
                      <div className="mt-3 text-xs text-gray-600 space-y-1">
                        {action.items.slice(0, 2).map((item) => (
                          <p key={item.id}>
                            •{' '}
                            {action.label === 'Pending Transfers'
                              ? `${item.from} → ${item.to}`
                              : `${item.reason} (${item.location})`}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
              </div>
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                {stats.lowStockItems}
              </span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <span className="text-xs font-semibold text-red-600">{item.currentStock} left</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Reorder: {item.reorderPoint}</span>
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full font-semibold ${
                        item.urgency === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.urgency} urgency
                    </span>
                    <button
                      onClick={() => onNavigate && onNavigate('reordering')}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => onNavigate && onNavigate('stock')}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center"
              >
                View All Low Stock
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <div className="flex -space-x-2 overflow-hidden">
                {lowStockBadges.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border text-xs font-semibold text-gray-700"
                  >
                    {item.name.charAt(0)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Pending Transfers</h2>
              </div>
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                {stats.pendingTransfers}
              </span>
            </div>
            <div className="space-y-3">
              {pendingTransfers.map((transfer) => (
                <div key={transfer.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ArrowRightLeft className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {transfer.from} → {transfer.to}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        transfer.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {transfer.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{transfer.items} items</span>
                    <span>{transfer.date}</span>
                  </div>
                  <button
                    onClick={() => onNavigate && onNavigate('transfers')}
                    className="mt-2 w-full text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition-colors font-medium"
                    aria-label={`View transfer ${transfer.id}`}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ClipboardList className="w-5 h-5 text-orange-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Stock Adjustments</h2>
              </div>
              <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">
                {pendingAdjustments.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingAdjustments.map((adjustment) => (
                <div key={adjustment.id} className="border border-orange-100 rounded-lg p-3 bg-orange-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{adjustment.reason}</p>
                    <span className="text-xs font-semibold text-orange-700">{adjustment.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{adjustment.items} items</span>
                    <span>{adjustment.location}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Updated {adjustment.date}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate && onNavigate('adjustments')}
              className="mt-4 w-full text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center"
            >
              View Adjustment Log
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {role === 'warehouse_manager' && (
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Expiring Soon</h2>
                </div>
                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {stats.expiringSoon}
                </span>
              </div>
              <div className="space-y-3">
                {expiringItems.map((item) => (
                  <div key={item.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <span className="text-xs font-semibold text-orange-600">{item.daysLeft} days</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span>Batch: {item.batch}</span>
                      <span className="ml-2">Expires: {item.expiryDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate && onNavigate('stock')}
                className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                aria-label="Add new item"
              >
                <div className="flex items-center">
                  <Plus className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">Add New Item</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => onNavigate && onNavigate('transfers')}
                className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
                aria-label="Create transfer"
              >
                <div className="flex items-center">
                  <ArrowRightLeft className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="font-medium text-gray-900">Create Transfer</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => onNavigate && onNavigate('adjustments')}
                className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left"
                aria-label="Make adjustment"
              >
                <div className="flex items-center">
                  <Edit className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="font-medium text-gray-900">Adjust Stock</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-900">Reporting & Exports</h2>
              <InfoTooltip
                title="Reporting Panel"
                description="Launch curated reports, export datasets, or schedule automated deliveries."
              />
            </div>
            <p className="text-sm text-gray-600">
              Export stock trends, transaction logs, and status summaries in a single click.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('reports')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Open Reports
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportPanelItems.map((item) => (
            <div key={item.label} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate(item.view)}
                className="mt-4 text-sm font-medium text-green-600 hover:text-green-800"
              >
                {item.actionLabel}
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportShortcuts.map((shortcut) => (
            <div key={shortcut.id} className="border border-gray-100 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-900">{shortcut.label}</p>
              <p className="text-xs text-gray-600 mt-1">{shortcut.description}</p>
              <button
                type="button"
                onClick={shortcut.action}
                className="text-sm text-green-600 hover:text-green-800 font-medium mt-3"
              >
                Open
              </button>
            </div>
          ))}
        </div>
      </div>

      <GuidedTourPanel steps={guidedSteps} />
    </div>
  );
};

export default InventoryDashboard;


