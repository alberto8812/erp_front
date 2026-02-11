export type WorkOrderType =
  | "preventive"
  | "corrective"
  | "predictive"
  | "improvement"
  | "inspection"
  | "calibration"
  | "emergency"
  | "project";

export type WorkOrderStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "scheduled"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "pending_review"
  | "closed"
  | "cancelled";

export type MaintenancePriority =
  | "emergency"
  | "urgent"
  | "high"
  | "normal"
  | "low"
  | "planned";

export interface WorkOrderTask {
  wo_task_id: string;
  work_order_id: string;
  sequence: number;
  task_name: string;
  description?: string;
  instructions?: string;
  is_completed: boolean;
  completed_at?: string;
  completed_by?: string;
  actual_minutes?: number;
  estimated_minutes?: number;
  measurement_value?: number;
  measurement_unit?: string;
  measurement_passed?: boolean;
  min_value?: number;
  max_value?: number;
  target_value?: number;
  notes?: string;
  photos?: string[];
}

export interface WorkOrderLabor {
  wo_labor_id: string;
  work_order_id: string;
  technician_id: string;
  technician_name: string;
  start_datetime: string;
  end_datetime?: string;
  hours_worked: number;
  is_overtime: boolean;
  hourly_rate: number;
  total_cost: number;
  activity_description?: string;
  skill_type?: string;
}

export interface WorkOrderPart {
  wo_part_id: string;
  work_order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity_required: number;
  quantity_used: number;
  quantity_returned: number;
  uom_id: string;
  uom_code: string;
  warehouse_id?: string;
  lot_id?: string;
  unit_cost: number;
  total_cost: number;
  is_issued: boolean;
  issued_at?: string;
  issued_by?: string;
  notes?: string;
}

export interface MaintenanceWorkOrder {
  work_order_id: string;
  company_id: string;
  wo_number: string;
  wo_type: WorkOrderType;
  priority: MaintenancePriority;
  status: WorkOrderStatus;
  asset_id: string;
  asset?: {
    asset_id: string;
    asset_code: string;
    asset_name: string;
    manufacturer?: string;
    model?: string;
    criticality: string;
  };
  plan_id?: string;
  title: string;
  description?: string;
  failure_description?: string;
  failure_code_id?: string;
  failure_code?: {
    failure_code_id: string;
    code: string;
    name: string;
  };
  requested_by: string;
  requested_date: string;
  scheduled_start_date?: string;
  scheduled_end_date?: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  actual_duration_hours?: number;
  requires_shutdown: boolean;
  equipment_stopped_at?: string;
  equipment_restarted_at?: string;
  downtime_hours?: number;
  assigned_to?: string;
  assigned_user?: {
    user_id: string;
    name: string;
  };
  team_id?: string;
  supervisor_id?: string;
  estimated_labor_cost?: number;
  estimated_parts_cost?: number;
  estimated_external_cost?: number;
  estimated_total_cost?: number;
  actual_labor_cost?: number;
  actual_parts_cost?: number;
  actual_external_cost?: number;
  actual_total_cost?: number;
  cost_center_id?: string;
  meter_reading_at_start?: number;
  meter_reading_at_end?: number;
  safety_permit_required: boolean;
  safety_permit_number?: string;
  lockout_tagout_required: boolean;
  root_cause?: string;
  corrective_action?: string;
  preventive_action?: string;
  completion_notes?: string;
  follow_up_required: boolean;
  follow_up_wo_id?: string;
  approved_by?: string;
  approved_at?: string;
  closed_by?: string;
  closed_at?: string;
  work_quality_rating?: number;
  feedback?: string;
  tasks?: WorkOrderTask[];
  labor?: WorkOrderLabor[];
  parts?: WorkOrderPart[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
  created_by: string;
}

export function getWorkOrderTypeLabel(type: WorkOrderType): string {
  const labels: Record<WorkOrderType, string> = {
    preventive: "Preventivo",
    corrective: "Correctivo",
    predictive: "Predictivo",
    improvement: "Mejora",
    inspection: "Inspección",
    calibration: "Calibración",
    emergency: "Emergencia",
    project: "Proyecto",
  };
  return labels[type] || type;
}

export function getWorkOrderTypeColor(type: WorkOrderType): string {
  const colors: Record<WorkOrderType, string> = {
    preventive: "bg-primary/10 text-primary border-primary/20",
    corrective: "bg-warning/10 text-warning border-warning/20",
    predictive: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    improvement: "bg-success/10 text-success border-success/20",
    inspection: "bg-muted text-muted-foreground border-muted",
    calibration: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    emergency: "bg-destructive/10 text-destructive border-destructive/20",
    project: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  };
  return colors[type] || "bg-muted text-muted-foreground";
}

export function getWorkOrderStatusLabel(status: WorkOrderStatus): string {
  const labels: Record<WorkOrderStatus, string> = {
    draft: "Borrador",
    pending_approval: "Pendiente Aprobación",
    approved: "Aprobada",
    scheduled: "Programada",
    in_progress: "En Progreso",
    on_hold: "En Espera",
    completed: "Completada",
    pending_review: "Pendiente Revisión",
    closed: "Cerrada",
    cancelled: "Cancelada",
  };
  return labels[status] || status;
}

export function getWorkOrderStatusColor(status: WorkOrderStatus): string {
  const colors: Record<WorkOrderStatus, string> = {
    draft: "bg-muted text-muted-foreground border-muted",
    pending_approval: "bg-warning/10 text-warning border-warning/20",
    approved: "bg-primary/10 text-primary border-primary/20",
    scheduled: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    in_progress: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    on_hold: "bg-warning/10 text-warning border-warning/20",
    completed: "bg-success/10 text-success border-success/20",
    pending_review: "bg-chart-5/10 text-chart-5 border-chart-5/20",
    closed: "bg-muted text-muted-foreground border-muted",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return colors[status] || "bg-muted text-muted-foreground";
}

export function getPriorityLabel(priority: MaintenancePriority): string {
  const labels: Record<MaintenancePriority, string> = {
    emergency: "Emergencia",
    urgent: "Urgente",
    high: "Alta",
    normal: "Normal",
    low: "Baja",
    planned: "Planificada",
  };
  return labels[priority] || priority;
}

export function getPriorityColor(priority: MaintenancePriority): string {
  const colors: Record<MaintenancePriority, string> = {
    emergency: "bg-destructive/10 text-destructive border-destructive/20",
    urgent: "bg-destructive/10 text-destructive border-destructive/20",
    high: "bg-warning/10 text-warning border-warning/20",
    normal: "bg-primary/10 text-primary border-primary/20",
    low: "bg-muted text-muted-foreground border-muted",
    planned: "bg-success/10 text-success border-success/20",
  };
  return colors[priority] || "bg-muted text-muted-foreground";
}
