import React, { useState } from 'react';
import { Play, CheckCircle, ChevronRight } from 'lucide-react';

const GuidedTourPanel = ({ steps = [] }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const hasSteps = steps.length > 0;

  if (!hasSteps) {
    return null;
  }

  const step = steps[currentStep];

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-start">
        <span className="p-2 bg-green-600 rounded-full text-white">
          <Play className="w-4 h-4" />
        </span>
        <div className="ml-3 flex-1">
          <p className="text-xs uppercase text-green-600 font-semibold tracking-wide">
            Guided Tour
          </p>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-1">{step.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-xs text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              Step {currentStep + 1} of {steps.length}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900"
            >
              Next Tip
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTourPanel;


