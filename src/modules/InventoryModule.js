import React, { useEffect, useState } from 'react';
import InventoryDashboard from './inventory/InventoryDashboard';
import InventoryList from './inventory/components/InventoryList';
import InventoryItemDetail from './inventory/InventoryItemDetail';
import InventoryTransfers from './inventory/InventoryTransfers';
import InventoryAdjustments from './inventory/InventoryAdjustments';
import InventoryReports from './inventory/InventoryReports';

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
        return (
          <InventoryList
            onItemSelect={handleItemSelect}
            onNavigate={handleViewChange}
          />
        );
      case 'transfers':
        return <InventoryTransfers />;
      case 'adjustments':
        return <InventoryAdjustments />;
      case 'reordering':
        return <InventoryReports view="reordering" />;
      case 'reports':
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

