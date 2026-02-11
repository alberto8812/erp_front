export type FeatureFlagModule = 'system' | 'inventory' | 'sales' | 'purchasing' | 'finance' | 'manufacturing' | 'hr';

export interface FeatureFlag {
  feature_flag_Id: string;
  code: string;
  name: string;
  description?: string;
  module: FeatureFlagModule;
  default_enabled: boolean;
  rollout_percentage: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyFeatureFlag {
  company_feature_flag_Id: string;
  company_Id: string;
  feature_flag_Id: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureFlagStatus {
  code: string;
  enabled: boolean;
  source: 'default' | 'company' | 'rollout';
}
