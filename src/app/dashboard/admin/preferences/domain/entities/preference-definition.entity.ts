export type PreferenceValueType = 'string' | 'integer' | 'decimal' | 'boolean' | 'json';
export type PreferenceModule = 'system' | 'inventory' | 'sales' | 'purchasing' | 'finance' | 'manufacturing' | 'hr';

export interface PreferenceDefinition {
  preference_Id: string;
  code: string;
  name: string;
  description?: string;
  value_type: PreferenceValueType;
  default_value?: string;
  module: PreferenceModule;
  category?: string;
  allowed_values?: string[];
  validation_rules?: Record<string, unknown>;
  is_required: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}
