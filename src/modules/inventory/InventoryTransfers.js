import React from 'react';
import { ArrowRightLeft, Plus, Search, Filter } from 'lucide-react';

const InventoryTransfers = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Transfers</h1>
          <p className="text-sm text-gray-600 mt-1">Manage transfers between locations</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Transfer
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <ArrowRightLeft className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Transfer Management</h3>
        <p className="text-gray-600">Transfer functionality will be implemented here</p>
      </div>
    </div>
  );
};

export default InventoryTransfers;

