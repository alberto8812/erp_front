import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface ShippingMethod extends BaseEntity {
  code: string;
  name: string;
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
}
