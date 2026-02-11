import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export interface StateDeparment extends BaseEntity {
  code: string;
  name: string;
  dane_code: string;
  is_active: boolean;
}
