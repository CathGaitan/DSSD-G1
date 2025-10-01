import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center mb-8">
    {[...Array(totalSteps)].map((_, index) => (
      <React.Fragment key={index}>
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              currentStep > index + 1
                ? 'bg-green-500 text-white'
                : currentStep === index + 1
                ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {currentStep > index + 1 ? '✓' : index + 1}
          </div>
          <span className="text-xs mt-2 font-medium">
            {index === 0 ? 'Proyecto' : 'Tareas'}
          </span>
        </div>
        {index < totalSteps - 1 && (
          <div
            className={`h-1 w-16 mx-2 rounded transition-all ${
              currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);