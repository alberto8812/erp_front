import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type RequisitionStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "partially_ordered"
  | "ordered"
  | "cancelled";

export type RequisitionPriority = "low" | "normal" | "high" | "urgent";

export interface RequisitionLine {
  line_id: string;
  requisition_id: string;
  line_number: number;
  product_id: string;
  description: string;
  quantity_requested: number;
  quantity_ordered: number;
  uom_id: string;
  estimated_unit_cost?: number;
  estimated_total?: number;
  required_date?: string;
  preferred_vendor_id?: string;
  notes?: string;
  status: "pending" | "partial" | "ordered" | "cancelled";
  product?: {
    product_id: string;
    sku: string;
    name: string;
  };
  uom?: {
    uom_id: string;
    code: string;
    name: string;
  };
  preferred_vendor?: {
    third_party_id: string;
    legal_name: string;
    comercial_name?: string;
  };
}

export interface Requisition extends BaseEntity {
  requisition_id: string;
  company_id: string;
  requisition_number: string;
  requisition_date: string;
  required_date?: string;
  requester_id: string;
  department_id?: string;
  cost_center_id?: string;
  priority: RequisitionPriority;
  status: RequisitionStatus;
  justification?: string;
  notes?: string;
  internal_notes?: string;
  estimated_total?: number;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  lines?: RequisitionLine[];
  requester?: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  department?: {
    department_id: string;
    code: string;
    name: string;
  };
  cost_center?: {
    cost_center_id: string;
    code: string;
    name: string;
  };
}
