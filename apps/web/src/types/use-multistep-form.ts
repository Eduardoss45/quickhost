import { ReactElement } from "react";
import { ChangeStepHandler } from "./change-step-handler";

export type UseMultiStepForm = (steps: ReactElement[]) => {
  currentStep: number;
  currentComponent: ReactElement;
  changeStep: ChangeStepHandler;
  isLastStep: boolean;
  isFirstStep: boolean;
};
