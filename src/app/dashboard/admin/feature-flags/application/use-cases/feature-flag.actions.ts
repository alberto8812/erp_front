"use server";

import { apiClient } from "@/lib/api";
import type { FeatureFlag, FeatureFlagStatus } from "../../domain/entities/feature-flag.entity";

export interface SetCompanyFlagParams {
  code: string;
  enabled: boolean;
  company_Id?: string;
}

export async function getAllFeatureFlags(): Promise<FeatureFlag[]> {
  return apiClient<FeatureFlag[]>('/onerp/system/feature-flags', {
    method: 'POST',
  });
}

export async function isFeatureEnabled(code: string): Promise<FeatureFlagStatus> {
  return apiClient<FeatureFlagStatus>('/onerp/system/feature-flags/check', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export async function setCompanyFlag(params: SetCompanyFlagParams): Promise<void> {
  return apiClient<void>('/onerp/system/feature-flags/company', {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export async function getCompanyFlags(companyId?: string): Promise<Record<string, boolean>> {
  const query = companyId ? `?company_Id=${companyId}` : '';
  return apiClient<Record<string, boolean>>(`/onerp/system/feature-flags/company${query}`);
}
