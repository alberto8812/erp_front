import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface PaymentTerm extends BaseEntity {
  code: string;
  name: string;
  days: number;
  is_immediate: boolean;
  is_active: boolean;
}
