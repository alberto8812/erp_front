import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface TaxResponsibility extends BaseEntity {
  code: string;
  name: string;
  responsibility_type: string;
  is_active: boolean;
}
