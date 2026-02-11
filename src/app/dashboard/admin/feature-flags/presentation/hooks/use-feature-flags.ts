"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllFeatureFlags,
  isFeatureEnabled,
  setCompanyFlag,
  getCompanyFlags,
  type SetCompanyFlagParams,
} from "../../application/use-cases/feature-flag.actions";

export function useFeatureFlags() {
  return useQuery({
    queryKey: ["feature-flags"],
    queryFn: getAllFeatureFlags,
  });
}

export function useFeatureEnabled(code: string) {
  return useQuery({
    queryKey: ["feature-flag", code],
    queryFn: () => isFeatureEnabled(code),
    enabled: !!code,
  });
}

export function useCompanyFlags(companyId?: string) {
  return useQuery({
    queryKey: ["company-flags", companyId],
    queryFn: () => getCompanyFlags(companyId),
    enabled: !!companyId,
  });
}

export function useSetCompanyFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SetCompanyFlagParams) => setCompanyFlag(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
      queryClient.invalidateQueries({ queryKey: ["company-flags"] });
      queryClient.invalidateQueries({ queryKey: ["feature-flag"] });
    },
  });
}
