import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface Uom extends BaseEntity {
  code: string;
  name: string;
  category: string;
  conversion_factor: number;
  is_active: boolean;
}
