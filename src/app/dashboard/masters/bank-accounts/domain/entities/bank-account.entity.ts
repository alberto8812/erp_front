import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface BankAccount extends BaseEntity {
  account_number: string;
  account_name: string;
  account_type: string;
  is_active: boolean;
}
