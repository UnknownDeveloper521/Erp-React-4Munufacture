import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

const InfoTooltip = ({ title = 'Hint', description = '', placement = 'top' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="p-1 rounded-full text-gray-500 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label={`More info about ${title}`}
      >
        <Info className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className={`absolute z-20 w-64 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 ${placementClasses[placement] || placementClasses.top}`}
          role="tooltip"
        >
          <div className="flex items-start justify-between mb-1">
            <p className="font-semibold text-sm">{title}</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-2 text-gray-300 hover:text-white"
              aria-label="Dismiss tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="leading-snug">{description}</p>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;


