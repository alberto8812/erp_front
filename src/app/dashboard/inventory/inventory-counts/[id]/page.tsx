"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Play,
  MoreHorizontal,
  Loader2,
  Calendar,
  Warehouse,
  Package,
  Clock,
  ChevronRight,
  ClipboardCheck,
  AlertTriangle,
  User,
  FileCheck,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  findById,
  getLines,
  startCount,
  completeCount,
  approveCount,
  cancelCount,
  updateLine,
} from "../application/use-cases/inventory-count.actions";
import type { InventoryCount, InventoryCountLine } from "../domain/entities/inventory-count.entity";
import {
  getCountStatusLabel,
  getCountStatusColor,
  type CountStatus,
} from "../../shared/types/inventory.types";

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

function StatusStepper({ count }: { count: InventoryCount }) {
  const steps: { key: CountStatus; label: string }[] = [
    { key: "planned", label: "Planificado" },
    { key: "in_progress", label: "En Conteo" },
    { key: "pending_review", label: "Revisión" },
    { key: "approved", label: "Aprobado" },
    { key: "posted", label: "Contabilizado" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === count.status);
  const isCancelled = count.status === "cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <Ban className="h-4 w-4" />
        <span className="font-medium">Conteo Cancelado</span>
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

function CountLineRow({
  line,
  canEdit,
  onUpdateQuantity,
  isUpdating,
}: {
  line: InventoryCountLine;
  canEdit: boolean;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  isUpdating: boolean;
}) {
  const [editValue, setEditValue] = useState<string>(
    line.counted_quantity?.toString() ?? ""
  );
  const [isEditing, setIsEditing] = useState(false);

  const variance = line.counted_quantity !== undefined
    ? line.counted_quantity - line.system_quantity
    : null;

  const handleBlur = () => {
    if (editValue !== (line.counted_quantity?.toString() ?? "")) {
      const qty = parseFloat(editValue);
      if (!isNaN(qty) && qty >= 0) {
        onUpdateQuantity(line.count_line_id, qty);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setEditValue(line.counted_quantity?.toString() ?? "");
      setIsEditing(false);
    }
  };

  return (
    <TableRow className={`group ${variance !== null && variance !== 0 ? "bg-warning/5" : ""}`}>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {line.product?.name || "Producto"}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            {line.product?.sku || line.product_id.slice(0, 8)}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {line.location?.code || "—"}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {line.lot?.lot_number || "—"}
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-sm">
        {line.system_quantity}
      </TableCell>
      <TableCell className="text-right">
        {canEdit ? (
          isEditing ? (
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-20 h-8 text-right font-mono ml-auto"
              autoFocus
              disabled={isUpdating}
              min={0}
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-20 h-8 text-right font-mono tabular-nums text-sm px-2 py-1 rounded border border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-colors ml-auto block"
            >
              {line.counted_quantity ?? "—"}
            </button>
          )
        ) : (
          <span className="font-mono tabular-nums text-sm">
            {line.counted_quantity ?? "—"}
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {variance !== null ? (
          <span
            className={`font-mono tabular-nums text-sm font-medium ${
              variance > 0
                ? "text-success"
                : variance < 0
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {variance > 0 ? "+" : ""}
            {variance}
          </span>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </TableCell>
      <TableCell>
        {line.is_counted ? (
          <CheckCircle className="h-4 w-4 text-success" />
        ) : variance !== null && variance !== 0 ? (
          <AlertTriangle className="h-4 w-4 text-warning" />
        ) : (
          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
        )}
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
      </div>
    </div>
  );
}

export default function InventoryCountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const countId = params.id as string;

  const { data: count, isLoading, error } = useQuery({
    queryKey: ["inventory-count", countId],
    queryFn: () => findById(countId),
  });

  const { data: lines = [], isLoading: linesLoading } = useQuery({
    queryKey: ["inventory-count-lines", countId],
    queryFn: () => getLines(countId),
    enabled: !!count,
  });

  const startMutation = useMutation({
    mutationFn: () => startCount(countId),
    onSuccess: () => {
      toast({ title: "Conteo iniciado" });
      queryClient.invalidateQueries({ queryKey: ["inventory-count", countId] });
    },
    onError: () => {
      toast({ title: "Error al iniciar el conteo", variant: "destructive" });
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => completeCount(countId),
    onSuccess: () => {
      toast({ title: "Conteo completado, pendiente de revisión" });
      queryClient.invalidateQueries({ queryKey: ["inventory-count", countId] });
    },
    onError: () => {
      toast({ title: "Error al completar el conteo", variant: "destructive" });
    },
  });

  const approveMutation = useMutation({
    mutationFn: () => approveCount(countId),
    onSuccess: () => {
      toast({ title: "Conteo aprobado y ajustes generados" });
      queryClient.invalidateQueries({ queryKey: ["inventory-count", countId] });
    },
    onError: () => {
      toast({ title: "Error al aprobar el conteo", variant: "destructive" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelCount(countId),
    onSuccess: () => {
      toast({ title: "Conteo cancelado" });
      queryClient.invalidateQueries({ queryKey: ["inventory-count", countId] });
    },
    onError: () => {
      toast({ title: "Error al cancelar el conteo", variant: "destructive" });
    },
  });

  const updateLineMutation = useMutation({
    mutationFn: ({ lineId, quantity }: { lineId: string; quantity: number }) =>
      updateLine(lineId, { counted_quantity: quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-count-lines", countId] });
      queryClient.invalidateQueries({ queryKey: ["inventory-count", countId] });
    },
    onError: () => {
      toast({ title: "Error al actualizar cantidad", variant: "destructive" });
    },
  });

  const handleUpdateQuantity = (lineId: string, quantity: number) => {
    updateLineMutation.mutate({ lineId, quantity });
  };

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

  if (error || !count) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar el conteo</p>
          <button
            onClick={() => router.push("/dashboard/inventory/inventory-counts")}
            className="mt-4 text-primary hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const canStart = count.status === "planned";
  const canCount = count.status === "in_progress";
  const canComplete = count.status === "in_progress";
  const canApprove = count.status === "pending_review";
  const canCancel = ["planned", "in_progress"].includes(count.status);

  const countedItems = lines.filter((l) => l.is_counted).length;
  const varianceItems = lines.filter(
    (l) => l.counted_quantity !== undefined && l.counted_quantity !== l.system_quantity
  ).length;

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
                onClick={() => router.push("/dashboard/inventory/inventory-counts")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {count.count_number}
                  </h1>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCountStatusColor(
                      count.status
                    )}`}
                  >
                    {getCountStatusLabel(count.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  Conteo de inventario • {count.count_type || "General"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {canStart && (
                <Button
                  size="sm"
                  onClick={() => startMutation.mutate()}
                  disabled={startMutation.isPending}
                >
                  {startMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Iniciar Conteo
                </Button>
              )}

              {canComplete && (
                <Button
                  size="sm"
                  onClick={() => completeMutation.mutate()}
                  disabled={completeMutation.isPending}
                >
                  {completeMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Completar
                </Button>
              )}

              {canApprove && (
                <Button
                  size="sm"
                  onClick={() => approveMutation.mutate()}
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FileCheck className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Aprobar
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {canCancel && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancelar Conteo
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar Conteo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción cancelará el conteo {count.count_number}.
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Volver</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => cancelMutation.mutate()}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Cancelar Conteo
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <StatusStepper count={count} />
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
                  <p className="text-sm font-medium">{formatDate(count.count_date)}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Warehouse className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Almacén</span>
                  </div>
                  <p className="text-sm font-medium truncate">
                    {count.warehouse_id.slice(0, 8)}...
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Contados</span>
                  </div>
                  <p className="text-sm font-medium">
                    {countedItems} / {lines.length}
                  </p>
                </div>

                <div className={`rounded-lg p-3 ${varianceItems > 0 ? "bg-warning/10" : "bg-muted/30"}`}>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Varianzas</span>
                  </div>
                  <p className={`text-sm font-medium ${varianceItems > 0 ? "text-warning" : ""}`}>
                    {varianceItems} items
                  </p>
                </div>
              </div>

              {/* Lines Table */}
              <Card className="overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Líneas de Conteo</h3>
                      <p className="text-xs text-muted-foreground">
                        {lines.length} productos • {countedItems} contados
                      </p>
                    </div>
                    {canCount && (
                      <p className="text-xs text-muted-foreground">
                        Click en cantidad para editar
                      </p>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableHead className="text-[10px] font-medium uppercase tracking-wider">
                          Producto
                        </TableHead>
                        <TableHead className="w-24 text-[10px] font-medium uppercase tracking-wider">
                          Ubicación
                        </TableHead>
                        <TableHead className="w-24 text-[10px] font-medium uppercase tracking-wider">
                          Lote
                        </TableHead>
                        <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">
                          Sistema
                        </TableHead>
                        <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">
                          Contado
                        </TableHead>
                        <TableHead className="w-20 text-right text-[10px] font-medium uppercase tracking-wider">
                          Varianza
                        </TableHead>
                        <TableHead className="w-12 text-center text-[10px] font-medium uppercase tracking-wider">

                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {linesLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : lines.length > 0 ? (
                        lines.map((line) => (
                          <CountLineRow
                            key={line.count_line_id}
                            line={line}
                            canEdit={canCount}
                            onUpdateQuantity={handleUpdateQuantity}
                            isUpdating={updateLineMutation.isPending}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            No hay líneas en este conteo
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Notes */}
              {count.notes && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-2">Notas</h3>
                    <p className="text-sm text-muted-foreground">{count.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-4">
              {/* Progress Card */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                    Progreso
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Items Contados</span>
                        <span className="font-medium">{countedItems} / {lines.length}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${lines.length > 0 ? (countedItems / lines.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {varianceItems > 0 && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center gap-2 text-warning">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {varianceItems} items con varianza
                          </span>
                        </div>
                      </div>
                    )}
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
                    {count.posted_at && (
                      <TimelineEvent
                        title="Contabilizado"
                        date={count.posted_at}
                        color="success"
                      />
                    )}
                    {count.approved_at && (
                      <TimelineEvent
                        title="Aprobado"
                        date={count.approved_at}
                        color="success"
                      />
                    )}
                    {count.completed_at && (
                      <TimelineEvent
                        title="Conteo completado"
                        date={count.completed_at}
                        color="primary"
                      />
                    )}
                    {count.started_at && (
                      <TimelineEvent
                        title="Conteo iniciado"
                        date={count.started_at}
                        color="primary"
                      />
                    )}
                    {count.created_at && (
                      <TimelineEvent
                        title="Conteo planificado"
                        date={count.created_at}
                        color="primary"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Assigned User */}
              {count.assigned_to && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Asignado a
                      </h3>
                    </div>
                    <p className="text-sm font-medium">{count.assigned_to}</p>
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
