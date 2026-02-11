import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface PaymentMethod extends BaseEntity {
  code: string;
  name: string;
  payment_type: string;
  is_active: boolean;
}
