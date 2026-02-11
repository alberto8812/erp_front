import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface Bank extends BaseEntity {
  bank_code: string;
  bank_name: string;
  swift_code: string;
  is_active: boolean;
}
