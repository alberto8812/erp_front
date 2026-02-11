"use server";

import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { CustomerInvoice } from "../../domain/entities/invoice.entity";
import { apiClient } from "@/lib/api";

const BASE_PATH = "/onerp/sales/invoices";
const actions = createPaginatedActions<CustomerInvoice>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

export async function createFromShipment(shipmentId: string, data?: {
  invoice_date?: string;
  due_date?: string;
  payment_term_id?: string;
  notes?: string;
}): Promise<CustomerInvoice> {
  return apiClient<CustomerInvoice>(`${BASE_PATH}/from-shipment`, {
    method: "POST",
    body: JSON.stringify({ shipment_id: shipmentId, ...data }),
  });
}

export async function createFromOrder(orderId: string, data?: {
  invoice_date?: string;
  due_date?: string;
  payment_term_id?: string;
  notes?: string;
}): Promise<CustomerInvoice> {
  return apiClient<CustomerInvoice>(`${BASE_PATH}/from-order`, {
    method: "POST",
    body: JSON.stringify({ sales_order_id: orderId, ...data }),
  });
}

export async function postInvoice(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/post`, {
    method: "POST",
  });
}

export async function voidInvoice(id: string, reason?: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/void`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function cancelInvoice(id: string, reason: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function sendToDian(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`${BASE_PATH}/${id}/send-to-dian`, {
    method: "POST",
  });
}

export async function checkDianStatus(id: string): Promise<{ status: string; message?: string }> {
  return apiClient<{ status: string; message?: string }>(`${BASE_PATH}/${id}/dian-status`, {
    method: "GET",
  });
}

export async function findByCustomer(customerId: string): Promise<CustomerInvoice[]> {
  return apiClient<CustomerInvoice[]>(`${BASE_PATH}/by-customer/${customerId}`, {
    method: "GET",
  });
}

export async function findByOrder(orderId: string): Promise<CustomerInvoice[]> {
  return apiClient<CustomerInvoice[]>(`${BASE_PATH}/by-order/${orderId}`, {
    method: "GET",
  });
}
