"use server";

import { apiClient } from "@/lib/api";
import type { PreferenceDefinition } from "../../domain/entities/preference-definition.entity";
import type {
  PreferenceContext,
  PreferenceScope,
  ResolvedPreference
} from "../../domain/entities/preference-value.entity";

export interface GetPreferenceDefinitionsParams {
  module?: string;
  category?: string;
  search?: string;
}

export interface SetPreferenceValueParams {
  code: string;
  value: unknown;
  scope: PreferenceScope;
  company_Id?: string;
  branch_Id?: string;
  user_Id?: string;
}

export interface PreferenceHistoryEntry {
  preference_value_Id: string;
  value: string;
  scope: PreferenceScope;
  changed_by?: string;
  created_at: string;
}

export async function getPreferenceDefinitions(
  params?: GetPreferenceDefinitionsParams
): Promise<PreferenceDefinition[]> {
  const queryParams = new URLSearchParams();
  if (params?.module) queryParams.append('module', params.module);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);

  const query = queryParams.toString();
  const path = `/onerp/system/preferences/definitions${query ? `?${query}` : ''}`;

  return apiClient<PreferenceDefinition[]>(path);
}

export async function getPreferenceValue(
  code: string,
  context: PreferenceContext
): Promise<ResolvedPreference> {
  // Backend expects code, company_id, user_id directly
  const payload = {
    code,
    company_id: context.company_Id,
    user_id: context.user_Id,
  };
  return apiClient<ResolvedPreference>('/onerp/system/preferences/resolve', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resolveAllPreferences(
  context: PreferenceContext
): Promise<Record<string, ResolvedPreference>> {
  // Backend expects company_id/user_id directly, not wrapped in context
  const payload = {
    company_id: context.company_Id,
    user_id: context.user_Id,
  };
  return apiClient<Record<string, ResolvedPreference>>('/onerp/system/preferences/resolve-all', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function setPreferenceValue(
  params: SetPreferenceValueParams
): Promise<void> {
  // Backend expects lowercase field names
  const payload = {
    code: params.code,
    value: params.value,
    company_id: params.company_Id,
    user_id: params.user_Id,
  };
  return apiClient<void>('/onerp/system/preferences/value', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function getPreferenceHistory(
  code: string,
  companyId: string
): Promise<PreferenceHistoryEntry[]> {
  return apiClient<PreferenceHistoryEntry[]>(
    `/onerp/system/preferences/history?code=${code}&company_Id=${companyId}`
  );
}
