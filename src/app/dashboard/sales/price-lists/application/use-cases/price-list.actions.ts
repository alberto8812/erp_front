"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { PriceList } from "../../domain/entities/price-list.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/sales/price-lists";
const actions = createPaginatedActions<PriceList>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function activatePriceList(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/activate`, {
    method: "POST",
  });
}

export async function deactivatePriceList(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/deactivate`, {
    method: "POST",
  });
}

export async function duplicatePriceList(id: string): Promise<{ message: string; price_list_id: string }> {
  return apiClient<{ message: string; price_list_id: string }>(`${BASE_PATH}/${id}/duplicate`, {
    method: "POST",
  });
}

export async function setAsDefault(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/set-default`, {
    method: "POST",
  });
}
