"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  FileCheck,
  Ban,
  AlertCircle,
  Building2,
  Calendar,
  Package,
  DollarSign,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Show } from "@/components/show/Show.component";
import { StatusStepper } from "@/components/workflow/StatusStepper";
import {
  getWithLines,
  submitForApproval,
  approve,
  reject,
  post,
  cancel,
  removeLine,
} from "../application/use-cases/adjustment.actions";
import type { Adjustment, AdjustmentLine, AdjustmentStatus } from "../domain/entities/adjustment.entity";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

interface PageParams {
  id: string;
}

const STATUS_STEPS = [
  { key: "draft", label: "Borrador" },
  { key: "pending_approval", label: "Pendiente" },
  { key: "approved", label: "Aprobado" },
  { key: "posted", label: "Contabilizado" },
];

const STATUS_LABELS: Record<AdjustmentStatus, string> = {
  draft: "Borrador",
  pending_approval: "Pendiente Aprobación",
  approved: "Aprobado",
  posted: "Contabilizado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<AdjustmentStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  pending_approval: "bg-warning/15 text-warning",
  approved: "bg-primary/15 text-primary",
  posted: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};

export default function AdjustmentDetailPage({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const { data: adjustment, isLoading } = useQuery({
    queryKey: ["adjustment", id],
    queryFn: () => getWithLines(id),
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["adjustment", id] });
    queryClient.invalidateQueries({ queryKey: ["adjustments"] });
  };

  const submitMutation = useMutation({
    mutationFn: () => submitForApproval(id),
    onSuccess: invalidateQueries,
  });

  const approveMutation = useMutation({
    mutationFn: () => approve(id),
    onSuccess: invalidateQueries,
  });

  const rejectMutation = useMutation({
    mutationFn: () => reject(id, rejectReason),
    onSuccess: () => {
      setRejectDialogOpen(false);
      setRejectReason("");
      invalidateQueries();
    },
  });

  const postMutation = useMutation({
    mutationFn: () => post(id),
    onSuccess: invalidateQueries,
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancel(id, cancelReason),
    onSuccess: () => {
      setCancelDialogOpen(false);
      setCancelReason("");
      invalidateQueries();
    },
  });

  const removeLineMutation = useMutation({
    mutationFn: (lineId: string) => removeLine(lineId),
    onSuccess: invalidateQueries,
  });

  const getCurrentStepIndex = (status: AdjustmentStatus) => {
    if (status === "cancelled") return -1;
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!adjustment) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Ajuste no encontrado</p>
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    );
  }

  const lines = adjustment.lines || [];
  const canEdit = adjustment.status === "draft";
  const canSubmit = adjustment.status === "draft" && lines.length > 0;
  const canApprove = adjustment.status === "pending_approval";
  const canPost = adjustment.status === "approved";
  const canCancel = ["draft", "pending_approval", "approved"].includes(adjustment.status);

  const totalPositive = lines
    .filter((l) => l.quantity_difference > 0)
    .reduce((sum, l) => sum + l.quantity_difference, 0);
  const totalNegative = lines
    .filter((l) => l.quantity_difference < 0)
    .reduce((sum, l) => sum + Math.abs(l.quantity_difference), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{adjustment.adjustment_number}</h1>
              <Badge className={STATUS_COLORS[adjustment.status]}>
                {STATUS_LABELS[adjustment.status]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(adjustment.adjustment_date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canSubmit && (
            <Button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar a Aprobación
            </Button>
          )}
          {canApprove && (
            <>
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(true)}
                disabled={rejectMutation.isPending}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Rechazar
              </Button>
              <Button
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprobar
              </Button>
            </>
          )}
          {canPost && (
            <Button onClick={() => postMutation.mutate()} disabled={postMutation.isPending}>
              <FileCheck className="mr-2 h-4 w-4" />
              Contabilizar
            </Button>
          )}
          {canCancel && (
            <Button
              variant="destructive"
              onClick={() => setCancelDialogOpen(true)}
              disabled={cancelMutation.isPending}
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {/* Status Stepper */}
      {adjustment.status !== "cancelled" && (
        <StatusStepper steps={STATUS_STEPS} currentStep={getCurrentStepIndex(adjustment.status)} />
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Líneas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lines.length}</div>
            <p className="text-xs text-muted-foreground">productos a ajustar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{totalPositive.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">unidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salidas</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{totalNegative.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">unidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impacto Valor</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                adjustment.total_cost_adjustment >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {adjustment.total_cost_adjustment >= 0 ? "+" : ""}
              {formatCurrency(adjustment.total_cost_adjustment)}
            </div>
            <p className="text-xs text-muted-foreground">total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-xs text-muted-foreground">Almacén</label>
                <p className="text-sm font-medium">{adjustment.warehouse_name || adjustment.warehouse_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-xs text-muted-foreground">Fecha</label>
                <p className="text-sm">{formatDate(adjustment.adjustment_date)}</p>
              </div>
            </div>
            {adjustment.reason_code && (
              <div>
                <label className="text-xs text-muted-foreground">Razón</label>
                <p className="text-sm font-medium">{adjustment.reason_code}</p>
                {adjustment.reason_description && (
                  <p className="text-sm text-muted-foreground">{adjustment.reason_description}</p>
                )}
              </div>
            )}
            {adjustment.description && (
              <div>
                <label className="text-xs text-muted-foreground">Descripción</label>
                <p className="text-sm whitespace-pre-wrap">{adjustment.description}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creado por</span>
                <span>{adjustment.created_by}</span>
              </div>
              {adjustment.submitted_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enviado</span>
                  <span>{formatDateTime(adjustment.submitted_at)}</span>
                </div>
              )}
              {adjustment.approved_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aprobado</span>
                  <span>{formatDateTime(adjustment.approved_at)}</span>
                </div>
              )}
              {adjustment.posted_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contabilizado</span>
                  <span>{formatDateTime(adjustment.posted_at)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lines Table */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Líneas de Ajuste</CardTitle>
              <CardDescription>Productos y cantidades a ajustar</CardDescription>
            </div>
            {canEdit && (
              <Button size="sm" variant="outline">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Agregar Línea
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Show
              when={lines.length > 0}
              fallback={
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No hay líneas de ajuste</p>
                  <p className="text-sm text-muted-foreground">
                    Agregue productos para realizar el ajuste
                  </p>
                </div>
              }
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Ajustado</TableHead>
                    <TableHead className="text-right">Diferencia</TableHead>
                    <TableHead className="text-right">Costo</TableHead>
                    <TableHead>Razón</TableHead>
                    {canEdit && <TableHead className="w-16" />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line) => (
                    <TableRow key={line.adjustment_line_id}>
                      <TableCell>
                        <div
                          className="cursor-pointer hover:underline"
                          onClick={() =>
                            router.push(`/dashboard/inventory/products/${line.product_id}`)
                          }
                        >
                          <p className="font-medium">{line.product_name || line.product_sku}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {line.product_sku}
                          </p>
                        </div>
                        {line.lot_number && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Lote: {line.lot_number}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {line.current_quantity.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {line.adjusted_quantity.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-mono font-medium ${
                            line.quantity_difference > 0
                              ? "text-green-600"
                              : line.quantity_difference < 0
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {line.quantity_difference > 0 ? "+" : ""}
                          {line.quantity_difference.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(line.current_unit_cost)}
                      </TableCell>
                      <TableCell>
                        {line.reason_code ? (
                          <Badge variant="outline">{line.reason_code}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      {canEdit && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => removeLineMutation.mutate(line.adjustment_line_id)}
                              disabled={removeLineMutation.isPending}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Show>
          </CardContent>
        </Card>
      </div>

      {/* Cancellation Info */}
      {adjustment.status === "cancelled" && adjustment.cancelled_at && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Ban className="h-4 w-4" />
              Ajuste Cancelado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Fecha</label>
                <p className="text-sm">{formatDateTime(adjustment.cancelled_at)}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cancelado por</label>
                <p className="text-sm">{adjustment.cancelled_by}</p>
              </div>
              {adjustment.cancellation_reason && (
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground">Razón</label>
                  <p className="text-sm">{adjustment.cancellation_reason}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Ajuste</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El ajuste quedará marcado como cancelado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Ingrese la razón de cancelación..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelMutation.mutate()}
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancelar Ajuste
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar Ajuste</AlertDialogTitle>
            <AlertDialogDescription>
              El ajuste será devuelto a borrador para correcciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Ingrese la razón del rechazo..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => rejectMutation.mutate()}
              disabled={!rejectReason.trim() || rejectMutation.isPending}
            >
              Rechazar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
