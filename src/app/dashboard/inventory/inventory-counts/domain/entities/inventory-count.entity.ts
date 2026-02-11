import type { BaseEntity } from "@/shared/domain/base/base-entity.types";
import type { CountStatus } from "@/app/dashboard/inventory/shared/types/inventory.types";

export interface InventoryCount extends BaseEntity {
  count_id: string;
  company_id: string;
  count_number: string;
  count_date: string;
  warehouse_id: string;
  location_ids: string[];
  category_ids: string[];
  product_ids: string[];
  count_type: string;
  assigned_to?: string;
  counted_by?: string;
  reviewed_by?: string;
  approved_by?: string;
  status: CountStatus;
  planned_date?: string;
  started_at?: string;
  completed_at?: string;
  approved_at?: string;
  posted_at?: string;
  total_items: number;
  counted_items: number;
  variance_items: number;
  total_variance_value?: number;
  notes?: string;
  created_by: string;
}

export interface InventoryCountLine {
  count_line_id: string;
  count_id: string;
  product_id: string;
  location_id?: string;
  lot_id?: string;
  system_quantity: number;
  counted_quantity?: number;
  variance_quantity?: number;
  unit_cost?: number;
  variance_value?: number;
  is_counted: boolean;
  counted_at?: string;
  counted_by?: string;
  adjustment_reason?: string;
  adjustment_approved: boolean;
  kardex_id?: string;
  product?: {
    product_id: string;
    sku: string;
    name: string;
  };
  location?: {
    location_id: string;
    code: string;
    name: string;
  };
  lot?: {
    lot_id: string;
    lot_number: string;
  };
}

export interface InventoryCountWithLines extends InventoryCount {
  lines?: InventoryCountLine[];
  warehouse?: {
    warehouse_id: string;
    code: string;
    name: string;
  };
}
