import type { BaseEntity } from "@/shared/domain/base/base-entity.types";
import type { LotStatus } from "@/app/dashboard/inventory/shared/types/inventory.types";

export interface Lot extends BaseEntity {
  lot_id: string;
  company_id: string;
  product_id: string;
  lot_number: string;
  internal_lot?: string;
  supplier_lot?: string;
  serial_number?: string;
  manufacture_date?: string;
  receipt_date?: string;
  expiration_date?: string;
  best_before_date?: string;
  initial_quantity: number;
  current_quantity: number;
  reserved_quantity: number;
  unit_cost?: number;
  total_cost?: number;
  source_document_type?: string;
  source_document_id?: string;
  vendor_id?: string;
  status: LotStatus;
  blocked_reason?: string;
  quality_status?: string;
  inspection_date?: string;
  inspector_id?: string;
  attributes?: Record<string, unknown>;
}
