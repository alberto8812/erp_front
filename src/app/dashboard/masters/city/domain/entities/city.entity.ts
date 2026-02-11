import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface City extends BaseEntity {
  code: string;
  name: string;
  dane_code: string;
  is_capital: boolean;
  is_active: boolean;
}
