import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type FailureCodeType = "failure" | "cause" | "action";

export interface FailureCode extends BaseEntity {
  failure_code_id: string;
  company_id: string;
  code: string;
  name: string;
  description?: string;
  code_type: FailureCodeType;
  category?: string;
  parent_code_id?: string;
  parent_code?: string;
  is_active: boolean;
  usage_count?: number;
  causes?: FailureCode[];
  actions?: FailureCode[];
}
