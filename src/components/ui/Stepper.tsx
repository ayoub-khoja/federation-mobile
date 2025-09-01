"use client";

import React from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Barre de progression principale */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Étape {currentStep} sur {steps.length}
          </h2>
          <span className="text-sm text-gray-600">
            {Math.round((currentStep / steps.length) * 100)}% terminé
          </span>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Steps indicators */}
      <div className="flex items-start justify-between mb-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1 max-w-[120px]">
              
              {/* Cercle de l'étape */}
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 border-2 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                    : isActive 
                    ? 'bg-white border-red-500 text-red-500 shadow-lg ring-4 ring-red-100' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="font-semibold">{stepNumber}</span>
                )}
              </div>
              
              {/* Titre et description de l'étape */}
              <div className="text-center w-full px-2">
                <h3 className={`font-medium text-sm mb-1 leading-tight ${
                  isActive ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-xs leading-tight ${
                  isActive ? 'text-gray-600' : isCompleted ? 'text-green-500' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Composant pour la navigation entre les étapes
interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  submitLabel?: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}

export function StepperNavigation({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  onSubmit,
  nextLabel = "Suivant",
  previousLabel = "Précédent", 
  submitLabel = "Terminer",
  isNextDisabled = false,
  isLoading = false
}: StepperNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
      {/* Bouton Précédent */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
          isFirstStep || isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
        }`}
      >
        {previousLabel}
      </button>

      {/* Indicateur d'étape */}
      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index + 1 < currentStep ? 'bg-green-500' : 
              index + 1 === currentStep ? 'bg-red-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Bouton Suivant/Terminer */}
      <button
        type={isLastStep ? "submit" : "button"}
        onClick={isLastStep ? onSubmit : onNext}
        disabled={isNextDisabled || isLoading}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
          isNextDisabled || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{isLastStep ? 'Création...' : 'Chargement...'}</span>
          </div>
        ) : (
          isLastStep ? submitLabel : nextLabel
        )}
      </button>
    </div>
  );
}
