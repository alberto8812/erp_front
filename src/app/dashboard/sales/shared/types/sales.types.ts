// Sales Order Status
export type SalesOrderStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "confirmed"
  | "partial_shipped"
  | "completed"
  | "cancelled";

export const SALES_ORDER_STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "pending_approval", label: "Pendiente Aprobación" },
  { value: "approved", label: "Aprobada" },
  { value: "confirmed", label: "Confirmada" },
  { value: "partial_shipped", label: "Parcialmente Enviada" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
] as const;

// Sales Order Approval Status
export type SalesOrderApprovalStatus = "pending" | "approved" | "rejected";

export const SALES_ORDER_APPROVAL_STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "approved", label: "Aprobado" },
  { value: "rejected", label: "Rechazado" },
] as const;

// Sales Order Line Status
export type SalesOrderLineStatus = "open" | "partial" | "completed" | "cancelled";

export const SALES_ORDER_LINE_STATUS_OPTIONS = [
  { value: "open", label: "Abierta" },
  { value: "partial", label: "Parcial" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
] as const;

// Helper to get label from value
export function getSalesOrderStatusLabel(status: SalesOrderStatus): string {
  return SALES_ORDER_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getSalesOrderApprovalStatusLabel(status: SalesOrderApprovalStatus): string {
  return SALES_ORDER_APPROVAL_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getSalesOrderLineStatusLabel(status: SalesOrderLineStatus): string {
  return SALES_ORDER_LINE_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

// Status color helpers for badges
export function getSalesOrderStatusColor(status: SalesOrderStatus): string {
  switch (status) {
    case "draft":
      return "bg-muted text-muted-foreground";
    case "pending_approval":
      return "bg-warning/15 text-warning";
    case "approved":
      return "bg-primary/15 text-primary";
    case "confirmed":
      return "bg-success/15 text-success";
    case "partial_shipped":
      return "bg-chart-2/15 text-chart-2";
    case "completed":
      return "bg-success/15 text-success";
    case "cancelled":
      return "bg-destructive/15 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// Quotation Status
export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired" | "converted";

export const QUOTATION_STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "sent", label: "Enviada" },
  { value: "accepted", label: "Aceptada" },
  { value: "rejected", label: "Rechazada" },
  { value: "expired", label: "Expirada" },
  { value: "converted", label: "Convertida" },
] as const;

export function getQuotationStatusLabel(status: QuotationStatus): string {
  return QUOTATION_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getQuotationStatusColor(status: QuotationStatus): string {
  switch (status) {
    case "draft":
      return "bg-muted text-muted-foreground";
    case "sent":
      return "bg-primary/15 text-primary";
    case "accepted":
      return "bg-success/15 text-success";
    case "rejected":
      return "bg-destructive/15 text-destructive";
    case "expired":
      return "bg-warning/15 text-warning";
    case "converted":
      return "bg-chart-2/15 text-chart-2";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// Shipment Status
export type ShipmentStatus = "draft" | "ready" | "shipped" | "delivered" | "cancelled";

export const SHIPMENT_STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "ready", label: "Listo para Envío" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
] as const;

export function getShipmentStatusLabel(status: ShipmentStatus): string {
  return SHIPMENT_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getShipmentStatusColor(status: ShipmentStatus): string {
  switch (status) {
    case "draft":
      return "bg-muted text-muted-foreground";
    case "ready":
      return "bg-primary/15 text-primary";
    case "shipped":
      return "bg-chart-2/15 text-chart-2";
    case "delivered":
      return "bg-success/15 text-success";
    case "cancelled":
      return "bg-destructive/15 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// Return Status
export type ReturnStatus = "draft" | "pending_approval" | "approved" | "received" | "processed" | "cancelled";

export const RETURN_STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "pending_approval", label: "Pendiente Aprobación" },
  { value: "approved", label: "Aprobada" },
  { value: "received", label: "Recibida" },
  { value: "processed", label: "Procesada" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export function getReturnStatusLabel(status: ReturnStatus): string {
  return RETURN_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getReturnStatusColor(status: ReturnStatus): string {
  switch (status) {
    case "draft":
      return "bg-muted text-muted-foreground";
    case "pending_approval":
      return "bg-warning/15 text-warning";
    case "approved":
      return "bg-primary/15 text-primary";
    case "received":
      return "bg-chart-2/15 text-chart-2";
    case "processed":
      return "bg-success/15 text-success";
    case "cancelled":
      return "bg-destructive/15 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// Return Reason Codes
export type ReturnReasonCode =
  | "defective"
  | "wrong_item"
  | "damaged"
  | "not_as_described"
  | "customer_changed_mind"
  | "quality_issue"
  | "other";

export const RETURN_REASON_OPTIONS = [
  { value: "defective", label: "Defectuoso" },
  { value: "wrong_item", label: "Producto Incorrecto" },
  { value: "damaged", label: "Dañado" },
  { value: "not_as_described", label: "No Coincide con Descripción" },
  { value: "customer_changed_mind", label: "Cambio de Opinión" },
  { value: "quality_issue", label: "Problema de Calidad" },
  { value: "other", label: "Otro" },
] as const;

export function getReturnReasonLabel(reason: ReturnReasonCode): string {
  return RETURN_REASON_OPTIONS.find((o) => o.value === reason)?.label ?? reason;
}

// Return Condition
export type ReturnCondition = "new" | "used" | "damaged" | "defective";

export const RETURN_CONDITION_OPTIONS = [
  { value: "new", label: "Nuevo" },
  { value: "used", label: "Usado" },
  { value: "damaged", label: "Dañado" },
  { value: "defective", label: "Defectuoso" },
] as const;

// Refund Method
export type RefundMethod = "credit_note" | "refund" | "exchange";

export const REFUND_METHOD_OPTIONS = [
  { value: "credit_note", label: "Nota de Crédito" },
  { value: "refund", label: "Reembolso" },
  { value: "exchange", label: "Cambio" },
] as const;

// Price List Status
export type PriceListStatus = "active" | "inactive" | "expired";

export const PRICE_LIST_STATUS_OPTIONS = [
  { value: "active", label: "Activa" },
  { value: "inactive", label: "Inactiva" },
  { value: "expired", label: "Expirada" },
] as const;

export function getPriceListStatusLabel(status: PriceListStatus): string {
  return PRICE_LIST_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getPriceListStatusColor(status: PriceListStatus): string {
  switch (status) {
    case "active":
      return "bg-success/15 text-success";
    case "inactive":
      return "bg-muted text-muted-foreground";
    case "expired":
      return "bg-warning/15 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// Price List Customer Type
export type PriceListCustomerType = "all" | "wholesale" | "retail" | "vip";

export const PRICE_LIST_CUSTOMER_TYPE_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "wholesale", label: "Mayorista" },
  { value: "retail", label: "Minorista" },
  { value: "vip", label: "VIP" },
] as const;

// Rounding Rules
export type RoundingRule = "none" | "up" | "down" | "nearest";

export const ROUNDING_RULE_OPTIONS = [
  { value: "none", label: "Sin Redondeo" },
  { value: "up", label: "Hacia Arriba" },
  { value: "down", label: "Hacia Abajo" },
  { value: "nearest", label: "Al Más Cercano" },
] as const;

// Invoice Status
export type InvoiceStatus = "draft" | "posted" | "partial" | "paid" | "overdue" | "voided" | "cancelled";

export const INVOICE_STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "posted", label: "Contabilizada" },
  { value: "partial", label: "Pago Parcial" },
  { value: "paid", label: "Pagada" },
  { value: "overdue", label: "Vencida" },
  { value: "voided", label: "Anulada" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export function getInvoiceStatusLabel(status: InvoiceStatus): string {
  return INVOICE_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getInvoiceStatusColor(status: InvoiceStatus): string {
  switch (status) {
    case "draft":
      return "bg-muted text-muted-foreground";
    case "posted":
      return "bg-primary/15 text-primary";
    case "partial":
      return "bg-chart-2/15 text-chart-2";
    case "paid":
      return "bg-success/15 text-success";
    case "overdue":
      return "bg-destructive/15 text-destructive";
    case "voided":
      return "bg-warning/15 text-warning";
    case "cancelled":
      return "bg-destructive/15 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// Invoice Type
export type InvoiceType = "invoice" | "credit_note" | "debit_note";

export const INVOICE_TYPE_OPTIONS = [
  { value: "invoice", label: "Factura" },
  { value: "credit_note", label: "Nota Crédito" },
  { value: "debit_note", label: "Nota Débito" },
] as const;

// Credit Note Status
export type CreditNoteStatus = "draft" | "pending_approval" | "approved" | "posted" | "partial" | "applied" | "voided" | "cancelled";

export const CREDIT_NOTE_STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "pending_approval", label: "Pendiente Aprobación" },
  { value: "approved", label: "Aprobada" },
  { value: "posted", label: "Contabilizada" },
  { value: "partial", label: "Aplicación Parcial" },
  { value: "applied", label: "Aplicada" },
  { value: "voided", label: "Anulada" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export function getCreditNoteStatusLabel(status: CreditNoteStatus): string {
  return CREDIT_NOTE_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function getCreditNoteStatusColor(status: CreditNoteStatus): string {
  switch (status) {
    case "draft":
      return "bg-muted text-muted-foreground";
    case "pending_approval":
      return "bg-warning/15 text-warning";
    case "approved":
      return "bg-primary/15 text-primary";
    case "posted":
      return "bg-chart-2/15 text-chart-2";
    case "partial":
      return "bg-chart-2/15 text-chart-2";
    case "applied":
      return "bg-success/15 text-success";
    case "voided":
      return "bg-warning/15 text-warning";
    case "cancelled":
      return "bg-destructive/15 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// Credit Note Type
export type CreditNoteType = "sales_return" | "price_adjustment" | "discount_granted" | "billing_error" | "goodwill";

export const CREDIT_NOTE_TYPE_OPTIONS = [
  { value: "sales_return", label: "Devolución de Venta" },
  { value: "price_adjustment", label: "Ajuste de Precio" },
  { value: "discount_granted", label: "Descuento Otorgado" },
  { value: "billing_error", label: "Error de Facturación" },
  { value: "goodwill", label: "Cortesía" },
] as const;

export function getCreditNoteTypeLabel(type: CreditNoteType): string {
  return CREDIT_NOTE_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}
