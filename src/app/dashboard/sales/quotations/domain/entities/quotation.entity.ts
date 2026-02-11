import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired" | "converted";

export interface QuotationLine {
  line_id: string;
  quotation_id: string;
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
  notes?: string;
  product?: {
    product_id: string;
    sku: string;
    name: string;
  };
}

export interface Quotation extends BaseEntity {
  quotation_id: string;
  company_id: string;
  quotation_number: string;
  quotation_date: string;
  valid_until?: string;
  customer_id: string;
  contact_id?: string;
  currency: string;
  exchange_rate: number;
  payment_term_id?: string;
  price_list_id?: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  status: QuotationStatus;
  notes?: string;
  internal_notes?: string;
  terms_conditions?: string;
  created_by: string;
  sent_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  converted_at?: string;
  sales_order_id?: string;
  lines?: QuotationLine[];
  customer?: {
    third_party_id: string;
    legal_name: string;
    comercial_name?: string;
    tax_id: string;
  };
  payment_term?: {
    payment_term_id: string;
    code: string;
    name: string;
  };
}
