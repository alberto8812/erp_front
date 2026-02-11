import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface ProductCategory extends BaseEntity {
  category_id: string;
  company_id: string;
  code: string;
  name: string;
  description?: string;
  parent_category_id?: string;
  parent_category_code?: string;
  parent_category_name?: string;
  level: number;
  path?: string;
  is_active: boolean;
}
