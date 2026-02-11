"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { Quotation } from "../../domain/entities/quotation.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/sales/quotations";
const actions = createPaginatedActions<Quotation>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function sendQuotation(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/send`, {
    method: "POST",
  });
}

export async function acceptQuotation(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/accept`, {
    method: "POST",
  });
}

export async function rejectQuotation(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/reject`, {
    method: "POST",
  });
}

export async function convertToOrder(id: string): Promise<{ message: string; sales_order_id: string }> {
  return apiClient<{ message: string; sales_order_id: string }>(`${BASE_PATH}/${id}/convert-to-order`, {
    method: "POST",
  });
}
