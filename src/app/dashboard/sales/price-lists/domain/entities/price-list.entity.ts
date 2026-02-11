import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type PriceListStatus = "active" | "inactive" | "expired";

export interface PriceListItem {
  item_id: string;
  price_list_id: string;
  product_id: string;
  unit_price: number;
  min_quantity?: number;
  max_quantity?: number;
  discount_percent?: number;
  effective_from?: string;
  effective_to?: string;
  is_active: boolean;
  product?: {
    product_id: string;
    sku: string;
    name: string;
    base_price?: number;
  };
}

export interface PriceList extends BaseEntity {
  price_list_id: string;
  company_id: string;
  code: string;
  name: string;
  description?: string;
  currency: string;
  is_default: boolean;
  priority: number;
  effective_from: string;
  effective_to?: string;
  customer_type?: "all" | "wholesale" | "retail" | "vip";
  customer_id?: string;
  customer_group_id?: string;
  discount_percent?: number;
  markup_percent?: number;
  rounding_rule?: "none" | "up" | "down" | "nearest";
  rounding_precision?: number;
  is_active: boolean;
  notes?: string;
  created_by: string;
  items?: PriceListItem[];
  customer?: {
    third_party_id: string;
    legal_name: string;
    comercial_name?: string;
  };
}
