import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type CreditNoteStatus = "draft" | "pending_approval" | "approved" | "posted" | "partial" | "applied" | "voided" | "cancelled";
export type CreditNoteType = "sales_return" | "price_adjustment" | "discount_granted" | "billing_error" | "goodwill";

export interface CreditNoteLine {
  line_id: string;
  credit_note_id: string;
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

export interface CreditNoteApplication {
  application_id: string;
  credit_note_id: string;
  invoice_id: string;
  amount: number;
  applied_at: string;
  applied_by: string;
  invoice?: {
    invoice_id: string;
    invoice_number: string;
  };
}

export interface CustomerCreditNote extends BaseEntity {
  credit_note_id: string;
  company_id: string;
  credit_note_number: string;
  credit_note_date: string;
  customer_id: string;
  credit_note_type: CreditNoteType;
  original_invoice_id?: string;
  original_invoice_number?: string;
  return_id?: string;
  currency: string;
  exchange_rate: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  amount_applied: number;
  balance_remaining: number;
  status: CreditNoteStatus;
  approval_required: boolean;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  posted_by?: string;
  posted_at?: string;
  voided_by?: string;
  voided_at?: string;
  void_reason?: string;
  notes?: string;
  internal_notes?: string;
  created_by: string;
  lines?: CreditNoteLine[];
  applications?: CreditNoteApplication[];
  customer?: {
    third_party_id: string;
    legal_name: string;
    comercial_name?: string;
    tax_id: string;
  };
  original_invoice?: {
    invoice_id: string;
    invoice_number: string;
  };
  return?: {
    return_id: string;
    return_number: string;
  };
}
