import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type ShipmentStatus = "draft" | "ready" | "shipped" | "delivered" | "cancelled";

export interface ShipmentLine {
  line_id: string;
  shipment_id: string;
  line_number: number;
  sales_order_line_id: string;
  product_id: string;
  description: string;
  quantity_ordered: number;
  quantity_shipped: number;
  uom_id: string;
  lot_number?: string;
  serial_number?: string;
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

export interface Shipment extends BaseEntity {
  shipment_id: string;
  company_id: string;
  shipment_number: string;
  sales_order_id: string;
  customer_id: string;
  warehouse_id: string;
  shipment_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  carrier_id?: string;
  tracking_number?: string;
  shipping_method?: string;
  shipping_cost?: number;
  status: ShipmentStatus;
  ship_to_address?: string;
  ship_to_city?: string;
  ship_to_state?: string;
  ship_to_country?: string;
  ship_to_postal_code?: string;
  notes?: string;
  internal_notes?: string;
  created_by: string;
  shipped_by?: string;
  shipped_at?: string;
  delivered_at?: string;
  lines?: ShipmentLine[];
  sales_order?: {
    order_id: string;
    order_number: string;
  };
  customer?: {
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
  carrier?: {
    carrier_id: string;
    name: string;
  };
}
