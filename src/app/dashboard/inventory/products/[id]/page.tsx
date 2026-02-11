"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Package,
  Warehouse,
  FileText,
  DollarSign,
  Truck,
  BarChart3,
  Tag,
  Layers,
  Scale,
  Settings,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findById, getProductStock, getProductKardex } from "../application/use-cases/product.actions";
import type { Product } from "../domain/entities/product.entity";
import {
  PRODUCT_TYPE_OPTIONS,
  VALUATION_METHOD_OPTIONS,
  getKardexMovementTypeLabel,
  isKardexEntryType,
} from "../../shared/types/inventory.types";

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

function InfoRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2">
      {icon && <div className="text-muted-foreground mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

function BooleanBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        value ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
      }`}
    >
      {value ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {value ? trueLabel : falseLabel}
    </span>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => findById(productId),
  });

  const { data: stockLevels = [], isLoading: stockLoading } = useQuery({
    queryKey: ["product-stock", productId],
    queryFn: () => getProductStock(productId),
    enabled: !!product,
  });

  const { data: kardexEntries = [], isLoading: kardexLoading } = useQuery({
    queryKey: ["product-kardex", productId],
    queryFn: () => getProductKardex(productId),
    enabled: !!product,
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

  if (error || !product) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar el producto</p>
          <button
            onClick={() => router.push("/dashboard/inventory/products")}
            className="mt-4 text-primary hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const productTypeLabel = PRODUCT_TYPE_OPTIONS.find((o) => o.value === product.product_type)?.label;
  const valuationLabel = VALUATION_METHOD_OPTIONS.find((o) => o.value === product.valuation_method)?.label;

  const totalStock = stockLevels.reduce((acc, s) => acc + s.quantity_on_hand, 0);
  const totalAvailable = stockLevels.reduce((acc, s) => acc + s.quantity_available, 0);
  const totalReserved = stockLevels.reduce((acc, s) => acc + s.quantity_reserved, 0);

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
                onClick={() => router.push("/dashboard/inventory/products")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-4">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-lg font-semibold tracking-tight truncate">
                      {product.name}
                    </h1>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "active"
                          ? "bg-success/15 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {product.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    SKU: {product.sku}
                    {product.barcode && ` • Código: ${product.barcode}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/inventory/products/${productId}/edit`)}
              >
                Editar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Tabs */}
            <div className="lg:col-span-8">
              <Tabs defaultValue="info" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="info" className="gap-1.5">
                    <Package className="h-4 w-4" />
                    Información
                  </TabsTrigger>
                  <TabsTrigger value="stock" className="gap-1.5">
                    <Warehouse className="h-4 w-4" />
                    Stock
                  </TabsTrigger>
                  <TabsTrigger value="kardex" className="gap-1.5">
                    <FileText className="h-4 w-4" />
                    Kardex
                  </TabsTrigger>
                  <TabsTrigger value="costs" className="gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    Costos
                  </TabsTrigger>
                </TabsList>

                {/* Info Tab */}
                <TabsContent value="info" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Información General</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-x-6">
                      <InfoRow label="Nombre" value={product.name} icon={<Package className="h-4 w-4" />} />
                      <InfoRow label="SKU" value={product.sku} icon={<Tag className="h-4 w-4" />} />
                      <InfoRow label="Código de Barras" value={product.barcode} />
                      <InfoRow label="Tipo de Producto" value={productTypeLabel} icon={<Layers className="h-4 w-4" />} />
                      <div className="col-span-2">
                        <InfoRow label="Descripción" value={product.description} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Control de Inventario</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <BooleanBadge value={product.is_inventory_tracked} trueLabel="Inventariable" falseLabel="No Inventariable" />
                        <BooleanBadge value={product.is_lot_tracked} trueLabel="Control por Lote" falseLabel="Sin Lotes" />
                        <BooleanBadge value={product.is_serial_tracked} trueLabel="Control por Serie" falseLabel="Sin Series" />
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 pt-2 border-t">
                        <InfoRow label="Método de Valoración" value={valuationLabel} />
                        <InfoRow label="Lead Time" value={product.lead_time_days ? `${product.lead_time_days} días` : undefined} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Capacidades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <BooleanBadge value={product.is_purchaseable} trueLabel="Comprable" falseLabel="No Comprable" />
                        <BooleanBadge value={product.is_saleable} trueLabel="Vendible" falseLabel="No Vendible" />
                        <BooleanBadge value={product.is_manufacturable} trueLabel="Manufacturable" falseLabel="No Manufacturable" />
                      </div>
                    </CardContent>
                  </Card>

                  {(product.weight || product.volume || product.length) && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Dimensiones y Peso</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-3 gap-x-6">
                        <InfoRow
                          label="Peso"
                          value={product.weight ? `${product.weight} ${product.weight_uom || "kg"}` : undefined}
                          icon={<Scale className="h-4 w-4" />}
                        />
                        <InfoRow
                          label="Volumen"
                          value={product.volume ? `${product.volume} ${product.volume_uom || "m³"}` : undefined}
                        />
                        <InfoRow
                          label="Dimensiones"
                          value={
                            product.length
                              ? `${product.length} x ${product.width} x ${product.height} ${product.dimensions_uom || "cm"}`
                              : undefined
                          }
                        />
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Stock Tab */}
                <TabsContent value="stock">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Stock por Almacén</CardTitle>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Total: <span className="font-mono font-medium text-foreground">{totalStock}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Disponible: <span className="font-mono font-medium text-success">{totalAvailable}</span>
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/20">
                            <TableHead className="text-[10px] font-medium uppercase tracking-wider">Almacén</TableHead>
                            <TableHead className="text-[10px] font-medium uppercase tracking-wider">Ubicación</TableHead>
                            <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">En Mano</TableHead>
                            <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">Reservado</TableHead>
                            <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">Disponible</TableHead>
                            <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">En Orden</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stockLoading ? (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                Cargando...
                              </TableCell>
                            </TableRow>
                          ) : stockLevels.length > 0 ? (
                            stockLevels.map((stock) => (
                              <TableRow key={stock.stock_level_id}>
                                <TableCell className="font-medium text-sm">
                                  {stock.warehouse?.name || stock.warehouse_id.slice(0, 8)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {stock.location?.code || "—"}
                                </TableCell>
                                <TableCell className="text-right font-mono tabular-nums text-sm">
                                  {stock.quantity_on_hand}
                                </TableCell>
                                <TableCell className="text-right font-mono tabular-nums text-sm text-warning">
                                  {stock.quantity_reserved > 0 ? stock.quantity_reserved : "—"}
                                </TableCell>
                                <TableCell className="text-right font-mono tabular-nums text-sm font-medium text-success">
                                  {stock.quantity_available}
                                </TableCell>
                                <TableCell className="text-right font-mono tabular-nums text-sm text-primary">
                                  {stock.quantity_on_order > 0 ? stock.quantity_on_order : "—"}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                Sin stock registrado
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Kardex Tab */}
                <TabsContent value="kardex">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Movimientos de Inventario</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/20">
                            <TableHead className="text-[10px] font-medium uppercase tracking-wider">Fecha</TableHead>
                            <TableHead className="text-[10px] font-medium uppercase tracking-wider">Tipo</TableHead>
                            <TableHead className="text-[10px] font-medium uppercase tracking-wider">Documento</TableHead>
                            <TableHead className="w-24 text-right text-[10px] font-medium uppercase tracking-wider">Cantidad</TableHead>
                            <TableHead className="w-28 text-right text-[10px] font-medium uppercase tracking-wider">Costo Unit.</TableHead>
                            <TableHead className="w-28 text-right text-[10px] font-medium uppercase tracking-wider">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {kardexLoading ? (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                Cargando...
                              </TableCell>
                            </TableRow>
                          ) : kardexEntries.length > 0 ? (
                            kardexEntries.slice(0, 20).map((entry) => {
                              const isEntry = isKardexEntryType(entry.movement_type as any);
                              return (
                                <TableRow key={entry.kardex_id}>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {formatDate(entry.movement_date)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1.5">
                                      {isEntry ? (
                                        <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                                      ) : (
                                        <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
                                      )}
                                      <span className="text-sm">
                                        {getKardexMovementTypeLabel(entry.movement_type as any)}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-sm font-mono text-muted-foreground">
                                    {entry.source_document_number || entry.movement_number}
                                  </TableCell>
                                  <TableCell className={`text-right font-mono tabular-nums text-sm font-medium ${isEntry ? "text-success" : "text-destructive"}`}>
                                    {isEntry ? "+" : "-"}{Math.abs(entry.quantity)}
                                  </TableCell>
                                  <TableCell className="text-right font-mono tabular-nums text-sm">
                                    {formatCurrency(entry.unit_cost)}
                                  </TableCell>
                                  <TableCell className="text-right font-mono tabular-nums text-sm font-medium">
                                    {formatCurrency(entry.total_cost)}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                Sin movimientos registrados
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Costs Tab */}
                <TabsContent value="costs" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Costos</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Costo Estándar</p>
                        <p className="text-xl font-semibold font-mono">
                          {product.standard_cost ? formatCurrency(product.standard_cost) : "—"}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Última Compra</p>
                        <p className="text-xl font-semibold font-mono">
                          {product.last_purchase_cost ? formatCurrency(product.last_purchase_cost) : "—"}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Costo Promedio</p>
                        <p className="text-xl font-semibold font-mono text-primary">
                          {product.average_cost ? formatCurrency(product.average_cost) : "—"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Precios</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Precio Base</p>
                        <p className="text-xl font-semibold font-mono">
                          {product.base_price ? formatCurrency(product.base_price) : "—"}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Precio Mínimo</p>
                        <p className="text-xl font-semibold font-mono">
                          {product.min_sale_price ? formatCurrency(product.min_sale_price) : "—"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-4 space-y-4">
              {/* Stock Summary Card */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                    Resumen de Stock
                  </h3>

                  <div className="space-y-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Stock Total</p>
                      <p className="text-3xl font-bold font-mono">{totalStock}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-success/10 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Disponible</p>
                        <p className="text-lg font-semibold font-mono text-success">{totalAvailable}</p>
                      </div>
                      <div className="text-center p-3 bg-warning/10 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Reservado</p>
                        <p className="text-lg font-semibold font-mono text-warning">{totalReserved}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reorder Settings */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                    Configuración de Reorden
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Punto de Reorden</span>
                      <span className="font-mono font-medium">{product.reorder_point ?? "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cantidad de Reorden</span>
                      <span className="font-mono font-medium">{product.reorder_quantity ?? "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock Mínimo</span>
                      <span className="font-mono font-medium">{product.min_stock ?? "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock Máximo</span>
                      <span className="font-mono font-medium">{product.max_stock ?? "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock de Seguridad</span>
                      <span className="font-mono font-medium">{product.safety_stock ?? "—"}</span>
                    </div>

                    {product.reorder_point && totalAvailable <= product.reorder_point && (
                      <div className="mt-3 p-2 bg-warning/10 rounded border border-warning/20">
                        <p className="text-xs text-warning font-medium">
                          Stock bajo punto de reorden
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Life Cycle */}
              {(product.shelf_life_days || product.warranty_days) && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                      Ciclo de Vida
                    </h3>

                    <div className="space-y-3">
                      {product.shelf_life_days && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Vida Útil</span>
                          <span className="font-medium">{product.shelf_life_days} días</span>
                        </div>
                      )}
                      {product.warranty_days && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Garantía</span>
                          <span className="font-medium">{product.warranty_days} días</span>
                        </div>
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
