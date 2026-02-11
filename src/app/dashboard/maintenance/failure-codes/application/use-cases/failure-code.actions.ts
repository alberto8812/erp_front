"use server";

import { apiClient } from "@/lib/api";
import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { FailureCode } from "../../domain/entities/failure-code.entity";

const BASE_PATH = "/onerp/maintenance/failure-codes";
const actions = createPaginatedActions<FailureCode>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function getFailureCodes(): Promise<FailureCode[]> {
  return apiClient<FailureCode[]>(`${BASE_PATH}/type/failure`, {
    method: "GET",
  });
}

export async function getCauseCodes(): Promise<FailureCode[]> {
  return apiClient<FailureCode[]>(`${BASE_PATH}/type/cause`, {
    method: "GET",
  });
}

export async function getActionCodes(): Promise<FailureCode[]> {
  return apiClient<FailureCode[]>(`${BASE_PATH}/type/action`, {
    method: "GET",
  });
}

export async function getCausesByFailure(failureCodeId: string): Promise<FailureCode[]> {
  return apiClient<FailureCode[]>(`${BASE_PATH}/${failureCodeId}/causes`, {
    method: "GET",
  });
}

export async function linkCauseToFailure(
  failureCodeId: string,
  causeCodeId: string
): Promise<void> {
  return apiClient<void>(`${BASE_PATH}/${failureCodeId}/causes/${causeCodeId}`, {
    method: "POST",
  });
}

export async function unlinkCauseFromFailure(
  failureCodeId: string,
  causeCodeId: string
): Promise<void> {
  return apiClient<void>(`${BASE_PATH}/${failureCodeId}/causes/${causeCodeId}`, {
    method: "DELETE",
  });
}
