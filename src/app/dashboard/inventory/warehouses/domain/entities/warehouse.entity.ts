import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface Warehouse extends BaseEntity {
  warehouse_id: string;
  company_id: string;
  code: string;
  name: string;
  description?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  manager_id?: string;
  phone?: string;
  email?: string;
  is_default: boolean;
  allows_negative_stock: boolean;
  is_active: boolean;
  inventory_account_id?: string;
}
