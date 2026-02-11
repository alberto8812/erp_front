import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface Carrier extends BaseEntity {
  carrier_code: string;
  carrier_name: string;
  contact_email: string;
  is_active: boolean;
}
