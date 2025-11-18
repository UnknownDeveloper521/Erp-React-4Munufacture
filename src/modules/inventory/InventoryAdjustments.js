import React from 'react';
import { FileEdit, Plus } from 'lucide-react';

const InventoryAdjustments = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Adjustments</h1>
          <p className="text-sm text-gray-600 mt-1">Make adjustments to inventory quantities</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          New Adjustment
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <FileEdit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Adjustment Management</h3>
        <p className="text-gray-600">Adjustment functionality will be implemented here</p>
      </div>
    </div>
  );
};

export default InventoryAdjustments;

