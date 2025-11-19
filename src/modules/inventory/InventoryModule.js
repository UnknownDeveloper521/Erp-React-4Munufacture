import React, { useEffect, useState } from 'react';
import InventoryDashboard from './InventoryDashboard';
import InventoryList from './components/InventoryList';
import InventoryItemDetail from './InventoryItemDetail';
import InventoryStock from './components/InventoryStock';
import InventoryTransfers from './components/InventoryTransfers';
import InventoryAdjustments from './components/InventoryAdjustments';
import InventoryReordering from './components/InventoryReordering';
import InventoryReports from './components/InventoryReports';

const InventoryModule = ({ activeView = 'dashboard' }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentView, setCurrentView] = useState(activeView);

  useEffect(() => {
    setCurrentView(activeView);
  }, [activeView]);

  const handleViewChange = (view) => {
    setCurrentView(view);
    setSelectedItem(null);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setCurrentView('stock');
  };

  const renderView = () => {
    if (selectedItem && currentView === 'detail') {
      return (
        <InventoryItemDetail
          item={selectedItem}
          onBack={handleBackToList}
          onNavigate={handleViewChange}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <InventoryDashboard onNavigate={handleViewChange} />;
      case 'stock':
        return <InventoryStock onNavigate={handleViewChange} />;
      case 'inventory-dashboard':
        return <InventoryDashboard onNavigate={handleViewChange} />;
      case 'inventory-stock':
        return <InventoryStock onNavigate={handleViewChange} />;
      case 'inventory-add-item':
        return <InventoryStock onNavigate={handleViewChange} />;
      case 'inventory-export':
        return <InventoryStock onNavigate={handleViewChange} />;
      case 'transfers':
        return <InventoryTransfers />;
      case 'inventory-transfers':
        return <InventoryTransfers />;
      case 'inventory-create-transfer':
        return <InventoryTransfers />;
      case 'inventory-pending-transfers':
        return <InventoryTransfers />;
      case 'adjustments':
        return <InventoryAdjustments />;
      case 'inventory-adjustments':
        return <InventoryAdjustments />;
      case 'inventory-create-adjustment':
        return <InventoryAdjustments />;
      case 'inventory-adjustment-history':
        return <InventoryAdjustments />;
      case 'reordering':
        return <InventoryReordering />;
      case 'inventory-reordering':
        return <InventoryReordering />;
      case 'inventory-low-stock':
        return <InventoryReordering />;
      case 'inventory-purchase-orders':
        return <InventoryReordering />;
      case 'reports':
        return <InventoryReports />;
      case 'inventory-reports':
        return <InventoryReports />;
      case 'inventory-stock-levels':
        return <InventoryReports />;
      case 'inventory-movements':
        return <InventoryReports />;
      case 'inventory-valuation':
        return <InventoryReports />;
      default:
        return <InventoryDashboard onNavigate={handleViewChange} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default InventoryModule;

