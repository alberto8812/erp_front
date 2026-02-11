import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface EconomicActivity extends BaseEntity {
  code: string;
  name: string;
  section: string;
  is_active: boolean;
}
