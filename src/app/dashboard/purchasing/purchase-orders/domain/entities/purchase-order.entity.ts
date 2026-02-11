import type { BaseEntity } from "@/shared/domain/base/base-entity.types";
import type {
  PurchaseOrderStatus,
  PurchaseOrderLineStatus,
  PurchaseSourceType,
} from "../../../shared/types/purchasing.types";

export interface PurchaseOrderLine {
  line_id: string;
  purchase_order_id: string;
  line_number: number;
  product_id?: string;
  description: string;
  quantity_ordered: number;
  quantity_received: number;
  quantity_invoiced: number;
  quantity_cancelled: number;
  uom_id: string;
  unit_price: number;
  discount_percent: number;
  tax_code_id?: string;
  tax_amount: number;
  line_total: number;
  requested_date?: string;
  promised_date?: string;
  destination_warehouse_id?: string;
  destination_location_id?: string;
  freight_cost: number;
  customs_cost: number;
  other_costs: number;
  landed_unit_cost?: number;
  status: PurchaseOrderLineStatus;
  // Relations
  product?: {
    product_id: string;
    sku: string;
    name: string;
  };
  warehouse?: {
    warehouse_id: string;
    code: string;
    name: string;
  };
}

export interface PurchaseOrder extends BaseEntity {
  purchase_order_id: string;
  company_id: string;
  order_number: string;
  order_date: string;
  expected_date?: string;
  approved_at?: string;
  // Vendor
  vendor_id: string;
  contact_id?: string;
  vendor_address_id?: string;
  // Buyer
  buyer_id?: string;
  approved_by?: string;
  // Currency & Terms
  currency: string;
  exchange_rate: number;
  payment_term_id?: string;
  cost_center_id?: string;
  // Totals
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  // Status
  status: PurchaseOrderStatus;
  approval_status?: string;
  // Source
  source_type?: PurchaseSourceType;
  source_id?: string;
  vendor_reference?: string;
  // Notes
  notes?: string;
  internal_notes?: string;
  terms_conditions?: string;
  // Audit
  created_by: string;
  // Relations
  lines?: PurchaseOrderLine[];
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
  };
}
