export type MaintenanceFrequencyType =
  | "time_based"
  | "meter_based"
  | "calendar_based"
  | "hybrid";

export type MaintenancePriority = "critical" | "high" | "medium" | "low";

export type MaintenancePlanStatus = "active" | "inactive" | "expired" | "draft";

export interface PlanTask {
  task_id: string;
  plan_id: string;
  sequence: number;
  task_name: string;
  description?: string;
  estimated_minutes?: number;
  is_mandatory: boolean;
  requires_measurement: boolean;
  measurement_unit?: string;
  min_value?: number;
  max_value?: number;
  target_value?: number;
  safety_instructions?: string;
  is_deleted: boolean;
  created_at: string;
}

export interface PlanSparePart {
  plan_spare_id: string;
  plan_id: string;
  product_id: string;
  product?: {
    product_id: string;
    sku: string;
    name: string;
    uom?: string;
  };
  quantity: number;
  is_mandatory: boolean;
  notes?: string;
  is_deleted: boolean;
  created_at: string;
}

export interface MaintenancePlan {
  plan_id: string;
  company_id: string;
  plan_code: string;
  plan_name: string;
  description?: string;
  asset_id: string;
  asset?: {
    asset_id: string;
    asset_code: string;
    asset_name: string;
    criticality?: string;
  };
  frequency_type: MaintenanceFrequencyType;
  priority: MaintenancePriority;
  frequency_days?: number;
  frequency_weeks?: number;
  frequency_months?: number;
  frequency_meter_value?: number;
  meter_type?: string;
  calendar_months?: number[];
  calendar_day?: number;
  estimated_duration_hours?: number;
  estimated_duration_minutes?: number;
  estimated_labor_cost?: number;
  estimated_parts_cost?: number;
  estimated_total_cost?: number;
  required_technicians?: number;
  assigned_team_id?: string;
  assigned_team?: {
    team_id: string;
    name: string;
  };
  next_due_date?: string;
  next_due_meter?: number;
  last_execution_date?: string;
  last_execution_wo_id?: string;
  advance_days?: number;
  overdue_tolerance_days?: number;
  auto_generate_wo: boolean;
  is_active: boolean;
  is_deleted: boolean;
  tasks?: PlanTask[];
  spare_parts?: PlanSparePart[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

export function getFrequencyTypeLabel(type: MaintenanceFrequencyType): string {
  const labels: Record<MaintenanceFrequencyType, string> = {
    time_based: "Basado en Tiempo",
    meter_based: "Basado en Medidor",
    calendar_based: "Calendario",
    hybrid: "Híbrido",
  };
  return labels[type] || type;
}

export function getFrequencyTypeColor(type: MaintenanceFrequencyType): string {
  const colors: Record<MaintenanceFrequencyType, string> = {
    time_based: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    meter_based: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    calendar_based: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    hybrid: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };
  return colors[type] || "bg-muted text-muted-foreground";
}

export function getPriorityLabel(priority: MaintenancePriority): string {
  const labels: Record<MaintenancePriority, string> = {
    critical: "Crítico",
    high: "Alto",
    medium: "Medio",
    low: "Bajo",
  };
  return labels[priority] || priority;
}

export function getPriorityColor(priority: MaintenancePriority): string {
  const colors: Record<MaintenancePriority, string> = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    high: "bg-warning/10 text-warning border-warning/20",
    medium: "bg-primary/10 text-primary border-primary/20",
    low: "bg-muted text-muted-foreground border-muted",
  };
  return colors[priority] || "bg-muted text-muted-foreground";
}

export function getPlanStatusLabel(isActive: boolean): string {
  return isActive ? "Activo" : "Inactivo";
}

export function getPlanStatusColor(isActive: boolean): string {
  return isActive
    ? "bg-success/10 text-success border-success/20"
    : "bg-muted text-muted-foreground border-muted";
}

export function formatFrequency(plan: MaintenancePlan): string {
  const parts: string[] = [];

  if (plan.frequency_days && plan.frequency_days > 0) {
    parts.push(`${plan.frequency_days} día${plan.frequency_days > 1 ? "s" : ""}`);
  }
  if (plan.frequency_weeks && plan.frequency_weeks > 0) {
    parts.push(`${plan.frequency_weeks} semana${plan.frequency_weeks > 1 ? "s" : ""}`);
  }
  if (plan.frequency_months && plan.frequency_months > 0) {
    parts.push(`${plan.frequency_months} mes${plan.frequency_months > 1 ? "es" : ""}`);
  }
  if (plan.frequency_meter_value && plan.frequency_meter_value > 0) {
    parts.push(`${plan.frequency_meter_value} ${plan.meter_type || "unidades"}`);
  }

  return parts.length > 0 ? `Cada ${parts.join(" / ")}` : "Sin frecuencia";
}

export function formatDuration(hours?: number, minutes?: number): string {
  const totalMinutes = (hours || 0) * 60 + (minutes || 0);
  if (totalMinutes === 0) return "—";

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}
