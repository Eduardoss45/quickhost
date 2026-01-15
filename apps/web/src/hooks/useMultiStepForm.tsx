import { useState } from 'react';
import { ChangeStepHandler, UseMultiStepForm } from '@/types';

export const useMultiStepForm: UseMultiStepForm = steps => {
  const [currentStep, setCurrentStep] = useState(0);

  const changeStep: ChangeStepHandler = (i, e) => {
    if (e) e.preventDefault();
    if (i < 0 || i >= steps.length) return;

    setCurrentStep(i);
  };

  return {
    currentStep,
    currentComponent: steps[currentStep]!,
    changeStep,
    isLastStep: currentStep + 1 === steps.length,
    isFirstStep: currentStep === 0,
  };
};
