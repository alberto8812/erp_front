import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface StockLevel extends BaseEntity {
  stock_level_id: string;
  company_id: string;
  product_id: string;
  warehouse_id: string;
  location_id?: string;
  lot_id?: string;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  quantity_incoming: number;
  quantity_outgoing: number;
  quantity_in_transit: number;
  quantity_in_quality: number;
  unit_cost?: number;
  total_value?: number;
  last_count_date?: string;
  last_count_quantity?: number;
  last_count_by?: string;
  last_movement_date?: string;
  last_movement_type?: string;
}
