"use server";

import { apiClient } from "@/lib/api";
import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { MaintenancePlan } from "../../domain/entities/maintenance-plan.entity";

const BASE_PATH = "/onerp/maintenance/plans";
const actions = createPaginatedActions<MaintenancePlan>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function findActive(): Promise<MaintenancePlan[]> {
  return apiClient<MaintenancePlan[]>(`${BASE_PATH}/active`, {
    method: "GET",
  });
}

export async function findDue(days: number = 7): Promise<MaintenancePlan[]> {
  return apiClient<MaintenancePlan[]>(`${BASE_PATH}/due?days=${days}`, {
    method: "GET",
  });
}

export async function findByAsset(assetId: string): Promise<MaintenancePlan[]> {
  return apiClient<MaintenancePlan[]>(`${BASE_PATH}/by-asset/${assetId}`, {
    method: "GET",
  });
}

export async function activate(planId: string): Promise<MaintenancePlan> {
  return apiClient<MaintenancePlan>(`${BASE_PATH}/${planId}/activate`, {
    method: "POST",
  });
}

export async function deactivate(planId: string): Promise<MaintenancePlan> {
  return apiClient<MaintenancePlan>(`${BASE_PATH}/${planId}/deactivate`, {
    method: "POST",
  });
}
