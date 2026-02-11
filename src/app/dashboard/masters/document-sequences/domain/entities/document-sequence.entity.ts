import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface DocumentSequence extends BaseEntity {
  sequence_code: string;
  sequence_name: string;
  prefix: string;
  current_number: number;
  is_active: boolean;
}
