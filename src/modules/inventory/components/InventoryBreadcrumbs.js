import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const InventoryBreadcrumbs = ({ items = [], onCrumbClick }) => {
  if (!items.length) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-xs sm:text-sm text-gray-500 space-x-1 sm:space-x-2 mb-4"
    >
      <Home className="w-4 h-4 text-gray-400" aria-hidden="true" />
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="w-3 h-3 text-gray-400" aria-hidden="true" />
            {isLast ? (
              <span className="font-semibold text-gray-900" aria-current="page">
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onCrumbClick && onCrumbClick(item)}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default InventoryBreadcrumbs;


