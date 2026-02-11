"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Cog,
  Gauge,
  MapPin,
  Calendar,
  Wrench,
  Clock,
  FileText,
  Building2,
  MoreHorizontal,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { findById } from "../application/use-cases/asset.actions";
import type { MaintenanceAsset } from "../domain/entities/asset.entity";
import {
  getAssetStatusLabel,
  getAssetStatusColor,
  getCriticalityLabel,
  getCriticalityColor,
} from "../domain/entities/asset.entity";

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO").format(value);
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-right">{value || "—"}</div>
    </div>
  );
}

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.id as string;

  const { data: asset, isLoading, error } = useQuery({
    queryKey: ["maintenance-asset", assetId],
    queryFn: () => findById(assetId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
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

  if (error || !asset) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error al cargar el activo</p>
        <button
          onClick={() => router.push("/dashboard/maintenance/assets")}
          className="mt-4 text-primary hover:underline"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  const warrantyActive =
    asset.warranty_end_date && new Date(asset.warranty_end_date) > new Date();

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 -mx-6 -mt-6 px-6 py-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => router.push("/dashboard/maintenance/assets")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-lg font-semibold tracking-tight">
                  {asset.asset_code}
                </h1>
                <Badge
                  variant="outline"
                  className={getAssetStatusColor(asset.status)}
                >
                  {getAssetStatusLabel(asset.status)}
                </Badge>
                <Badge
                  variant="outline"
                  className={getCriticalityColor(asset.criticality)}
                >
                  {getCriticalityLabel(asset.criticality)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {asset.asset_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/dashboard/maintenance/work-orders/new?asset=${assetId}`)
              }
            >
              <Wrench className="mr-1.5 h-3.5 w-3.5" />
              Nueva OT
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/maintenance/assets/${assetId}/edit`)}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Editar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Gauge className="mr-2 h-4 w-4" />
                  Registrar Lectura
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Manual
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Cog className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">Fabricante</span>
              </div>
              <p className="text-sm font-medium truncate">
                {asset.manufacturer || "—"}
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <span className="text-xs font-medium uppercase tracking-wide">Modelo</span>
              </div>
              <p className="text-sm font-medium truncate">{asset.model || "—"}</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">Ubicación</span>
              </div>
              <p className="text-sm font-medium truncate">{asset.area || "—"}</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">Instalación</span>
              </div>
              <p className="text-sm font-medium">
                {asset.installation_date ? formatDate(asset.installation_date) : "—"}
              </p>
            </div>
          </div>

          {/* Meter Card */}
          {asset.has_meter && (
            <Card className="relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Medidor de {asset.meter_type}</h3>
                  </div>
                  <Button variant="outline" size="sm">
                    <Gauge className="mr-1.5 h-3.5 w-3.5" />
                    Registrar Lectura
                  </Button>
                </div>

                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl font-bold tabular-nums">
                    {formatNumber(asset.current_meter_reading || 0)}
                  </span>
                  <span className="text-lg text-muted-foreground mb-1">
                    {asset.meter_unit}
                  </span>
                </div>

                {asset.last_meter_reading_date && (
                  <p className="text-xs text-muted-foreground">
                    Última lectura: {formatDate(asset.last_meter_reading_date)}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Technical Specs */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-medium mb-4">Datos Técnicos</h3>
              <div className="grid grid-cols-2 gap-x-8">
                <InfoRow label="Serial" value={asset.serial_number} />
                <InfoRow label="Año Fabricación" value={asset.year_manufactured} />
                <InfoRow label="Placa/Etiqueta" value={asset.asset_tag} />
                <InfoRow label="Código de Barras" value={asset.barcode} />
                <InfoRow label="Línea Producción" value={asset.production_line} />
                <InfoRow
                  label="Almacén"
                  value={asset.warehouse?.name || asset.warehouse?.code}
                />
              </div>
            </CardContent>
          </Card>

          {/* Costs */}
          {(asset.purchase_cost || asset.replacement_cost) && (
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-medium mb-4">Información Financiera</h3>
                <div className="grid grid-cols-2 gap-x-8">
                  <InfoRow
                    label="Costo de Compra"
                    value={
                      asset.purchase_cost
                        ? `$${formatNumber(asset.purchase_cost)}`
                        : undefined
                    }
                  />
                  <InfoRow
                    label="Costo de Reemplazo"
                    value={
                      asset.replacement_cost
                        ? `$${formatNumber(asset.replacement_cost)}`
                        : undefined
                    }
                  />
                  <InfoRow
                    label="Fecha de Compra"
                    value={
                      asset.purchase_date ? formatDate(asset.purchase_date) : undefined
                    }
                  />
                  <InfoRow label="Proveedor" value={asset.vendor?.legal_name} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {asset.description && (
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-medium mb-3">Descripción</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {asset.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Warranty Status */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                Garantía
              </h3>
              {asset.warranty_end_date ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {warrantyActive ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-success">Garantía Activa</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Garantía Vencida
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    {asset.warranty_start_date && (
                      <p>
                        <span className="text-muted-foreground">Inicio:</span>{" "}
                        {formatDate(asset.warranty_start_date)}
                      </p>
                    )}
                    <p>
                      <span className="text-muted-foreground">Fin:</span>{" "}
                      {formatDate(asset.warranty_end_date)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin información de garantía</p>
              )}
            </CardContent>
          </Card>

          {/* Next Maintenance */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Próximo Mantenimiento
                </h3>
              </div>
              {asset.next_maintenance_date ? (
                <div className="space-y-2">
                  <p className="text-lg font-semibold">
                    {formatDate(asset.next_maintenance_date)}
                  </p>
                  {asset.last_maintenance_date && (
                    <p className="text-xs text-muted-foreground">
                      Último: {formatDate(asset.last_maintenance_date)}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin mantenimiento programado</p>
              )}
            </CardContent>
          </Card>

          {/* Responsible */}
          {asset.responsible_user && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                  Responsable
                </h3>
                <p className="text-sm font-medium">{asset.responsible_user.name}</p>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {(asset.image_url || asset.manual_url) && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                  Documentos
                </h3>
                <div className="space-y-2">
                  {asset.image_url && (
                    <a
                      href={asset.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Ver Imagen
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {asset.manual_url && (
                    <a
                      href={asset.manual_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Ver Manual
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
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
                {asset.created_at && (
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full mt-1.5 bg-primary" />
                    <div>
                      <p className="text-sm font-medium">Activo registrado</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(asset.created_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
