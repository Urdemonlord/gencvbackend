import { CVData, ValidationError } from './index';

// Form-related types
export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: any; // Use any instead of React.ComponentType
  validation?: (data: any) => ValidationError[];
  isOptional?: boolean;
}

export interface WizardState {
  currentStep: number;
  steps: WizardStep[];
  data: Partial<CVData>;
  completedSteps: string[];
  errors: Record<string, ValidationError[]>;
}

// Re-export validation types
export type { ValidationError, FormState } from './index';
