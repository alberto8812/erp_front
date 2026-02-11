import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type ReceiptStatus =
  | "draft"
  | "pending_inspection"
  | "inspected"
  | "received"
  | "partial"
  | "cancelled";

export interface ReceiptLine {
  line_id: string;
  receipt_id: string;
  line_number: number;
  purchase_order_line_id: string;
  product_id: string;
  description: string;
  quantity_ordered: number;
  quantity_received: number;
  quantity_accepted: number;
  quantity_rejected: number;
  uom_id: string;
  lot_number?: string;
  serial_number?: string;
  expiration_date?: string;
  manufacture_date?: string;
  location_id?: string;
  inspection_status?: "pending" | "passed" | "failed" | "partial";
  inspection_notes?: string;
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
  location?: {
    location_id: string;
    code: string;
    name: string;
  };
}

export interface Receipt extends BaseEntity {
  receipt_id: string;
  company_id: string;
  receipt_number: string;
  receipt_date: string;
  purchase_order_id: string;
  vendor_id: string;
  warehouse_id: string;
  delivery_note_number?: string;
  carrier?: string;
  tracking_number?: string;
  status: ReceiptStatus;
  requires_inspection: boolean;
  inspection_completed_at?: string;
  inspection_completed_by?: string;
  notes?: string;
  internal_notes?: string;
  created_by: string;
  received_by?: string;
  received_at?: string;
  lines?: ReceiptLine[];
  purchase_order?: {
    order_id: string;
    order_number: string;
  };
  vendor?: {
    third_party_id: string;
    legal_name: string;
    comercial_name?: string;
    tax_id: string;
  };
  warehouse?: {
    warehouse_id: string;
    code: string;
    name: string;
  };
}
