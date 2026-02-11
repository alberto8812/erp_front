"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Send,
  Ban,
  Truck,
  MoreHorizontal,
  Pencil,
  Loader2,
  Calendar,
  Building2,
  Package,
  FileText,
  CreditCard,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  findById,
  approveSalesOrder,
  rejectSalesOrder,
  confirmSalesOrder,
  cancelSalesOrder,
} from "../application/use-cases/sales-order.actions";
import type { SalesOrder, SalesOrderLine } from "../domain/entities/sales-order.entity";
import {
  getSalesOrderStatusLabel,
  getSalesOrderStatusColor,
  type SalesOrderStatus,
} from "../../shared/types/sales.types";

// ============================================================================
// Utility Functions
// ============================================================================

function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return formatDate(dateString);
}

// ============================================================================
// Sub-Components
// ============================================================================

function StatusStepper({ order }: { order: SalesOrder }) {
  const steps: { key: SalesOrderStatus; label: string }[] = [
    { key: "draft", label: "Borrador" },
    { key: "pending_approval", label: "Pendiente" },
    { key: "approved", label: "Aprobada" },
    { key: "confirmed", label: "Confirmada" },
    { key: "partial_shipped", label: "En Envio" },
    { key: "completed", label: "Completada" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <XCircle className="h-4 w-4" />
        <span className="font-medium">Orden Cancelada</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                isCompleted
                  ? "bg-success/10 text-success"
                  : isCurrent
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground/50"
              }`}
            >
              {isCompleted && <CheckCircle className="h-3 w-3" />}
              {isCurrent && <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
              <span className={isPending ? "opacity-50" : ""}>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight
                className={`h-3 w-3 mx-0.5 ${
                  index < currentIndex ? "text-success" : "text-muted-foreground/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FulfillmentProgress({ order }: { order: SalesOrder }) {
  const totalOrdered = order.lines?.reduce((sum, line) => sum + line.quantity_ordered, 0) || 0;
  const totalShipped = order.lines?.reduce((sum, line) => sum + line.quantity_shipped, 0) || 0;
  const progress = totalOrdered > 0 ? (totalShipped / totalOrdered) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Cumplimiento</span>
        <span className="font-medium tabular-nums">
          {totalShipped} / {totalOrdered} unidades
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{Math.round(progress)}% enviado</span>
        <span>{totalOrdered - totalShipped} pendientes</span>
      </div>
    </div>
  );
}

function OrderLineRow({ line, currency }: { line: SalesOrderLine; currency: string }) {
  const fulfillmentPercent =
    line.quantity_ordered > 0 ? (line.quantity_shipped / line.quantity_ordered) * 100 : 0;

  return (
    <TableRow className="group">
      <TableCell className="text-center text-muted-foreground font-mono text-xs">
        {line.line_number}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-sm line-clamp-1">
            {line.description || "Sin descripcion"}
          </span>
          {line.product?.sku && (
            <span className="text-xs text-muted-foreground font-mono">
              {line.product.sku}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono tabular-nums text-sm font-medium">
              {line.quantity_shipped}
            </span>
            <span className="text-muted-foreground text-xs">/</span>
            <span className="font-mono tabular-nums text-xs text-muted-foreground">
              {line.quantity_ordered}
            </span>
          </div>
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                fulfillmentPercent >= 100
                  ? "bg-success"
                  : fulfillmentPercent > 0
                  ? "bg-chart-2"
                  : "bg-muted"
              }`}
              style={{ width: `${Math.min(fulfillmentPercent, 100)}%` }}
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-sm">
        {formatCurrency(line.unit_price, currency)}
      </TableCell>
      <TableCell className="text-right">
        {line.discount_percent > 0 ? (
          <span className="text-xs text-destructive font-mono">-{line.discount_percent}%</span>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-sm font-medium">
        {formatCurrency(line.line_total, currency)}
      </TableCell>
    </TableRow>
  );
}

function TimelineEvent({
  title,
  date,
  color = "default",
}: {
  title: string;
  date: string;
  color?: "default" | "primary" | "success" | "destructive";
}) {
  const colorClasses = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
    success: "bg-success",
    destructive: "bg-destructive",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`h-2 w-2 rounded-full mt-1.5 ${colorClasses[color]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{formatRelativeDate(date)}</p>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function SalesOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const orderId = params.id as string;

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "reject" | "cancel" | null;
    reason: string;
  }>({ open: false, type: null, reason: "" });

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["sales-order", orderId],
    queryFn: () => findById(orderId),
  });

  const approveMutation = useMutation({
    mutationFn: () => approveSalesOrder(orderId),
    onSuccess: () => {
      toast({ title: "Orden aprobada correctamente" });
      queryClient.invalidateQueries({ queryKey: ["sales-order", orderId] });
    },
    onError: () => {
      toast({ title: "Error al aprobar la orden", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => rejectSalesOrder(orderId, reason),
    onSuccess: () => {
      toast({ title: "Orden rechazada" });
      queryClient.invalidateQueries({ queryKey: ["sales-order", orderId] });
      setConfirmDialog({ open: false, type: null, reason: "" });
    },
    onError: () => {
      toast({ title: "Error al rechazar la orden", variant: "destructive" });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmSalesOrder(orderId),
    onSuccess: () => {
      toast({ title: "Orden confirmada correctamente" });
      queryClient.invalidateQueries({ queryKey: ["sales-order", orderId] });
    },
    onError: () => {
      toast({ title: "Error al confirmar la orden", variant: "destructive" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => cancelSalesOrder(orderId, reason),
    onSuccess: () => {
      toast({ title: "Orden cancelada" });
      queryClient.invalidateQueries({ queryKey: ["sales-order", orderId] });
      setConfirmDialog({ open: false, type: null, reason: "" });
    },
    onError: () => {
      toast({ title: "Error al cancelar la orden", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-14 w-full" />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="col-span-4 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar la orden de venta</p>
          <button
            onClick={() => router.push("/dashboard/sales/sales-orders")}
            className="mt-4 text-primary hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const canEdit = order.status === "draft" || order.status === "pending_approval";
  const canApprove = order.status === "pending_approval";
  const canConfirm = order.status === "approved";
  const canShip = order.status === "confirmed" || order.status === "partial_shipped";
  const canCancel = !["cancelled", "completed", "partial_shipped"].includes(order.status);

  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
        {/* ================================================================ */}
        {/* Header */}
        {/* ================================================================ */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Back + Info */}
              <div className="flex items-center gap-4 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => router.push("/dashboard/sales/sales-orders")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-lg font-semibold tracking-tight">
                      {order.order_number}
                    </h1>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSalesOrderStatusColor(
                        order.status
                      )}`}
                    >
                      {getSalesOrderStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {order.customer?.legal_name || order.customer?.comercial_name || "Sin cliente"}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {canApprove && (
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate()}
                    disabled={approveMutation.isPending}
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Aprobar
                  </Button>
                )}

                {canConfirm && (
                  <Button
                    size="sm"
                    onClick={() => confirmMutation.mutate()}
                    disabled={confirmMutation.isPending}
                  >
                    {confirmMutation.isPending ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Confirmar
                  </Button>
                )}

                {canShip && (
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/sales/shipments/new?salesOrderId=${order.sales_order_id}`)
                    }
                  >
                    <Truck className="mr-1.5 h-3.5 w-3.5" />
                    Crear Despacho
                  </Button>
                )}

                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/sales/sales-orders/${orderId}/edit`)}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Editar
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {canApprove && (
                      <DropdownMenuItem
                        onClick={() => setConfirmDialog({ open: true, type: "reject", reason: "" })}
                        className="text-destructive focus:text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rechazar
                      </DropdownMenuItem>
                    )}
                    {canCancel && (
                      <>
                        {canApprove && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          onClick={() => setConfirmDialog({ open: true, type: "cancel", reason: "" })}
                          className="text-destructive focus:text-destructive"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Cancelar Orden
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Status Stepper */}
            <div className="mt-3 pt-3 border-t">
              <StatusStepper order={order} />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Main Content */}
        {/* ================================================================ */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* ============================================================ */}
              {/* Left Column: Lines Table */}
              {/* ============================================================ */}
              <div className="lg:col-span-8 space-y-6">
                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium uppercase tracking-wide">Fecha</span>
                    </div>
                    <p className="text-sm font-medium">{formatDate(order.order_date)}</p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium uppercase tracking-wide">Cliente</span>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {order.customer?.comercial_name || order.customer?.legal_name || "—"}
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium uppercase tracking-wide">Pago</span>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {order.payment_term?.name || "—"}
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Package className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium uppercase tracking-wide">Lineas</span>
                    </div>
                    <p className="text-sm font-medium">{order.lines?.length || 0}</p>
                  </div>
                </div>

                {/* Lines Table */}
                <Card className="overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Lineas de la Orden</h3>
                        <p className="text-xs text-muted-foreground">
                          {order.lines?.length || 0} productos
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/20 hover:bg-muted/20">
                          <TableHead className="w-12 text-center text-[10px] font-medium uppercase tracking-wider">
                            #
                          </TableHead>
                          <TableHead className="text-[10px] font-medium uppercase tracking-wider">
                            Producto
                          </TableHead>
                          <TableHead className="w-28 text-right text-[10px] font-medium uppercase tracking-wider">
                            Cantidad
                          </TableHead>
                          <TableHead className="w-28 text-right text-[10px] font-medium uppercase tracking-wider">
                            Precio
                          </TableHead>
                          <TableHead className="w-16 text-right text-[10px] font-medium uppercase tracking-wider">
                            Dto.
                          </TableHead>
                          <TableHead className="w-32 text-right text-[10px] font-medium uppercase tracking-wider">
                            Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.lines && order.lines.length > 0 ? (
                          order.lines.map((line) => (
                            <OrderLineRow
                              key={line.line_id}
                              line={line}
                              currency={order.currency}
                            />
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                              No hay lineas en esta orden
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

                {/* Notes */}
                {(order.notes || order.internal_notes) && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Notas</h3>
                      </div>
                      <div className="space-y-3">
                        {order.notes && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Notas publicas</p>
                            <p className="text-sm">{order.notes}</p>
                          </div>
                        )}
                        {order.internal_notes && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Notas internas</p>
                            <p className="text-sm">{order.internal_notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* ============================================================ */}
              {/* Right Column: Summary + Timeline */}
              {/* ============================================================ */}
              <div className="lg:col-span-4 space-y-4">
                {/* Summary Card */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                      Resumen
                    </h3>

                    <div className="space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-mono tabular-nums">
                          {formatCurrency(order.subtotal, order.currency)}
                        </span>
                      </div>

                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Descuento</span>
                          <span className="font-mono tabular-nums text-destructive">
                            -{formatCurrency(order.discount_amount, order.currency)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Impuestos</span>
                        <span className="font-mono tabular-nums">
                          {formatCurrency(order.tax_amount, order.currency)}
                        </span>
                      </div>

                      {order.shipping_amount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Envio</span>
                          <span className="font-mono tabular-nums">
                            {formatCurrency(order.shipping_amount, order.currency)}
                          </span>
                        </div>
                      )}

                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium">Total</span>
                          <span className="text-2xl font-semibold font-mono tabular-nums tracking-tight">
                            {formatCurrency(order.total_amount, order.currency)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground text-right mt-1">
                          {order.currency}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fulfillment Progress */}
                {(order.status === "confirmed" ||
                  order.status === "partial_shipped" ||
                  order.status === "completed") && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Estado de Envio
                        </h3>
                      </div>
                      <FulfillmentProgress order={order} />
                    </CardContent>
                  </Card>
                )}

                {/* Timeline */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Historial
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {order.confirmed_at && (
                        <TimelineEvent
                          title="Orden confirmada"
                          date={order.confirmed_at}
                          color="success"
                        />
                      )}
                      {order.approved_at && (
                        <TimelineEvent
                          title="Orden aprobada"
                          date={order.approved_at}
                          color="success"
                        />
                      )}
                      {order.rejected_at && (
                        <TimelineEvent
                          title="Orden rechazada"
                          date={order.rejected_at}
                          color="destructive"
                        />
                      )}
                      {order.created_at && (
                        <TimelineEvent
                          title="Orden creada"
                          date={order.created_at}
                          color="primary"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Details */}
                {order.customer && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Cliente
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">{order.customer.legal_name}</p>
                        {order.customer.comercial_name && (
                          <p className="text-xs text-muted-foreground">
                            {order.customer.comercial_name}
                          </p>
                        )}
                        {order.customer.tax_id && (
                          <p className="text-xs font-mono text-muted-foreground">
                            NIT: {order.customer.tax_id}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* Confirmation Dialog */}
      {/* ================================================================ */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => !open && setConfirmDialog({ open: false, type: null, reason: "" })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === "reject" ? "Rechazar Orden" : "Cancelar Orden"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === "reject"
                ? "Por favor ingrese el motivo del rechazo. Esta accion no se puede deshacer."
                : "Esta accion cancelara la orden permanentemente."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="reason" className="text-sm font-medium">
              Motivo
            </Label>
            <Textarea
              id="reason"
              placeholder="Ingrese el motivo..."
              value={confirmDialog.reason}
              onChange={(e) => setConfirmDialog((prev) => ({ ...prev, reason: e.target.value }))}
              className="mt-2"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, type: null, reason: "" })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={!confirmDialog.reason.trim()}
              onClick={() => {
                if (confirmDialog.type === "reject") {
                  rejectMutation.mutate(confirmDialog.reason);
                } else {
                  cancelMutation.mutate(confirmDialog.reason);
                }
              }}
            >
              {(rejectMutation.isPending || cancelMutation.isPending) && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
