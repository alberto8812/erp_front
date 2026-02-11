"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wrench,
  Calendar,
  User,
  Clock,
  DollarSign,
  AlertTriangle,
  Shield,
  ClipboardCheck,
  Users,
  Package,
  CheckCircle2,
  Play,
  Pause,
  XCircle,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { findById } from "../application/use-cases/work-order.actions";
import {
  getWorkOrderTypeLabel,
  getWorkOrderTypeColor,
  getWorkOrderStatusLabel,
  getWorkOrderStatusColor,
  getPriorityLabel,
  getPriorityColor,
} from "../domain/entities/work-order.entity";
import type { MaintenanceWorkOrder, WorkOrderStatus } from "../domain/entities/work-order.entity";

const statusSteps: { status: WorkOrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "draft", label: "Borrador", icon: ClipboardCheck },
  { status: "pending_approval", label: "Aprobación", icon: FileCheck },
  { status: "approved", label: "Aprobada", icon: CheckCircle2 },
  { status: "scheduled", label: "Programada", icon: Calendar },
  { status: "in_progress", label: "En Progreso", icon: Play },
  { status: "completed", label: "Completada", icon: CheckCircle2 },
  { status: "closed", label: "Cerrada", icon: FileCheck },
];

function getStatusStepIndex(status: WorkOrderStatus): number {
  if (status === "on_hold") return 4; // Same as in_progress
  if (status === "pending_review") return 5; // Same as completed
  if (status === "cancelled") return -1; // Special case
  return statusSteps.findIndex((s) => s.status === status);
}

function WorkOrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}

function StatusStepper({ currentStatus }: { currentStatus: WorkOrderStatus }) {
  const currentIndex = getStatusStepIndex(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="h-6 w-6" />
          <span className="font-medium">Orden Cancelada</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4 overflow-x-auto">
      {statusSteps.map((step, index) => {
        const StepIcon = step.icon;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.status} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "border-success bg-success text-success-foreground"
                    : isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent ? "text-primary" : isPending ? "text-muted-foreground" : ""
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < statusSteps.length - 1 && (
              <ChevronRight
                className={`mx-2 h-5 w-5 flex-shrink-0 ${
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

export default function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: workOrder, isLoading } = useQuery({
    queryKey: ["work-order", id],
    queryFn: () => findById(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <WorkOrderDetailSkeleton />
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Orden de trabajo no encontrada</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  const completedTasks = workOrder.tasks?.filter((t) => t.is_completed).length || 0;
  const totalTasks = workOrder.tasks?.length || 0;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono">{workOrder.wo_number}</h1>
              <Badge
                variant="outline"
                className={getWorkOrderStatusColor(workOrder.status)}
              >
                {getWorkOrderStatusLabel(workOrder.status)}
              </Badge>
              <Badge
                variant="outline"
                className={getPriorityColor(workOrder.priority)}
              >
                {getPriorityLabel(workOrder.priority)}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mt-1">{workOrder.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {workOrder.status === "draft" && (
            <Button variant="outline">
              <FileCheck className="mr-2 h-4 w-4" />
              Solicitar Aprobación
            </Button>
          )}
          {workOrder.status === "approved" && (
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Iniciar Trabajo
            </Button>
          )}
          {workOrder.status === "in_progress" && (
            <>
              <Button variant="outline">
                <Pause className="mr-2 h-4 w-4" />
                Pausar
              </Button>
              <Button>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Completar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Stepper */}
      <Card>
        <CardContent className="pt-4">
          <StatusStepper currentStatus={workOrder.status} />
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset & Type Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Información del Trabajo
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Tipo de OT</span>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={getWorkOrderTypeColor(workOrder.wo_type)}
                  >
                    {getWorkOrderTypeLabel(workOrder.wo_type)}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Activo</span>
                <p className="font-medium mt-1">
                  {workOrder.asset?.asset_name || "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {workOrder.asset?.asset_code}
                </p>
              </div>
              {workOrder.description && (
                <div className="sm:col-span-2">
                  <span className="text-sm text-muted-foreground">Descripción</span>
                  <p className="mt-1">{workOrder.description}</p>
                </div>
              )}
              {workOrder.failure_description && (
                <div className="sm:col-span-2">
                  <span className="text-sm text-muted-foreground">
                    Descripción de Falla
                  </span>
                  <p className="mt-1 text-destructive">
                    {workOrder.failure_description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Tareas
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {completedTasks} de {totalTasks} completadas
                </span>
              </div>
              <Progress value={taskProgress} className="h-2" />
            </CardHeader>
            <CardContent>
              {workOrder.tasks && workOrder.tasks.length > 0 ? (
                <div className="space-y-3">
                  {workOrder.tasks.map((task, index) => (
                    <div
                      key={task.wo_task_id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        task.is_completed ? "bg-success/5 border-success/20" : ""
                      }`}
                    >
                      <Checkbox
                        checked={task.is_completed}
                        disabled
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono">
                            #{task.sequence || index + 1}
                          </span>
                          <span
                            className={`font-medium ${
                              task.is_completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {task.task_name}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        {task.estimated_minutes && (
                          <span className="text-xs text-muted-foreground">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {task.estimated_minutes} min estimados
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No hay tareas definidas para esta orden
                </p>
              )}
            </CardContent>
          </Card>

          {/* Labor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mano de Obra
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workOrder.labor && workOrder.labor.length > 0 ? (
                <div className="space-y-3">
                  {workOrder.labor.map((labor) => (
                    <div
                      key={labor.wo_labor_id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{labor.technician_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {labor.activity_description || labor.skill_type || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono tabular-nums">
                          {labor.hours_worked.toFixed(1)}h
                          {labor.is_overtime && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Extra
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          ${labor.total_cost.toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No hay registros de mano de obra
                </p>
              )}
            </CardContent>
          </Card>

          {/* Parts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Repuestos y Materiales
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workOrder.parts && workOrder.parts.length > 0 ? (
                <div className="space-y-3">
                  {workOrder.parts.map((part) => (
                    <div
                      key={part.wo_part_id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{part.product_name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {part.product_sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono tabular-nums">
                          {part.quantity_used} / {part.quantity_required} {part.uom_code}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          ${part.total_cost.toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No hay repuestos asignados
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Programación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Solicitado
                </span>
                <p className="font-medium">
                  {new Date(workOrder.requested_date).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  por {workOrder.requested_by}
                </p>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Programado
                </span>
                {workOrder.scheduled_start_date ? (
                  <>
                    <p className="font-medium">
                      {new Date(workOrder.scheduled_start_date).toLocaleDateString(
                        "es-CO",
                        { day: "2-digit", month: "long", year: "numeric" }
                      )}
                      {workOrder.scheduled_start_time && ` ${workOrder.scheduled_start_time}`}
                    </p>
                    {workOrder.scheduled_end_date && (
                      <p className="text-sm text-muted-foreground">
                        hasta{" "}
                        {new Date(workOrder.scheduled_end_date).toLocaleDateString(
                          "es-CO",
                          { day: "2-digit", month: "short" }
                        )}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">Sin programar</p>
                )}
              </div>
              {workOrder.actual_start_date && (
                <>
                  <Separator />
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Ejecución Real
                    </span>
                    <p className="font-medium">
                      Inicio:{" "}
                      {new Date(workOrder.actual_start_date).toLocaleDateString(
                        "es-CO",
                        { day: "2-digit", month: "short" }
                      )}
                    </p>
                    {workOrder.actual_end_date && (
                      <p className="text-sm">
                        Fin:{" "}
                        {new Date(workOrder.actual_end_date).toLocaleDateString(
                          "es-CO",
                          { day: "2-digit", month: "short" }
                        )}
                      </p>
                    )}
                    {workOrder.actual_duration_hours && (
                      <p className="text-sm text-muted-foreground font-mono">
                        {workOrder.actual_duration_hours.toFixed(1)} horas
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Asignación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Técnico Asignado
                </span>
                {workOrder.assigned_user ? (
                  <p className="font-medium">{workOrder.assigned_user.name}</p>
                ) : (
                  <p className="text-muted-foreground">Sin asignar</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                Costos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mano de Obra</span>
                  <span className="font-mono tabular-nums">
                    ${(workOrder.actual_labor_cost || workOrder.estimated_labor_cost || 0).toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Repuestos</span>
                  <span className="font-mono tabular-nums">
                    ${(workOrder.actual_parts_cost || workOrder.estimated_parts_cost || 0).toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Externo</span>
                  <span className="font-mono tabular-nums">
                    ${(workOrder.actual_external_cost || workOrder.estimated_external_cost || 0).toLocaleString("es-CO")}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="font-mono tabular-nums text-lg">
                    ${(workOrder.actual_total_cost || workOrder.estimated_total_cost || 0).toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety */}
          {(workOrder.requires_shutdown ||
            workOrder.safety_permit_required ||
            workOrder.lockout_tagout_required) && (
            <Card className="border-warning/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-warning">
                  <Shield className="h-4 w-4" />
                  Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {workOrder.requires_shutdown && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm">Requiere parada de equipo</span>
                  </div>
                )}
                {workOrder.safety_permit_required && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-warning" />
                    <span className="text-sm">
                      Permiso de seguridad
                      {workOrder.safety_permit_number && (
                        <span className="text-muted-foreground ml-1">
                          #{workOrder.safety_permit_number}
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {workOrder.lockout_tagout_required && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">
                      Requiere LOTO
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Completion Notes */}
          {workOrder.completion_notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notas de Cierre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{workOrder.completion_notes}</p>
                {workOrder.root_cause && (
                  <div className="mt-3">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Causa Raíz
                    </span>
                    <p className="text-sm mt-1">{workOrder.root_cause}</p>
                  </div>
                )}
                {workOrder.corrective_action && (
                  <div className="mt-3">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Acción Correctiva
                    </span>
                    <p className="text-sm mt-1">{workOrder.corrective_action}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
