"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
  MoreHorizontal,
  Pencil,
  Loader2,
  Calendar,
  Building2,
  Clock,
  ChevronRight,
  Ban,
  ClipboardList,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  markAsReady,
  markAsShipped,
  markAsDelivered,
  cancelShipment,
} from "../application/use-cases/shipment.actions";
import type { Shipment, ShipmentLine, ShipmentStatus } from "../domain/entities/shipment.entity";
import {
  getShipmentStatusLabel,
  getShipmentStatusColor,
} from "../../shared/types/sales.types";
import { DocumentActionsDropdown } from "@/components/documents";

// ============================================================================
// Utility Functions
// ============================================================================

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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

// ============================================================================
// Sub-Components
// ============================================================================

function StatusStepper({ shipment }: { shipment: Shipment }) {
  const steps: { key: ShipmentStatus; label: string }[] = [
    { key: "draft", label: "Borrador" },
    { key: "ready", label: "Listo" },
    { key: "shipped", label: "Enviado" },
    { key: "delivered", label: "Entregado" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === shipment.status);
  const isCancelled = shipment.status === "cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <Ban className="h-4 w-4" />
        <span className="font-medium">Despacho Cancelado</span>
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
              {isCompleted && <CheckCircle2 className="h-3 w-3" />}
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

function ShipmentProgress({ shipment }: { shipment: Shipment }) {
  const totalOrdered = shipment.lines?.reduce((sum, line) => sum + line.quantity_ordered, 0) || 0;
  const totalShipped = shipment.lines?.reduce((sum, line) => sum + line.quantity_shipped, 0) || 0;
  const progress = totalOrdered > 0 ? (totalShipped / totalOrdered) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Unidades</span>
        <span className="font-medium tabular-nums">
          {formatNumber(totalShipped)} enviadas
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

function ShipmentLineRow({ line }: { line: ShipmentLine }) {
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
      <TableCell className="text-right font-mono tabular-nums text-sm">
        {formatNumber(line.quantity_ordered)}
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-sm font-medium">
        {formatNumber(line.quantity_shipped)}
      </TableCell>
      <TableCell className="text-center">
        {line.uom?.code ? (
          <span className="text-xs text-muted-foreground">{line.uom.code}</span>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </TableCell>
      <TableCell>
        {line.lot_number ? (
          <span className="text-xs font-mono">{line.lot_number}</span>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function TimelineEvent({
  title,
  date,
  description,
  color = "default",
}: {
  title: string;
  date: string;
  description?: string;
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
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        <p className="text-xs text-muted-foreground">{formatRelativeDate(date)}</p>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const shipmentId = params.id as string;

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: shipment, isLoading, error } = useQuery({
    queryKey: ["shipment", shipmentId],
    queryFn: () => findById(shipmentId),
  });

  const readyMutation = useMutation({
    mutationFn: () => markAsReady(shipmentId),
    onSuccess: () => {
      toast({ title: "Despacho marcado como listo" });
      queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
    },
    onError: () => {
      toast({ title: "Error al actualizar el despacho", variant: "destructive" });
    },
  });

  const shipMutation = useMutation({
    mutationFn: () => markAsShipped(shipmentId),
    onSuccess: () => {
      toast({ title: "Despacho marcado como enviado" });
      queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
    },
    onError: () => {
      toast({ title: "Error al actualizar el despacho", variant: "destructive" });
    },
  });

  const deliverMutation = useMutation({
    mutationFn: () => markAsDelivered(shipmentId),
    onSuccess: () => {
      toast({ title: "Despacho marcado como entregado" });
      queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
    },
    onError: () => {
      toast({ title: "Error al actualizar el despacho", variant: "destructive" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelShipment(shipmentId),
    onSuccess: () => {
      toast({ title: "Despacho cancelado" });
      queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
      setShowCancelDialog(false);
    },
    onError: () => {
      toast({ title: "Error al cancelar el despacho", variant: "destructive" });
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

  if (error || !shipment) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar el despacho</p>
          <button
            onClick={() => router.push("/dashboard/sales/shipments")}
            className="mt-4 text-primary hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const canEdit = shipment.status === "draft";
  const canMarkReady = shipment.status === "draft";
  const canMarkShipped = shipment.status === "ready";
  const canMarkDelivered = shipment.status === "shipped";
  const canCancel = shipment.status !== "delivered" && shipment.status !== "cancelled";

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
                  onClick={() => router.push("/dashboard/sales/shipments")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-lg font-semibold tracking-tight">
                      {shipment.shipment_number}
                    </h1>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getShipmentStatusColor(
                        shipment.status
                      )}`}
                    >
                      {getShipmentStatusLabel(shipment.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {shipment.customer?.legal_name || shipment.customer?.comercial_name || "Sin cliente"}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {canMarkReady && (
                  <Button
                    size="sm"
                    onClick={() => readyMutation.mutate()}
                    disabled={readyMutation.isPending}
                  >
                    {readyMutation.isPending ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Marcar Listo
                  </Button>
                )}

                {canMarkShipped && (
                  <Button
                    size="sm"
                    onClick={() => shipMutation.mutate()}
                    disabled={shipMutation.isPending}
                  >
                    {shipMutation.isPending ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Truck className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Marcar Enviado
                  </Button>
                )}

                {canMarkDelivered && (
                  <Button
                    size="sm"
                    onClick={() => deliverMutation.mutate()}
                    disabled={deliverMutation.isPending}
                  >
                    {deliverMutation.isPending ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Marcar Entregado
                  </Button>
                )}

                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/sales/shipments/${shipmentId}/edit`)}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Editar
                  </Button>
                )}

                <DocumentActionsDropdown
                  documentType="shipment"
                  documentId={shipmentId}
                  documentNumber={shipment.shipment_number}
                />

                {canCancel && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => setShowCancelDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Cancelar Despacho
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Status Stepper */}
            <div className="mt-3 pt-3 border-t">
              <StatusStepper shipment={shipment} />
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
                    <p className="text-sm font-medium">{formatDate(shipment.shipment_date)}</p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium uppercase tracking-wide">Almacen</span>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {shipment.warehouse?.name || shipment.warehouse?.code || "—"}
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Truck className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium uppercase tracking-wide">Transportadora</span>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {shipment.carrier?.name || "—"}
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Package className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium uppercase tracking-wide">Lineas</span>
                    </div>
                    <p className="text-sm font-medium">{shipment.lines?.length || 0}</p>
                  </div>
                </div>

                {/* Lines Table */}
                <Card className="overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Lineas del Despacho</h3>
                        <p className="text-xs text-muted-foreground">
                          {shipment.lines?.length || 0} productos
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
                          <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">
                            Ordenada
                          </TableHead>
                          <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">
                            Enviada
                          </TableHead>
                          <TableHead className="w-16 text-center text-[10px] font-medium uppercase tracking-wider">
                            UOM
                          </TableHead>
                          <TableHead className="w-28 text-[10px] font-medium uppercase tracking-wider">
                            Lote
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shipment.lines && shipment.lines.length > 0 ? (
                          shipment.lines.map((line) => (
                            <ShipmentLineRow key={line.line_id} line={line} />
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                              No hay lineas en este despacho
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

                {/* Shipping Address */}
                {(shipment.ship_to_address || shipment.ship_to_city) && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Direccion de Entrega</h3>
                      </div>
                      <div className="text-sm space-y-1">
                        {shipment.ship_to_address && <p>{shipment.ship_to_address}</p>}
                        <p className="text-muted-foreground">
                          {[shipment.ship_to_city, shipment.ship_to_state, shipment.ship_to_country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {shipment.ship_to_postal_code && (
                          <p className="text-muted-foreground font-mono text-xs">
                            CP: {shipment.ship_to_postal_code}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notes */}
                {(shipment.notes || shipment.internal_notes) && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium mb-3">Notas</h3>
                      <div className="space-y-3">
                        {shipment.notes && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Notas publicas</p>
                            <p className="text-sm">{shipment.notes}</p>
                          </div>
                        )}
                        {shipment.internal_notes && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Notas internas</p>
                            <p className="text-sm">{shipment.internal_notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* ============================================================ */}
              {/* Right Column: Info Cards */}
              {/* ============================================================ */}
              <div className="lg:col-span-4 space-y-4">
                {/* Shipment Info Card */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                      Informacion del Envio
                    </h3>

                    <div className="space-y-3">
                      <ShipmentProgress shipment={shipment} />

                      <div className="pt-3 border-t space-y-2">
                        {shipment.tracking_number && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tracking</span>
                            <span className="font-mono text-xs">{shipment.tracking_number}</span>
                          </div>
                        )}

                        {shipment.shipping_method && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Metodo</span>
                            <span>{shipment.shipping_method}</span>
                          </div>
                        )}

                        {shipment.expected_delivery_date && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Entrega esperada</span>
                            <span>{formatDate(shipment.expected_delivery_date)}</span>
                          </div>
                        )}

                        {shipment.shipping_cost && shipment.shipping_cost > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Costo de envio</span>
                            <span className="font-mono tabular-nums">
                              ${formatNumber(shipment.shipping_cost)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Reference */}
                {shipment.sales_order && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                        Orden de Venta
                      </h3>
                      <button
                        onClick={() =>
                          router.push(`/dashboard/sales/sales-orders/${shipment.sales_order_id}`)
                        }
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <span className="font-mono">{shipment.sales_order.order_number}</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
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
                      {shipment.delivered_at && (
                        <TimelineEvent
                          title="Entregado"
                          date={shipment.delivered_at}
                          color="success"
                        />
                      )}
                      {shipment.shipped_at && (
                        <TimelineEvent
                          title="Enviado"
                          date={shipment.shipped_at}
                          description={
                            shipment.tracking_number
                              ? `Tracking: ${shipment.tracking_number}`
                              : undefined
                          }
                          color="primary"
                        />
                      )}
                      {shipment.created_at && (
                        <TimelineEvent
                          title="Despacho creado"
                          date={shipment.created_at}
                          color="primary"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Details */}
                {shipment.customer && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Cliente
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">{shipment.customer.legal_name}</p>
                        {shipment.customer.comercial_name && (
                          <p className="text-xs text-muted-foreground">
                            {shipment.customer.comercial_name}
                          </p>
                        )}
                        {shipment.customer.tax_id && (
                          <p className="text-xs font-mono text-muted-foreground">
                            NIT: {shipment.customer.tax_id}
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
      {/* Cancel Dialog */}
      {/* ================================================================ */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Despacho</DialogTitle>
            <DialogDescription>
              Esta accion cancelara el despacho. El inventario sera devuelto al almacen.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              No, mantener
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              Si, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
