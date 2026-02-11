import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type DowntimeStatus = "active" | "resolved" | "cancelled";
export type DowntimeType = "planned" | "unplanned" | "breakdown" | "setup" | "changeover";

export interface Downtime extends BaseEntity {
  downtime_id: string;
  company_id: string;
  asset_id: string;
  asset_code?: string;
  asset_name?: string;
  downtime_number: string;
  downtime_type: DowntimeType;
  failure_code_id?: string;
  failure_code?: string;
  failure_description?: string;
  cause_code_id?: string;
  cause_code?: string;
  cause_description?: string;
  start_datetime: string;
  end_datetime?: string;
  duration_minutes?: number;
  description?: string;
  reported_by: string;
  resolved_by?: string;
  work_order_id?: string;
  work_order_number?: string;
  status: DowntimeStatus;
  impact_level?: "critical" | "high" | "medium" | "low";
  production_loss_units?: number;
  production_loss_value?: number;
  notes?: string;
  resolution_notes?: string;
}
