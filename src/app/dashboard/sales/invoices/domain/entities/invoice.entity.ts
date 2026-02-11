import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type InvoiceStatus = "draft" | "posted" | "partial" | "paid" | "overdue" | "voided" | "cancelled";
export type InvoiceType = "invoice" | "credit_note" | "debit_note";
export type InvoiceSourceType = "shipment" | "sales_order" | "manual" | "recurring";

export interface InvoiceLine {
  line_id: string;
  invoice_id: string;
  line_number: number;
  product_id?: string;
  description: string;
  quantity: number;
  uom_id?: string;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  tax_code_id?: string;
  tax_amount: number;
  line_total: number;
  notes?: string;
  product?: {
    product_id: string;
    sku: string;
    name: string;
  };
}

export interface CustomerInvoice extends BaseEntity {
  invoice_id: string;
  company_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  customer_id: string;
  sales_order_id?: string;
  shipment_id?: string;
  invoice_type: InvoiceType;
  source_type: InvoiceSourceType;
  currency: string;
  exchange_rate: number;
  payment_term_id?: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  status: InvoiceStatus;
  dian_cufe?: string;
  dian_status?: string;
  dian_sent_at?: string;
  notes?: string;
  internal_notes?: string;
  created_by: string;
  posted_by?: string;
  posted_at?: string;
  voided_by?: string;
  voided_at?: string;
  void_reason?: string;
  lines?: InvoiceLine[];
  customer?: {
    third_party_id: string;
    legal_name: string;
    comercial_name?: string;
    tax_id: string;
  };
  sales_order?: {
    sales_order_id: string;
    order_number: string;
  };
  payment_term?: {
    payment_term_id: string;
    code: string;
    name: string;
  };
}
