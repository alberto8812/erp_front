import type { AutocompleteConfig } from "./autocomplete.types";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'textarea' | 'date' | 'uuid' | 'autocomplete' | 'checkbox' | 'switch' | 'datetime-local';
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  defaultValue?: unknown;
  placeholder?: string;
  options?: { label: string; value: string }[];
  pattern?: { regex: string; message: string };
  hidden?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
  autocompleteConfig?: AutocompleteConfig;
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
}

export interface FormConfig {
  fields: FormFieldConfig[];
  sections?: FormSection[];
}
