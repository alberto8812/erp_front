"use server";

import { apiClient } from "@/lib/api";
import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { VendorInvoice } from "../../domain/entities/vendor-invoice.entity";

const BASE_PATH = "/onerp/purchasing/vendor-invoices";
const actions = createPaginatedActions<VendorInvoice>(BASE_PATH);

// Standard CRUD operations
export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

// Three-way match operations
export async function submitForMatch(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/submit-match`, {
    method: "POST",
  });
}

export async function matchWithPO(
  id: string,
  poId: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/match-po`, {
    method: "POST",
    body: JSON.stringify({ purchase_order_id: poId }),
  });
}

export async function approveVariance(
  id: string,
  lineId: string,
  notes?: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/approve-variance`, {
    method: "POST",
    body: JSON.stringify({ line_id: lineId, notes }),
  });
}

// Posting and payment
export async function postInvoice(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/post`, {
    method: "POST",
  });
}

export async function holdPayment(
  id: string,
  reason: string,
  notes?: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/hold`, {
    method: "POST",
    body: JSON.stringify({ hold_reason: reason, hold_notes: notes }),
  });
}

export async function releaseHold(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/release-hold`, {
    method: "POST",
  });
}

// Cancel invoice
export async function cancelInvoice(
  id: string,
  reason: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify({ cancellation_reason: reason }),
  });
}

// Find by vendor
export async function findByVendor(
  vendorId: string,
  params: { limit?: number; cursor?: string }
): Promise<VendorInvoice[]> {
  return apiClient<VendorInvoice[]>(
    `${BASE_PATH}/by-vendor/${vendorId}?limit=${params.limit || 10}${
      params.cursor ? `&cursor=${params.cursor}` : ""
    }`,
    { method: "GET" }
  );
}

// Find by PO
export async function findByPurchaseOrder(
  poId: string
): Promise<VendorInvoice[]> {
  return apiClient<VendorInvoice[]>(`${BASE_PATH}/by-po/${poId}`, {
    method: "GET",
  });
}
