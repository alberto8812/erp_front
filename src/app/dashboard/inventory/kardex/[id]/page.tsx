"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRightLeft,
  ArrowDown,
  ArrowUp,
  Package,
  Calendar,
  Hash,
  Building2,
  FileText,
  DollarSign,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  MapPin,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { findById } from "../application/use-cases/kardex.actions";
import type { Kardex } from "../domain/entities/kardex.entity";
import {
  getKardexStatusLabel,
  getKardexStatusColor,
  getKardexMovementTypeLabel,
  isKardexEntryType,
} from "@/app/dashboard/inventory/shared/types/inventory.types";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

interface PageParams {
  id: string;
}

export default function KardexDetailPage({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: kardex, isLoading } = useQuery({
    queryKey: ["kardex", id],
    queryFn: () => findById(id),
  });

  const getSourceDocumentRoute = (docType?: string, docId?: string) => {
    if (!docType || !docId) return null;
    const routes: Record<string, string> = {
      purchase_order: `/dashboard/purchases/orders/${docId}`,
      purchase_receipt: `/dashboard/purchases/receipts/${docId}`,
      sales_order: `/dashboard/sales/orders/${docId}`,
      sales_shipment: `/dashboard/sales/shipments/${docId}`,
      sales_invoice: `/dashboard/sales/invoices/${docId}`,
      inventory_adjustment: `/dashboard/inventory/adjustments/${docId}`,
      inventory_transfer: `/dashboard/inventory/transfers/${docId}`,
      inventory_count: `/dashboard/inventory/inventory-counts/${docId}`,
      production_order: `/dashboard/production/orders/${docId}`,
      customer_return: `/dashboard/sales/returns/${docId}`,
      vendor_return: `/dashboard/purchases/returns/${docId}`,
    };
    return routes[docType] || null;
  };

  const getSourceDocumentLabel = (docType?: string) => {
    if (!docType) return "Documento";
    const labels: Record<string, string> = {
      purchase_order: "Orden de Compra",
      purchase_receipt: "Recepción de Compra",
      sales_order: "Orden de Venta",
      sales_shipment: "Despacho",
      sales_invoice: "Factura",
      inventory_adjustment: "Ajuste de Inventario",
      inventory_transfer: "Transferencia",
      inventory_count: "Conteo de Inventario",
      production_order: "Orden de Producción",
      customer_return: "Devolución de Cliente",
      vendor_return: "Devolución a Proveedor",
    };
    return labels[docType] || docType;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!kardex) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Movimiento no encontrado</p>
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    );
  }

  const isEntry = isKardexEntryType(kardex.movement_type);
  const sourceRoute = getSourceDocumentRoute(kardex.source_document_type, kardex.source_document_id);

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
              <h1 className="text-2xl font-bold">{kardex.movement_number}</h1>
              <Badge className={getKardexStatusColor(kardex.status)}>
                {getKardexStatusLabel(kardex.status)}
              </Badge>
              {kardex.is_reversal && (
                <Badge variant="outline" className="gap-1">
                  <RotateCcw className="h-3 w-3" />
                  Reversión
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(kardex.movement_datetime)}
            </p>
          </div>
        </div>
      </div>

      {/* Movement Type Banner */}
      <Card
        className={`border-l-4 ${
          isEntry ? "border-l-green-500 bg-green-50/50" : "border-l-red-500 bg-red-50/50"
        }`}
      >
        <CardContent className="flex items-center gap-4 py-4">
          <div
            className={`rounded-full p-3 ${
              isEntry ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isEntry ? <ArrowDown className="h-6 w-6" /> : <ArrowUp className="h-6 w-6" />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">
              {getKardexMovementTypeLabel(kardex.movement_type)}
            </p>
            <p className="text-sm text-muted-foreground">
              {isEntry ? "Entrada de inventario" : "Salida de inventario"}
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-2xl font-bold ${isEntry ? "text-green-700" : "text-red-700"}`}
            >
              {isEntry ? "+" : "-"}
              {kardex.quantity.toLocaleString()} {kardex.uom_code}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Producto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted cursor-pointer hover:bg-muted/80"
                onClick={() => router.push(`/dashboard/inventory/products/${kardex.product_id}`)}
              >
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p
                  className="font-medium cursor-pointer hover:underline"
                  onClick={() => router.push(`/dashboard/inventory/products/${kardex.product_id}`)}
                >
                  {kardex.product_name}
                </p>
                <p className="text-sm text-muted-foreground font-mono">{kardex.product_sku}</p>
              </div>
            </div>

            {(kardex.lot_number || kardex.serial_number) && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  {kardex.lot_number && (
                    <div>
                      <label className="text-xs text-muted-foreground">Lote</label>
                      <p className="font-mono text-sm">{kardex.lot_number}</p>
                    </div>
                  )}
                  {kardex.serial_number && (
                    <div>
                      <label className="text-xs text-muted-foreground">Serie</label>
                      <p className="font-mono text-sm">{kardex.serial_number}</p>
                    </div>
                  )}
                  {kardex.expiration_date && (
                    <div>
                      <label className="text-xs text-muted-foreground">Vencimiento</label>
                      <p className="text-sm">{formatDate(kardex.expiration_date)}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quantity & Cost */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cantidad y Costo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Cantidad</label>
                <p className="text-lg font-semibold">
                  {kardex.quantity.toLocaleString()} {kardex.uom_code}
                </p>
                {kardex.base_quantity && kardex.base_quantity !== kardex.quantity && (
                  <p className="text-xs text-muted-foreground">
                    = {kardex.base_quantity.toLocaleString()} unidades base
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Costo Unitario</label>
                <p className="text-lg font-semibold">{formatCurrency(kardex.unit_cost)}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Costo Total</label>
                <p className="text-lg font-semibold">{formatCurrency(kardex.total_cost)}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Moneda</label>
                <p className="text-lg font-semibold">{kardex.currency}</p>
                {kardex.exchange_rate !== 1 && (
                  <p className="text-xs text-muted-foreground">TC: {kardex.exchange_rate}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg -m-2"
              onClick={() =>
                router.push(`/dashboard/inventory/warehouses/${kardex.warehouse_id}`)
              }
            >
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-xs text-muted-foreground">Almacén</label>
                <p className="text-sm font-medium">ID: {kardex.warehouse_id}</p>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
            </div>

            {(kardex.from_location_id || kardex.to_location_id) && (
              <>
                <Separator />
                <div className="flex items-center gap-4">
                  {kardex.from_location_id && (
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Ubicación Origen</label>
                      <p className="text-sm font-mono">{kardex.from_location_id}</p>
                    </div>
                  )}
                  {kardex.from_location_id && kardex.to_location_id && (
                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                  )}
                  {kardex.to_location_id && (
                    <div className="flex-1 text-right">
                      <label className="text-xs text-muted-foreground">Ubicación Destino</label>
                      <p className="text-sm font-mono">{kardex.to_location_id}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Source Document */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documento Origen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kardex.source_document_type ? (
              <>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    sourceRoute ? "cursor-pointer hover:bg-muted/50" : ""
                  }`}
                  onClick={() => sourceRoute && router.push(sourceRoute)}
                >
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">
                      {getSourceDocumentLabel(kardex.source_document_type)}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {kardex.source_document_number || kardex.source_document_id}
                    </p>
                  </div>
                  {sourceRoute && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                </div>

                {kardex.third_party_name && (
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-xs text-muted-foreground">Tercero</label>
                      <p className="text-sm">{kardex.third_party_name}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sin documento origen asociado</p>
              </div>
            )}

            {kardex.reason_code && (
              <>
                <Separator />
                <div>
                  <label className="text-xs text-muted-foreground">Razón</label>
                  <p className="text-sm font-medium">{kardex.reason_code}</p>
                  {kardex.reason_description && (
                    <p className="text-sm text-muted-foreground">{kardex.reason_description}</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Running Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Saldo Corrido
            </CardTitle>
            <CardDescription>Balance del producto después de este movimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <label className="text-xs text-muted-foreground">Cantidad</label>
                <p className="text-xl font-bold">{kardex.running_quantity.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <label className="text-xs text-muted-foreground">Costo Total</label>
                <p className="text-xl font-bold">{formatCurrency(kardex.running_total_cost)}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <label className="text-xs text-muted-foreground">Costo Unitario</label>
                <p className="text-xl font-bold">{formatCurrency(kardex.running_unit_cost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Fecha Movimiento</label>
                <p className="text-sm">{formatDate(kardex.movement_date)}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Creado por</label>
                <p className="text-sm">{kardex.created_by}</p>
              </div>
              {kardex.confirmed_at && (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground">Confirmado</label>
                    <p className="text-sm">{formatDateTime(kardex.confirmed_at)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Confirmado por</label>
                    <p className="text-sm">{kardex.confirmed_by}</p>
                  </div>
                </>
              )}
              {kardex.posted_at && (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground">Contabilizado</label>
                    <p className="text-sm">{formatDateTime(kardex.posted_at)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Contabilizado por</label>
                    <p className="text-sm">{kardex.posted_by}</p>
                  </div>
                </>
              )}
            </div>

            {kardex.notes && (
              <>
                <Separator />
                <div>
                  <label className="text-xs text-muted-foreground">Notas</label>
                  <p className="text-sm whitespace-pre-wrap">{kardex.notes}</p>
                </div>
              </>
            )}

            {kardex.journal_entry_id && (
              <>
                <Separator />
                <div>
                  <label className="text-xs text-muted-foreground">Asiento Contable</label>
                  <p className="text-sm font-mono">{kardex.journal_entry_id}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reversal Info */}
      {(kardex.is_reversal || kardex.reversal_kardex_id) && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <RotateCcw className="h-4 w-4" />
              Información de Reversión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kardex.is_reversal && kardex.reversed_kardex_id && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-orange-200">
                <div>
                  <p className="text-sm font-medium">Este movimiento es una reversión de:</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {kardex.reversed_kardex_id}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/inventory/kardex/${kardex.reversed_kardex_id}`)
                  }
                >
                  Ver Original
                </Button>
              </div>
            )}
            {kardex.reversal_kardex_id && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-orange-200">
                <div>
                  <p className="text-sm font-medium">Este movimiento fue revertido por:</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {kardex.reversal_kardex_id}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/inventory/kardex/${kardex.reversal_kardex_id}`)
                  }
                >
                  Ver Reversión
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cancellation Info */}
      {kardex.status === "cancelled" && kardex.cancelled_at && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              Movimiento Cancelado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Fecha Cancelación</label>
                <p className="text-sm">{formatDateTime(kardex.cancelled_at)}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cancelado por</label>
                <p className="text-sm">{kardex.cancelled_by}</p>
              </div>
              {kardex.cancellation_reason && (
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground">Razón</label>
                  <p className="text-sm">{kardex.cancellation_reason}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
