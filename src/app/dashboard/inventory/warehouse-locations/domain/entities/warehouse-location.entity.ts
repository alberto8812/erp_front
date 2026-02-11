import type { BaseEntity } from "@/shared/domain/base/base-entity.types";
import type { LocationType, ProductType } from "@/app/dashboard/inventory/shared/types/inventory.types";

export interface WarehouseLocation extends BaseEntity {
  location_id: string;
  warehouse_id: string;
  code: string;
  name: string;
  location_type: LocationType;
  parent_location_id?: string;
  zone?: string;
  aisle?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
  full_path?: string;
  max_weight?: number;
  max_volume?: number;
  max_items?: number;
  allowed_product_types: ProductType[];
  restricted_category_ids: string[];
  picking_sequence: number;
  is_pickable: boolean;
  is_active: boolean;
}
