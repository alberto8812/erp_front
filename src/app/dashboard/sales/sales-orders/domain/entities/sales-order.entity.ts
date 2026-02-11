import type { BaseEntity } from "@/shared/domain/base/base-entity.types";
import type {
  SalesOrderStatus,
  SalesOrderApprovalStatus,
  SalesOrderLineStatus,
} from "../../../shared/types/sales.types";

export interface SalesOrderLine {
  line_id: string;
  sales_order_id: string;
  line_number: number;
  product_id?: string;
  description: string;
  quantity_ordered: number;
  quantity_shipped: number;
  quantity_invoiced: number;
  quantity_returned: number;
  quantity_cancelled: number;
  quantity_reserved: number;
  uom_id: string;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  tax_code_id?: string;
  tax_amount: number;
  line_total: number;
  warehouse_id?: string;
  requested_date?: string;
  promised_date?: string;
  cost_price?: number;
  margin_amount?: number;
  margin_percent?: number;
  status: SalesOrderLineStatus;
  quotation_line_id?: string;
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

export interface SalesOrder extends BaseEntity {
  sales_order_id: string;
  company_id: string;
  order_number: string;
  order_date: string;
  expected_ship_date?: string;
  confirmed_at?: string;
  confirmed_by?: string;
  // Customer
  customer_id: string;
  contact_id?: string;
  billing_address_id?: string;
  shipping_address_id?: string;
  // Sales rep
  sales_rep_id?: string;
  // Currency & Terms
  currency: string;
  exchange_rate: number;
  payment_term_id?: string;
  price_list_id?: string;
  // Totals
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  // Status
  status: SalesOrderStatus;
  approval_status: SalesOrderApprovalStatus;
  // Source
  source_type?: string;
  source_id?: string;
  customer_po?: string;
  // Notes
  notes?: string;
  internal_notes?: string;
  terms_conditions?: string;
  // Approval
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  // Audit
  created_by: string;
  updated_by?: string;
  // Relations
  lines?: SalesOrderLine[];
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
