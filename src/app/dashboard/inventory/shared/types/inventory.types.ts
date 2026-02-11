// ============================================
// TIPOS COMPARTIDOS DEL MÓDULO DE INVENTARIO
// ============================================

// --- Product Types ---
export type ProductType = 'stockable' | 'service' | 'consumable' | 'kit';

export const PRODUCT_TYPE_OPTIONS = [
  { label: 'Inventariable', value: 'stockable' },
  { label: 'Servicio', value: 'service' },
  { label: 'Consumible', value: 'consumable' },
  { label: 'Kit/Bundle', value: 'kit' },
] as const;

// --- Valuation Methods ---
export type ValuationMethod = 'fifo' | 'lifo' | 'average' | 'specific' | 'standard';

export const VALUATION_METHOD_OPTIONS = [
  { label: 'FIFO (Primero en Entrar)', value: 'fifo' },
  { label: 'LIFO (Último en Entrar)', value: 'lifo' },
  { label: 'Promedio Ponderado', value: 'average' },
  { label: 'Identificación Específica', value: 'specific' },
  { label: 'Costo Estándar', value: 'standard' },
] as const;

// --- Location Types ---
export type LocationType =
  | 'receiving'
  | 'storage'
  | 'picking'
  | 'packing'
  | 'shipping'
  | 'quality'
  | 'quarantine'
  | 'returns'
  | 'scrap'
  | 'production'
  | 'transit';

export const LOCATION_TYPE_OPTIONS = [
  { label: 'Recepción', value: 'receiving' },
  { label: 'Almacenamiento', value: 'storage' },
  { label: 'Picking', value: 'picking' },
  { label: 'Empaque', value: 'packing' },
  { label: 'Despacho', value: 'shipping' },
  { label: 'Control de Calidad', value: 'quality' },
  { label: 'Cuarentena', value: 'quarantine' },
  { label: 'Devoluciones', value: 'returns' },
  { label: 'Desecho', value: 'scrap' },
  { label: 'Producción', value: 'production' },
  { label: 'En Tránsito', value: 'transit' },
] as const;

// --- Kardex Movement Types ---
export type KardexMovementType =
  // Entradas
  | 'purchase_receipt'
  | 'production_receipt'
  | 'transfer_in'
  | 'return_from_customer'
  | 'adjustment_in'
  | 'initial_inventory'
  | 'found_inventory'
  // Salidas
  | 'sales_shipment'
  | 'production_consumption'
  | 'transfer_out'
  | 'return_to_vendor'
  | 'adjustment_out'
  | 'scrap'
  | 'lost_inventory'
  | 'sample'
  | 'donation'
  // Otros
  | 'quality_hold'
  | 'quality_release'
  | 'location_transfer'
  | 'lot_transfer'
  | 'revaluation';

export const KARDEX_MOVEMENT_TYPE_OPTIONS = [
  // Entradas
  { label: 'Recepción de Compra', value: 'purchase_receipt', group: 'Entradas' },
  { label: 'Recepción de Producción', value: 'production_receipt', group: 'Entradas' },
  { label: 'Transferencia Entrada', value: 'transfer_in', group: 'Entradas' },
  { label: 'Devolución de Cliente', value: 'return_from_customer', group: 'Entradas' },
  { label: 'Ajuste Positivo', value: 'adjustment_in', group: 'Entradas' },
  { label: 'Inventario Inicial', value: 'initial_inventory', group: 'Entradas' },
  { label: 'Inventario Encontrado', value: 'found_inventory', group: 'Entradas' },
  // Salidas
  { label: 'Despacho de Venta', value: 'sales_shipment', group: 'Salidas' },
  { label: 'Consumo de Producción', value: 'production_consumption', group: 'Salidas' },
  { label: 'Transferencia Salida', value: 'transfer_out', group: 'Salidas' },
  { label: 'Devolución a Proveedor', value: 'return_to_vendor', group: 'Salidas' },
  { label: 'Ajuste Negativo', value: 'adjustment_out', group: 'Salidas' },
  { label: 'Desecho/Merma', value: 'scrap', group: 'Salidas' },
  { label: 'Inventario Perdido', value: 'lost_inventory', group: 'Salidas' },
  { label: 'Muestra', value: 'sample', group: 'Salidas' },
  { label: 'Donación', value: 'donation', group: 'Salidas' },
  // Otros
  { label: 'Retención Calidad', value: 'quality_hold', group: 'Otros' },
  { label: 'Liberación Calidad', value: 'quality_release', group: 'Otros' },
  { label: 'Cambio de Ubicación', value: 'location_transfer', group: 'Otros' },
  { label: 'Cambio de Lote', value: 'lot_transfer', group: 'Otros' },
  { label: 'Revalorización', value: 'revaluation', group: 'Otros' },
] as const;

// --- Kardex Status ---
export type KardexStatus = 'draft' | 'confirmed' | 'posted' | 'cancelled';

export const KARDEX_STATUS_OPTIONS = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Confirmado', value: 'confirmed' },
  { label: 'Contabilizado', value: 'posted' },
  { label: 'Cancelado', value: 'cancelled' },
] as const;

// --- Lot Status ---
export type LotStatus = 'available' | 'reserved' | 'quarantine' | 'expired' | 'consumed' | 'blocked';

export const LOT_STATUS_OPTIONS = [
  { label: 'Disponible', value: 'available' },
  { label: 'Reservado', value: 'reserved' },
  { label: 'Cuarentena', value: 'quarantine' },
  { label: 'Vencido', value: 'expired' },
  { label: 'Consumido', value: 'consumed' },
  { label: 'Bloqueado', value: 'blocked' },
] as const;

// --- Count Status ---
export type CountStatus = 'planned' | 'in_progress' | 'pending_review' | 'approved' | 'posted' | 'cancelled';

export const COUNT_STATUS_OPTIONS = [
  { label: 'Planificado', value: 'planned' },
  { label: 'En Progreso', value: 'in_progress' },
  { label: 'Pendiente Revisión', value: 'pending_review' },
  { label: 'Aprobado', value: 'approved' },
  { label: 'Contabilizado', value: 'posted' },
  { label: 'Cancelado', value: 'cancelled' },
] as const;

export function getCountStatusLabel(status: CountStatus): string {
  return COUNT_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getCountStatusColor(status: CountStatus): string {
  switch (status) {
    case 'planned':
      return 'bg-muted text-muted-foreground';
    case 'in_progress':
      return 'bg-primary/15 text-primary';
    case 'pending_review':
      return 'bg-warning/15 text-warning';
    case 'approved':
      return 'bg-success/15 text-success';
    case 'posted':
      return 'bg-chart-2/15 text-chart-2';
    case 'cancelled':
      return 'bg-destructive/15 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

// --- Kardex helpers ---
export function getKardexStatusLabel(status: KardexStatus): string {
  return KARDEX_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getKardexStatusColor(status: KardexStatus): string {
  switch (status) {
    case 'draft':
      return 'bg-muted text-muted-foreground';
    case 'confirmed':
      return 'bg-primary/15 text-primary';
    case 'posted':
      return 'bg-success/15 text-success';
    case 'cancelled':
      return 'bg-destructive/15 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getKardexMovementTypeLabel(type: KardexMovementType): string {
  return KARDEX_MOVEMENT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

export function isKardexEntryType(type: KardexMovementType): boolean {
  return ['purchase_receipt', 'production_receipt', 'transfer_in', 'return_from_customer', 'adjustment_in', 'initial_inventory', 'found_inventory'].includes(type);
}

// --- Lot helpers ---
export function getLotStatusLabel(status: LotStatus): string {
  return LOT_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getLotStatusColor(status: LotStatus): string {
  switch (status) {
    case 'available':
      return 'bg-success/15 text-success';
    case 'reserved':
      return 'bg-primary/15 text-primary';
    case 'quarantine':
      return 'bg-warning/15 text-warning';
    case 'expired':
      return 'bg-destructive/15 text-destructive';
    case 'consumed':
      return 'bg-muted text-muted-foreground';
    case 'blocked':
      return 'bg-destructive/15 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

// --- Entity Status (común) ---
export type EntityStatus = 'active' | 'inactive';

export const ENTITY_STATUS_OPTIONS = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
] as const;
