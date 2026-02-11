import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface Country extends BaseEntity {
  iso_code: string;
  name: string;
  phone_code: string;
  currency_code: string;
  is_active: boolean;
}
