"use server";

import { apiClient } from "@/lib/api";
import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { MaintenanceAsset } from "../../domain/entities/asset.entity";

const BASE_PATH = "/onerp/maintenance/assets";
const actions = createPaginatedActions<MaintenanceAsset>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function recordMeterReading(
  assetId: string,
  data: { reading_value: number; reading_date?: string; notes?: string }
): Promise<MaintenanceAsset> {
  return apiClient<MaintenanceAsset>(`${BASE_PATH}/${assetId}/meter-reading`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMeterReadings(assetId: string): Promise<unknown[]> {
  return apiClient<unknown[]>(`${BASE_PATH}/${assetId}/meter-readings`, {
    method: "GET",
  });
}

export async function updateStatus(
  assetId: string,
  data: { status: string; notes?: string }
): Promise<MaintenanceAsset> {
  return apiClient<MaintenanceAsset>(`${BASE_PATH}/${assetId}/status`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
