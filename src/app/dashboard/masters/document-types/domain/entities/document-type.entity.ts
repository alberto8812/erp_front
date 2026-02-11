import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface DocumentType extends BaseEntity {
  code: string;
  name: string;
  applies_to: string;
  is_active: boolean;
}
