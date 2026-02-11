import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface TaxCode extends BaseEntity {
  code: string;
  name: string;
  tax_type: string;
  tax_rate: number;
  is_active: boolean;
}
