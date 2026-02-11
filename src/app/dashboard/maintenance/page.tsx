"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Wrench,
  Cog,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer,
  Gauge,
  CalendarClock,
  Activity,
  ArrowRight,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { findAllPaginated as findAssets } from "./assets/application/use-cases/asset.actions";
import { findAllPaginated as findWorkOrders } from "./work-orders/application/use-cases/work-order.actions";
import {
  getWorkOrderStatusLabel,
  getWorkOrderStatusColor,
  getPriorityLabel,
  getPriorityColor,
  getWorkOrderTypeLabel,
} from "./work-orders/domain/entities/work-order.entity";
import {
  getAssetStatusLabel,
  getAssetStatusColor,
} from "./assets/domain/entities/asset.entity";

function KPICard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  description,
  variant = "default",
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}) {
  const variantStyles = {
    default: "border-border",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    destructive: "border-destructive/30 bg-destructive/5",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };

  return (
    <Card className={variantStyles[variant]}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-bold tabular-nums">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                {trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : trend === "down" ? (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                ) : null}
                <span
                  className={`text-xs font-medium ${
                    trend === "up"
                      ? "text-success"
                      : trend === "down"
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-muted ${iconStyles[variant]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function MaintenanceDashboardPage() {
  const { data: assetsData, isLoading: loadingAssets } = useQuery({
    queryKey: ["maintenance-assets-dashboard"],
    queryFn: () => findAssets({ limit: 100 }),
  });

  const { data: workOrdersData, isLoading: loadingWorkOrders } = useQuery({
    queryKey: ["maintenance-work-orders-dashboard"],
    queryFn: () => findWorkOrders({ limit: 100 }),
  });

  const isLoading = loadingAssets || loadingWorkOrders;
  const assets = assetsData?.data || [];
  const workOrders = workOrdersData?.data || [];

  // Calculate KPIs
  const totalAssets = assets.length;
  const operationalAssets = assets.filter((a) => a.status === "operational").length;
  const underMaintenanceAssets = assets.filter((a) => a.status === "under_maintenance").length;
  const availability = totalAssets > 0 ? ((operationalAssets / totalAssets) * 100).toFixed(1) : "0";

  const totalWorkOrders = workOrders.length;
  const openWorkOrders = workOrders.filter((wo) =>
    ["draft", "pending_approval", "approved", "scheduled"].includes(wo.status)
  ).length;
  const inProgressWorkOrders = workOrders.filter((wo) => wo.status === "in_progress").length;
  const completedWorkOrders = workOrders.filter((wo) =>
    ["completed", "closed"].includes(wo.status)
  ).length;
  const onHoldWorkOrders = workOrders.filter((wo) => wo.status === "on_hold").length;

  // Overdue work orders
  const overdueWorkOrders = workOrders.filter((wo) => {
    if (!wo.scheduled_end_date) return false;
    if (["completed", "closed", "cancelled"].includes(wo.status)) return false;
    return new Date(wo.scheduled_end_date) < new Date();
  });

  // Priority distribution
  const emergencyCount = workOrders.filter((wo) =>
    ["emergency", "urgent"].includes(wo.priority) &&
    !["completed", "closed", "cancelled"].includes(wo.status)
  ).length;

  // Preventive vs Corrective ratio
  const preventiveCount = workOrders.filter((wo) => wo.wo_type === "preventive").length;
  const correctiveCount = workOrders.filter((wo) => wo.wo_type === "corrective").length;
  const preventiveRatio =
    preventiveCount + correctiveCount > 0
      ? ((preventiveCount / (preventiveCount + correctiveCount)) * 100).toFixed(0)
      : "0";

  // Simulate MTBF/MTTR (in a real app, this would come from backend calculations)
  const mtbf = "168"; // Mean Time Between Failures (hours)
  const mttr = "4.2"; // Mean Time To Repair (hours)

  // Recent work orders
  const recentWorkOrders = [...workOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Assets needing maintenance
  const assetsNeedingMaintenance = assets
    .filter((a) => {
      if (!a.next_maintenance_date) return false;
      const nextDate = new Date(a.next_maintenance_date);
      const now = new Date();
      const daysUntil = (nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntil <= 7;
    })
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Disponibilidad de Equipos"
          value={availability}
          unit="%"
          icon={Activity}
          variant={Number(availability) >= 90 ? "success" : Number(availability) >= 75 ? "warning" : "destructive"}
          trend="up"
          trendValue="+2.3% vs mes anterior"
        />
        <KPICard
          title="MTBF"
          value={mtbf}
          unit="horas"
          icon={Timer}
          description="Tiempo medio entre fallas"
          trend="up"
          trendValue="+12h"
        />
        <KPICard
          title="MTTR"
          value={mttr}
          unit="horas"
          icon={Clock}
          description="Tiempo medio de reparación"
          trend="down"
          trendValue="-0.8h"
        />
        <KPICard
          title="Ratio Preventivo"
          value={preventiveRatio}
          unit="%"
          icon={CalendarClock}
          description={`${preventiveCount} preventivos / ${correctiveCount} correctivos`}
          variant={Number(preventiveRatio) >= 70 ? "success" : Number(preventiveRatio) >= 50 ? "warning" : "destructive"}
        />
      </div>

      {/* Work Order Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Órdenes de Trabajo
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/maintenance/work-orders">
                  Ver todas
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <StatCard
                label="Abiertas"
                value={openWorkOrders}
                icon={ClipboardList}
                color="bg-muted text-muted-foreground"
              />
              <StatCard
                label="En Progreso"
                value={inProgressWorkOrders}
                icon={PlayCircle}
                color="bg-chart-4/10 text-chart-4"
              />
              <StatCard
                label="En Espera"
                value={onHoldWorkOrders}
                icon={PauseCircle}
                color="bg-warning/10 text-warning"
              />
              <StatCard
                label="Completadas"
                value={completedWorkOrders}
                icon={CheckCircle2}
                color="bg-success/10 text-success"
              />
              <StatCard
                label="Vencidas"
                value={overdueWorkOrders.length}
                icon={AlertTriangle}
                color="bg-destructive/10 text-destructive"
              />
            </div>

            {emergencyCount > 0 && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 mb-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    {emergencyCount} órdenes urgentes/emergencia pendientes
                  </span>
                </div>
              </div>
            )}

            {/* Recent Work Orders */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Órdenes Recientes
              </h4>
              {recentWorkOrders.length > 0 ? (
                recentWorkOrders.map((wo) => (
                  <Link
                    key={wo.work_order_id}
                    href={`/dashboard/maintenance/work-orders/${wo.work_order_id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">
                            {wo.wo_number}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getWorkOrderStatusColor(wo.status)}`}
                          >
                            {getWorkOrderStatusLabel(wo.status)}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {wo.title}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(wo.priority)}`}
                      >
                        {getPriorityLabel(wo.priority)}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No hay órdenes de trabajo recientes
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assets Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Cog className="h-5 w-5" />
                Activos
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/maintenance/assets">
                  Ver todos
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Asset status distribution */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Operativos</span>
                  <span className="font-medium text-success">{operationalAssets}</span>
                </div>
                <Progress
                  value={totalAssets > 0 ? (operationalAssets / totalAssets) * 100 : 0}
                  className="h-2"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">En Mantenimiento</span>
                  <span className="font-medium text-warning">{underMaintenanceAssets}</span>
                </div>
                <Progress
                  value={totalAssets > 0 ? (underMaintenanceAssets / totalAssets) * 100 : 0}
                  className="h-2 [&>div]:bg-warning"
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Total Activos</span>
                  <span className="text-2xl font-bold">{totalAssets}</span>
                </div>
              </div>

              {/* Assets needing maintenance */}
              {assetsNeedingMaintenance.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-warning flex items-center gap-2 mb-3">
                    <CalendarClock className="h-4 w-4" />
                    Próximos Mantenimientos
                  </h4>
                  <div className="space-y-2">
                    {assetsNeedingMaintenance.map((asset) => (
                      <Link
                        key={asset.asset_id}
                        href={`/dashboard/maintenance/assets/${asset.asset_id}`}
                        className="flex items-center justify-between p-2 rounded border hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium">{asset.asset_code}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {asset.asset_name}
                          </p>
                        </div>
                        <span className="text-xs text-warning">
                          {new Date(asset.next_maintenance_date!).toLocaleDateString(
                            "es-CO",
                            { day: "2-digit", month: "short" }
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/maintenance/work-orders">
                <ClipboardList className="h-6 w-6" />
                <span>Nueva Orden de Trabajo</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/maintenance/assets">
                <Cog className="h-6 w-6" />
                <span>Registrar Activo</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/maintenance/assets">
                <Gauge className="h-6 w-6" />
                <span>Registrar Lectura</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/dashboard/maintenance/plans">
                <CalendarClock className="h-6 w-6" />
                <span>Planes Preventivos</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
