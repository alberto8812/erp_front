import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type ReturnStatus = "draft" | "pending_approval" | "approved" | "received" | "processed" | "cancelled";

export type ReturnReasonCode =
  | "defective"
  | "wrong_item"
  | "damaged"
  | "not_as_described"
  | "customer_changed_mind"
  | "quality_issue"
  | "other";

export interface ReturnLine {
  line_id: string;
  return_id: string;
  line_number: number;
  sales_order_line_id?: string;
  product_id: string;
  description: string;
  quantity_returned: number;
  uom_id: string;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  line_total: number;
  reason_code: ReturnReasonCode;
  condition: "new" | "used" | "damaged" | "defective";
  disposition?: "restock" | "repair" | "scrap" | "return_to_vendor";
  notes?: string;
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

export interface SalesReturn extends BaseEntity {
  return_id: string;
  company_id: string;
  return_number: string;
  return_date: string;
  customer_id: string;
  sales_order_id?: string;
  shipment_id?: string;
  warehouse_id?: string;
  reason_code: ReturnReasonCode;
  currency: string;
  exchange_rate: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  refund_method?: "credit_note" | "refund" | "exchange";
  credit_note_id?: string;
  status: ReturnStatus;
  notes?: string;
  internal_notes?: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  received_by?: string;
  received_at?: string;
  processed_by?: string;
  processed_at?: string;
  lines?: ReturnLine[];
  customer?: {
    third_party_id: string;
    legal_name: string;
    comercial_name?: string;
    tax_id: string;
  };
  sales_order?: {
    order_id: string;
    order_number: string;
  };
  warehouse?: {
    warehouse_id: string;
    code: string;
    name: string;
  };
}
