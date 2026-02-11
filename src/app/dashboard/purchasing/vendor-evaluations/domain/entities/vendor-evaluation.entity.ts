import type { BaseEntity } from "@/shared/domain/base/base-entity.types";

export type VendorClassification = "A" | "B" | "C" | "D" | "F";

export type EvaluationStatus = "draft" | "submitted" | "approved" | "rejected";

export interface VendorEvaluationCriteria {
  criteria_id: string;
  evaluation_id: string;
  criteria_name: string;
  criteria_category: "quality" | "delivery" | "price" | "service" | "other";
  weight: number;
  score: number;
  weighted_score: number;
  comments?: string;
}

export interface VendorEvaluation extends BaseEntity {
  evaluation_id: string;
  company_id: string;
  evaluation_number: string;
  vendor_id: string;
  evaluation_date: string;
  period_start: string;
  period_end: string;
  evaluator_id: string;

  // Score categories (0-100)
  quality_score: number;
  delivery_score: number;
  price_score: number;
  communication_score: number;
  documentation_score: number;

  // Calculated overall
  overall_score: number;
  classification: VendorClassification;

  // Metrics
  total_orders?: number;
  on_time_delivery_rate?: number;
  quality_rejection_rate?: number;
  price_variance?: number;

  // Status and approval
  status: EvaluationStatus;
  approved_by?: string;
  approved_at?: string;

  // Notes
  strengths?: string;
  weaknesses?: string;
  improvement_areas?: string;
  recommendations?: string;
  notes?: string;

  created_by: string;

  // Relations
  criteria?: VendorEvaluationCriteria[];
  vendor?: {
    third_party_id: string;
    legal_name: string;
    comercial_name?: string;
    tax_id: string;
  };
  evaluator?: {
    user_id: string;
    first_name: string;
    last_name: string;
  };
}
