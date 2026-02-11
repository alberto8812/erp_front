export type PreferenceScope = 'system' | 'company' | 'branch' | 'user';

export interface PreferenceValue {
  preference_value_Id: string;
  preference_Id: string;
  company_Id?: string;
  branch_Id?: string;
  user_Id?: string;
  scope: PreferenceScope;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface PreferenceContext {
  company_Id?: string;
  branch_Id?: string;
  user_Id?: string;
}

export interface ResolvedPreference {
  code: string;
  value: unknown;
  effective_scope: PreferenceScope;
  value_type: string;
  system_value?: string;
  company_value?: string;
  branch_value?: string;
  user_value?: string;
}
