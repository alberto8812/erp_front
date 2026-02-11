"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPreferenceDefinitions,
  resolveAllPreferences,
  setPreferenceValue,
  type GetPreferenceDefinitionsParams,
  type SetPreferenceValueParams,
} from "../../application/use-cases/preference.actions";
import type { PreferenceContext } from "../../domain/entities/preference-value.entity";

export function usePreferenceDefinitions(params?: GetPreferenceDefinitionsParams) {
  return useQuery({
    queryKey: ["preference-definitions", params],
    queryFn: () => getPreferenceDefinitions(params),
  });
}

export function useResolvedPreferences(context: PreferenceContext) {
  return useQuery({
    queryKey: ["resolved-preferences", context],
    queryFn: () => resolveAllPreferences(context),
    enabled: !!context.company_Id,
  });
}

export function useSetPreferenceValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SetPreferenceValueParams) => setPreferenceValue(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resolved-preferences"] });
      queryClient.invalidateQueries({ queryKey: ["preference-definitions"] });
    },
  });
}
