import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

// Invoice statuses
export type VendorInvoiceStatus =
  | "draft"
  | "pending_match"
  | "matched"
  | "posted"
  | "partial_paid"
  | "paid"
  | "cancelled"
  | "hold";

// Match statuses
export type InvoiceMatchStatus = "unmatched" | "partial_matched" | "fully_matched";

// Line match status
export type InvoiceLineMatchStatus = "unmatched" | "matched" | "variance";

// Payment hold reasons
export type PaymentHoldReason =
  | "price_dispute"
  | "quantity_dispute"
  | "quality_issue"
  | "documentation_missing"
  | "approval_pending"
  | "other";

// Tax line interface
export interface VendorInvoiceTaxLine {
  tax_line_id: string;
  invoice_id: string;
  tax_code_id: string;
  tax_name: string;
  tax_type: string;
  tax_rate: number;
  taxable_amount: number;
  tax_amount: number;
  is_withholding: boolean;
  gl_account_id?: string;
}

// Invoice line interface
export interface VendorInvoiceLine {
  line_id: string;
  invoice_id: string;
  line_number: number;
  product_id?: string;
  description: string;
  quantity: number;
  uom_id: string;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  tax_code_id?: string;
  tax_amount: number;
  line_total: number;
  // Matching fields
  po_line_id?: string;
  receipt_line_id?: string;
  po_quantity?: number;
  po_unit_price?: number;
  receipt_quantity?: number;
  match_status: InvoiceLineMatchStatus;
  quantity_variance?: number;
  price_variance?: number;
  variance_approved: boolean;
  variance_approved_by?: string;
  variance_notes?: string;
  // Accounting
  gl_account_id?: string;
  cost_center_id?: string;
  project_id?: string;
  // Relations
  product?: {
    product_id: string;
    sku: string;
    name: string;
  };
  uom?: {
    uom_id: string;
    code: string;
    name: string;
  };
}

// Main vendor invoice interface
export interface VendorInvoice extends BaseEntity {
  invoice_id: string;
  company_id: string;
  invoice_number: string;
  vendor_invoice_ref?: string;
  vendor_id: string;
  contact_id?: string;

  // Dates
  invoice_date: string;
  received_date?: string;
  due_date: string;
  posting_date?: string;

  // Terms
  payment_term_id?: string;
  currency: string;
  exchange_rate: number;

  // Amounts
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  withholding_amount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;

  // Status
  status: VendorInvoiceStatus;
  match_status: InvoiceMatchStatus;
  days_overdue?: number;

  // Matching
  primary_po_id?: string;
  total_po_amount?: number;
  total_receipt_amount?: number;
  match_variance?: number;

  // Payment hold
  payment_hold: boolean;
  hold_reason?: PaymentHoldReason;
  hold_notes?: string;
  hold_released_at?: string;
  hold_released_by?: string;

  // Approval
  approval_required: boolean;
  approved_by?: string;
  approved_at?: string;

  // Posting
  journal_entry_id?: string;
  posted_at?: string;
  posted_by?: string;

  // Cancellation
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;

  // Notes
  notes?: string;
  internal_notes?: string;
  attachment_path?: string;

  // Audit
  created_by: string;
  updated_by?: string;

  // Relations
  lines?: VendorInvoiceLine[];
  tax_lines?: VendorInvoiceTaxLine[];
  vendor?: {
    third_party_id: string;
    legal_name: string;
    comercial_name?: string;
    tax_id: string;
  };
  payment_term?: {
    payment_term_id: string;
    code: string;
    name: string;
    days: number;
  };
  primary_po?: {
    purchase_order_id: string;
    order_number: string;
  };
}
