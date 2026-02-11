"use server";

import { apiClient } from "@/lib/api";

export interface GeneratePdfResponse {
  path: string;
  url: string;
  filename: string;
}

export interface SendEmailRequest {
  recipients: string[];
  cc?: string[];
  message?: string;
  attachPdf?: boolean;
}

export interface SendEmailResponse {
  message: string;
}

export interface GetSignedUrlResponse {
  url: string;
}

// Generate PDF for invoice
export async function generateInvoicePdf(
  invoiceId: string
): Promise<GeneratePdfResponse> {
  return apiClient<GeneratePdfResponse>(
    `/onerp/documents/invoices/${invoiceId}/pdf`,
    {
      method: "POST",
    }
  );
}

// Send invoice by email
export async function sendInvoiceEmail(
  invoiceId: string,
  data: SendEmailRequest
): Promise<SendEmailResponse> {
  return apiClient<SendEmailResponse>(
    `/onerp/documents/invoices/${invoiceId}/email`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

// Generate PDF for shipment dispatch guide
export async function generateShipmentPdf(
  shipmentId: string
): Promise<GeneratePdfResponse> {
  return apiClient<GeneratePdfResponse>(
    `/onerp/documents/shipments/${shipmentId}/pdf`,
    {
      method: "POST",
    }
  );
}

// Send shipment dispatch guide by email
export async function sendShipmentEmail(
  shipmentId: string,
  data: SendEmailRequest
): Promise<SendEmailResponse> {
  return apiClient<SendEmailResponse>(
    `/onerp/documents/shipments/${shipmentId}/email`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

// Get signed URL for document download
export async function getDocumentDownloadUrl(
  path: string
): Promise<GetSignedUrlResponse> {
  return apiClient<GetSignedUrlResponse>(
    `/onerp/documents/download?path=${encodeURIComponent(path)}`,
    {
      method: "GET",
    }
  );
}
