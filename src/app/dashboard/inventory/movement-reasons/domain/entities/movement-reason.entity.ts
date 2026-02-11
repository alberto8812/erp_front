import type { BaseEntity } from "@/shared/domain/base/base-entity.types";
import type { KardexMovementType } from "@/app/dashboard/inventory/shared/types/inventory.types";

export interface MovementReason extends BaseEntity {
  reason_id: string;
  company_id: string;
  code: string;
  name: string;
  description?: string;
  movement_types: KardexMovementType[];
  requires_approval: boolean;
  gl_account_id?: string;
  is_active: boolean;
}
