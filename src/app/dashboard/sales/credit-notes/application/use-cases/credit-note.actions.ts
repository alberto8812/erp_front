"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { CustomerCreditNote } from "../../domain/entities/credit-note.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/sales/credit-notes";
const actions = createPaginatedActions<CustomerCreditNote>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function createFromReturn(returnId: string, data?: {
  credit_note_date?: string;
  notes?: string;
}): Promise<CustomerCreditNote> {
  return apiClient<CustomerCreditNote>(`${BASE_PATH}/from-return`, {
    method: "POST",
    body: JSON.stringify({ return_id: returnId, ...data }),
  });
}

export async function approveCreditNote(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectCreditNote(id: string, reason?: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function postCreditNote(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/post`, {
    method: "POST",
  });
}

export async function voidCreditNote(id: string, reason?: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/void`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function applyToInvoice(id: string, invoiceId: string, amount: number): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/apply`, {
    method: "POST",
    body: JSON.stringify({ invoice_id: invoiceId, amount }),
  });
}

export async function getApplications(id: string): Promise<Array<{
  application_id: string;
  invoice_id: string;
  amount: number;
  applied_at: string;
}>> {
  return apiClient(`${BASE_PATH}/${id}/applications`, {
    method: "GET",
  });
}

export async function findByCustomer(customerId: string): Promise<CustomerCreditNote[]> {
  return apiClient<CustomerCreditNote[]>(`${BASE_PATH}/by-customer/${customerId}`, {
    method: "GET",
  });
}

export async function findByInvoice(invoiceId: string): Promise<CustomerCreditNote[]> {
  return apiClient<CustomerCreditNote[]>(`${BASE_PATH}/by-invoice/${invoiceId}`, {
    method: "GET",
  });
}
