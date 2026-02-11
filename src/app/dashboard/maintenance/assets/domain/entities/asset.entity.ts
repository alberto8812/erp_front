export type AssetStatus =
  | "operational"
  | "under_maintenance"
  | "idle"
  | "decommissioned"
  | "pending_install"
  | "retired";

export type AssetCriticality = "critical" | "high" | "medium" | "low";

export interface MaintenanceAsset {
  asset_id: string;
  company_id: string;
  asset_code: string;
  asset_name: string;
  description?: string;
  asset_tag?: string;
  barcode?: string;
  category_id?: string;
  category?: {
    category_id: string;
    code: string;
    name: string;
  };
  asset_type_id?: string;
  criticality: AssetCriticality;
  warehouse_id?: string;
  warehouse?: {
    warehouse_id: string;
    code: string;
    name: string;
  };
  location_id?: string;
  area?: string;
  production_line?: string;
  parent_asset_id?: string;
  parent_asset?: MaintenanceAsset;
  level: number;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  year_manufactured?: number;
  specifications?: Record<string, unknown>;
  purchase_date?: string;
  installation_date?: string;
  warranty_start_date?: string;
  warranty_end_date?: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  decommission_date?: string;
  vendor_id?: string;
  vendor?: {
    third_party_id: string;
    legal_name: string;
  };
  purchase_order_id?: string;
  purchase_cost?: number;
  replacement_cost?: number;
  salvage_value?: number;
  fixed_asset_id?: string;
  has_meter: boolean;
  meter_type?: string;
  meter_unit?: string;
  current_meter_reading?: number;
  last_meter_reading_date?: string;
  responsible_user_id?: string;
  responsible_user?: {
    user_id: string;
    name: string;
  };
  cost_center_id?: string;
  image_url?: string;
  manual_url?: string;
  status: AssetStatus;
  is_deleted: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

export function getAssetStatusLabel(status: AssetStatus): string {
  const labels: Record<AssetStatus, string> = {
    operational: "Operativo",
    under_maintenance: "En Mantenimiento",
    idle: "Inactivo",
    decommissioned: "Dado de baja",
    pending_install: "Pendiente instalación",
    retired: "Retirado",
  };
  return labels[status] || status;
}

export function getAssetStatusColor(status: AssetStatus): string {
  const colors: Record<AssetStatus, string> = {
    operational: "bg-success/10 text-success border-success/20",
    under_maintenance: "bg-warning/10 text-warning border-warning/20",
    idle: "bg-muted text-muted-foreground border-muted",
    decommissioned: "bg-destructive/10 text-destructive border-destructive/20",
    pending_install: "bg-primary/10 text-primary border-primary/20",
    retired: "bg-muted text-muted-foreground border-muted",
  };
  return colors[status] || "bg-muted text-muted-foreground";
}

export function getCriticalityLabel(criticality: AssetCriticality): string {
  const labels: Record<AssetCriticality, string> = {
    critical: "Crítico",
    high: "Alto",
    medium: "Medio",
    low: "Bajo",
  };
  return labels[criticality] || criticality;
}

export function getCriticalityColor(criticality: AssetCriticality): string {
  const colors: Record<AssetCriticality, string> = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    high: "bg-warning/10 text-warning border-warning/20",
    medium: "bg-primary/10 text-primary border-primary/20",
    low: "bg-muted text-muted-foreground border-muted",
  };
  return colors[criticality] || "bg-muted text-muted-foreground";
}
