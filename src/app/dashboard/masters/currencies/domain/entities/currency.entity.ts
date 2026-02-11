import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface Currency extends BaseEntity {
  iso_code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  is_active: boolean;
}
