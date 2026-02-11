import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface Branch extends BaseEntity {
  branch_code: string;
  branch_name: string;
  branch_type: string;
  is_active: boolean;
}
