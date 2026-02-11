import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface Incoterm extends BaseEntity {
  code: string;
  name: string;
  version: string;
  applies_to: string;
  is_active: boolean;
}
