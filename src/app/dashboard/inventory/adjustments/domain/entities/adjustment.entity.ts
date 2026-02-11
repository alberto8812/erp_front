import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type AdjustmentStatus = "draft" | "pending_approval" | "approved" | "posted" | "cancelled";
export type AdjustmentType = "quantity" | "value" | "both";

export interface AdjustmentLine {
  adjustment_line_id: string;
  adjustment_id: string;
  product_id: string;
  product_sku?: string;
  product_name?: string;
  warehouse_id: string;
  warehouse_name?: string;
  location_id?: string;
  location_code?: string;
  lot_id?: string;
  lot_number?: string;
  current_quantity: number;
  adjusted_quantity: number;
  quantity_difference: number;
  current_unit_cost: number;
  adjusted_unit_cost?: number;
  cost_difference?: number;
  uom_id: string;
  uom_code?: string;
  reason_code?: string;
  reason_description?: string;
  notes?: string;
}

export interface Adjustment extends BaseEntity {
  adjustment_id: string;
  company_id: string;
  adjustment_number: string;
  adjustment_date: string;
  adjustment_type: AdjustmentType;
  warehouse_id: string;
  warehouse_name?: string;
  description?: string;
  reason_code?: string;
  reason_description?: string;
  status: AdjustmentStatus;
  total_quantity_adjustment: number;
  total_cost_adjustment: number;
  currency: string;
  lines?: AdjustmentLine[];
  line_count?: number;
  created_by: string;
  updated_by?: string;
  submitted_at?: string;
  submitted_by?: string;
  approved_at?: string;
  approved_by?: string;
  posted_at?: string;
  posted_by?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
}

export interface AdjustmentWithLines extends Adjustment {
  lines: AdjustmentLine[];
}
