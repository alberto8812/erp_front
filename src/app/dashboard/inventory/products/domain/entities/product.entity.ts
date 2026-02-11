import type { BaseEntity } from "@/shared/domain/base/base-entity.types";
import type { ProductType, ValuationMethod, EntityStatus } from "@/app/dashboard/inventory/shared/types/inventory.types";

export interface Product extends BaseEntity {
  product_id: string;
  company_id: string;

  // Identificación
  sku: string;
  barcode?: string;
  name: string;
  description?: string;

  // Clasificación
  product_type: ProductType;
  category_id?: string;
  subcategory_id?: string;
  brand_id?: string;

  // Unidades de medida
  base_uom_id: string;
  purchase_uom_id?: string;
  sales_uom_id?: string;

  // Control de inventario
  is_inventory_tracked: boolean;
  is_lot_tracked: boolean;
  is_serial_tracked: boolean;
  valuation_method: ValuationMethod;

  // Costos
  standard_cost?: number;
  last_purchase_cost?: number;
  average_cost?: number;

  // Precios
  base_price?: number;
  min_sale_price?: number;

  // Flags
  is_purchaseable: boolean;
  is_saleable: boolean;
  is_manufacturable: boolean;

  // Reabastecimiento
  default_warehouse_id?: string;
  reorder_point?: number;
  reorder_quantity?: number;
  safety_stock?: number;
  min_stock?: number;
  max_stock?: number;
  lead_time_days: number;

  // Proveedor por defecto
  default_vendor_id?: string;
  vendor_product_code?: string;

  // Físico
  weight?: number;
  weight_uom?: string;
  volume?: number;
  volume_uom?: string;
  length?: number;
  width?: number;
  height?: number;
  dimensions_uom?: string;

  // Cuentas contables
  inventory_account_id?: string;
  cogs_account_id?: string;
  revenue_account_id?: string;
  purchase_account_id?: string;
  variance_account_id?: string;

  // Control de vida
  shelf_life_days?: number;
  warranty_days?: number;

  // Estado
  status: EntityStatus;
  is_deleted: boolean;

  // Metadata
  image_url?: string;
  metadata?: Record<string, unknown>;

  created_by?: string;
  updated_by?: string;
}
