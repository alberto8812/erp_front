"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  PackageCheck,
  MoreHorizontal,
  Pencil,
  Loader2,
  Calendar,
  Building2,
  Package,
  FileText,
  Clock,
  ChevronRight,
  Warehouse,
  RotateCcw,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  findById,
  approveReturn,
  rejectReturn,
  markAsReceived,
  processReturn,
  cancelReturn,
} from "../application/use-cases/return.actions";
import type { SalesReturn, ReturnLine } from "../domain/entities/return.entity";
import {
  getReturnStatusLabel,
  getReturnStatusColor,
  getReturnReasonLabel,
  type ReturnStatus,
} from "../../shared/types/sales.types";

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

function StatusStepper({ returnDoc }: { returnDoc: SalesReturn }) {
  const steps: { key: ReturnStatus; label: string }[] = [
    { key: "draft", label: "Borrador" },
    { key: "pending_approval", label: "Pendiente" },
    { key: "approved", label: "Aprobada" },
    { key: "received", label: "Recibida" },
    { key: "processed", label: "Procesada" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === returnDoc.status);
  const isCancelled = returnDoc.status === "cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <XCircle className="h-4 w-4" />
        <span className="font-medium">Devolución Cancelada</span>
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

function ReturnLineRow({ line, currency }: { line: ReturnLine; currency: string }) {
  const conditionLabels: Record<string, string> = {
    new: "Nuevo",
    used: "Usado",
    damaged: "Dañado",
    defective: "Defectuoso",
  };

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
        {line.quantity_returned}
      </TableCell>
      <TableCell>
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
          {conditionLabels[line.condition] || line.condition}
        </span>
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-sm">
        {formatCurrency(line.unit_price, currency)}
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
  user,
  color = "default",
}: {
  title: string;
  date: string;
  user?: string;
  color?: "default" | "primary" | "success" | "destructive" | "warning";
}) {
  const colorClasses = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
    success: "bg-success",
    destructive: "bg-destructive",
    warning: "bg-warning",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`h-2 w-2 rounded-full mt-1.5 ${colorClasses[color]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{formatRelativeDate(date)}</p>
        {user && <p className="text-xs text-muted-foreground">Por: {user}</p>}
      </div>
    </div>
  );
}

export default function ReturnDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const returnId = params.id as string;

  const { data: returnDoc, isLoading, error } = useQuery({
    queryKey: ["return", returnId],
    queryFn: () => findById(returnId),
  });

  const approveMutation = useMutation({
    mutationFn: () => approveReturn(returnId),
    onSuccess: () => {
      toast({ title: "Devolución aprobada" });
      queryClient.invalidateQueries({ queryKey: ["return", returnId] });
    },
    onError: () => {
      toast({ title: "Error al aprobar la devolución", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectReturn(returnId),
    onSuccess: () => {
      toast({ title: "Devolución rechazada" });
      queryClient.invalidateQueries({ queryKey: ["return", returnId] });
    },
    onError: () => {
      toast({ title: "Error al rechazar la devolución", variant: "destructive" });
    },
  });

  const receiveMutation = useMutation({
    mutationFn: () => markAsReceived(returnId),
    onSuccess: () => {
      toast({ title: "Devolución marcada como recibida" });
      queryClient.invalidateQueries({ queryKey: ["return", returnId] });
    },
    onError: () => {
      toast({ title: "Error al marcar como recibida", variant: "destructive" });
    },
  });

  const processMutation = useMutation({
    mutationFn: () => processReturn(returnId),
    onSuccess: () => {
      toast({ title: "Devolución procesada" });
      queryClient.invalidateQueries({ queryKey: ["return", returnId] });
    },
    onError: () => {
      toast({ title: "Error al procesar la devolución", variant: "destructive" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelReturn(returnId),
    onSuccess: () => {
      toast({ title: "Devolución cancelada" });
      queryClient.invalidateQueries({ queryKey: ["return", returnId] });
    },
    onError: () => {
      toast({ title: "Error al cancelar la devolución", variant: "destructive" });
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

  if (error || !returnDoc) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar la devolución</p>
          <button
            onClick={() => router.push("/dashboard/sales/returns")}
            className="mt-4 text-primary hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const canEdit = returnDoc.status === "draft";
  const canApprove = returnDoc.status === "pending_approval";
  const canReceive = returnDoc.status === "approved";
  const canProcess = returnDoc.status === "received";
  const canCancel = !["cancelled", "processed"].includes(returnDoc.status);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => router.push("/dashboard/sales/returns")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {returnDoc.return_number}
                  </h1>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReturnStatusColor(
                      returnDoc.status
                    )}`}
                  >
                    {getReturnStatusLabel(returnDoc.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {returnDoc.customer?.legal_name || returnDoc.customer?.comercial_name || "Sin cliente"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {canApprove && (
                <>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectMutation.mutate()}
                    disabled={rejectMutation.isPending}
                  >
                    {rejectMutation.isPending ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <XCircle className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Rechazar
                  </Button>
                </>
              )}

              {canReceive && (
                <Button
                  size="sm"
                  onClick={() => receiveMutation.mutate()}
                  disabled={receiveMutation.isPending}
                >
                  {receiveMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <PackageCheck className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Marcar Recibida
                </Button>
              )}

              {canProcess && (
                <Button
                  size="sm"
                  onClick={() => processMutation.mutate()}
                  disabled={processMutation.isPending}
                >
                  {processMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Procesar
                </Button>
              )}

              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/sales/returns/${returnId}/edit`)}
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
                  {returnDoc.sales_order_id && (
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/sales/sales-orders/${returnDoc.sales_order_id}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Orden de Venta
                    </DropdownMenuItem>
                  )}
                  {canCancel && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => cancelMutation.mutate()}
                        className="text-destructive focus:text-destructive"
                        disabled={cancelMutation.isPending}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Cancelar Devolución
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <StatusStepper returnDoc={returnDoc} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Fecha</span>
                  </div>
                  <p className="text-sm font-medium">{formatDate(returnDoc.return_date)}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Cliente</span>
                  </div>
                  <p className="text-sm font-medium truncate">
                    {returnDoc.customer?.comercial_name || returnDoc.customer?.legal_name || "—"}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Warehouse className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Almacén</span>
                  </div>
                  <p className="text-sm font-medium truncate">
                    {returnDoc.warehouse?.name || "—"}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Lineas</span>
                  </div>
                  <p className="text-sm font-medium">{returnDoc.lines?.length || 0}</p>
                </div>
              </div>

              {/* Reason Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Motivo de Devolución</h3>
                  </div>
                  <p className="text-sm">
                    {getReturnReasonLabel(returnDoc.reason_code)}
                  </p>
                  {returnDoc.refund_method && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Método de reembolso: {
                        returnDoc.refund_method === "credit_note" ? "Nota de Crédito" :
                        returnDoc.refund_method === "refund" ? "Reembolso" : "Cambio"
                      }
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Lines Table */}
              <Card className="overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Productos Devueltos</h3>
                      <p className="text-xs text-muted-foreground">
                        {returnDoc.lines?.length || 0} productos
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
                          Cantidad
                        </TableHead>
                        <TableHead className="w-24 text-[10px] font-medium uppercase tracking-wider">
                          Condición
                        </TableHead>
                        <TableHead className="w-28 text-right text-[10px] font-medium uppercase tracking-wider">
                          Precio
                        </TableHead>
                        <TableHead className="w-32 text-right text-[10px] font-medium uppercase tracking-wider">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {returnDoc.lines && returnDoc.lines.length > 0 ? (
                        returnDoc.lines.map((line) => (
                          <ReturnLineRow
                            key={line.line_id}
                            line={line}
                            currency={returnDoc.currency}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No hay productos en esta devolución
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Notes */}
              {(returnDoc.notes || returnDoc.internal_notes) && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Notas</h3>
                    </div>
                    <div className="space-y-3">
                      {returnDoc.notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Notas para el cliente</p>
                          <p className="text-sm">{returnDoc.notes}</p>
                        </div>
                      )}
                      {returnDoc.internal_notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Notas internas</p>
                          <p className="text-sm">{returnDoc.internal_notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
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
                        {formatCurrency(returnDoc.subtotal, returnDoc.currency)}
                      </span>
                    </div>

                    {returnDoc.discount_amount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Descuento</span>
                        <span className="font-mono tabular-nums text-destructive">
                          -{formatCurrency(returnDoc.discount_amount, returnDoc.currency)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impuestos</span>
                      <span className="font-mono tabular-nums">
                        {formatCurrency(returnDoc.tax_amount, returnDoc.currency)}
                      </span>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium">Total a Reembolsar</span>
                        <span className="text-2xl font-semibold font-mono tabular-nums tracking-tight">
                          {formatCurrency(returnDoc.total_amount, returnDoc.currency)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {returnDoc.currency}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    {returnDoc.processed_at && (
                      <TimelineEvent
                        title="Devolución procesada"
                        date={returnDoc.processed_at}
                        user={returnDoc.processed_by}
                        color="success"
                      />
                    )}
                    {returnDoc.received_at && (
                      <TimelineEvent
                        title="Productos recibidos"
                        date={returnDoc.received_at}
                        user={returnDoc.received_by}
                        color="primary"
                      />
                    )}
                    {returnDoc.approved_at && (
                      <TimelineEvent
                        title="Devolución aprobada"
                        date={returnDoc.approved_at}
                        user={returnDoc.approved_by}
                        color="success"
                      />
                    )}
                    {returnDoc.created_at && (
                      <TimelineEvent
                        title="Devolución creada"
                        date={returnDoc.created_at}
                        color="primary"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Details */}
              {returnDoc.customer && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Cliente
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">{returnDoc.customer.legal_name}</p>
                      {returnDoc.customer.comercial_name && (
                        <p className="text-xs text-muted-foreground">
                          {returnDoc.customer.comercial_name}
                        </p>
                      )}
                      {returnDoc.customer.tax_id && (
                        <p className="text-xs font-mono text-muted-foreground">
                          NIT: {returnDoc.customer.tax_id}
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
  );
}
