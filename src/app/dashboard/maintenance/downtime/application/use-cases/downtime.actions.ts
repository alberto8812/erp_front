"use server";

import { apiClient } from "@/lib/api";
import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { Downtime } from "../../domain/entities/downtime.entity";

const BASE_PATH = "/onerp/maintenance/downtime";
const actions = createPaginatedActions<Downtime>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function resolveDowntime(
  id: string,
  data: {
    end_datetime: string;
    resolution_notes?: string;
    cause_code_id?: string;
  }
): Promise<Downtime> {
  return apiClient<Downtime>(`${BASE_PATH}/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getByAsset(assetId: string): Promise<Downtime[]> {
  return apiClient<Downtime[]>(`${BASE_PATH}/by-asset/${assetId}`, {
    method: "GET",
  });
}

export async function getActiveDowntime(): Promise<Downtime[]> {
  return apiClient<Downtime[]>(`${BASE_PATH}/active`, {
    method: "GET",
  });
}
