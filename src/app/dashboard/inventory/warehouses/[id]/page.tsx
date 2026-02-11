"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  Boxes,
  Star,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Show } from "@/components/show/Show.component";
import {
  findById,
  getWarehouseLocations,
  getWarehouseStock,
  setDefaultWarehouse,
  type WarehouseLocation,
  type WarehouseStockSummary,
} from "../application/use-cases/warehouse.actions";
import type { Warehouse } from "../domain/entities/warehouse.entity";
import { formatCurrency } from "@/lib/utils";

interface PageParams {
  id: string;
}

export default function WarehouseDetailPage({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("info");

  const { data: warehouse, isLoading: isLoadingWarehouse } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => findById(id),
  });

  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ["warehouse-locations", id],
    queryFn: () => getWarehouseLocations(id),
    enabled: activeTab === "locations",
  });

  const { data: stockSummary = [], isLoading: isLoadingStock } = useQuery({
    queryKey: ["warehouse-stock", id],
    queryFn: () => getWarehouseStock(id),
    enabled: activeTab === "stock",
  });

  const setDefaultMutation = useMutation({
    mutationFn: () => setDefaultWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse", id] });
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });

  const getLocationTypeLabel = (type: WarehouseLocation["location_type"]) => {
    const labels: Record<WarehouseLocation["location_type"], string> = {
      zone: "Zona",
      aisle: "Pasillo",
      rack: "Estante",
      shelf: "Repisa",
      bin: "Ubicación",
    };
    return labels[type] || type;
  };

  const getLocationTypeColor = (type: WarehouseLocation["location_type"]) => {
    const colors: Record<WarehouseLocation["location_type"], string> = {
      zone: "bg-blue-100 text-blue-800",
      aisle: "bg-purple-100 text-purple-800",
      rack: "bg-orange-100 text-orange-800",
      shelf: "bg-green-100 text-green-800",
      bin: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const totalStockValue = stockSummary.reduce((sum, item) => sum + (item.total_value || 0), 0);
  const totalProducts = stockSummary.length;
  const totalQuantity = stockSummary.reduce((sum, item) => sum + item.quantity_on_hand, 0);

  if (isLoadingWarehouse) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Almacén no encontrado</p>
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    );
  }

  const fullAddress = [
    warehouse.address_line1,
    warehouse.address_line2,
    warehouse.city,
    warehouse.state,
    warehouse.country,
    warehouse.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

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
              <h1 className="text-2xl font-bold">{warehouse.name}</h1>
              {warehouse.is_default && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Principal
                </Badge>
              )}
              <Badge variant={warehouse.is_active ? "default" : "secondary"}>
                {warehouse.is_active ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Código: {warehouse.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!warehouse.is_default && warehouse.is_active && (
            <Button
              variant="outline"
              onClick={() => setDefaultMutation.mutate()}
              disabled={setDefaultMutation.isPending}
            >
              <Star className="mr-2 h-4 w-4" />
              Establecer como Principal
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ubicaciones</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">
              {locations.filter((l) => l.is_active).length} activas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">SKUs diferentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cantidad Total</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">unidades en stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStockValue)}</div>
            <p className="text-xs text-muted-foreground">valor del inventario</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {warehouse.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                    <p className="text-sm">{warehouse.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Stock Negativo
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      {warehouse.allows_negative_stock ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Permitido</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-600" />
                          <span className="text-sm">No permitido</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estado</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={warehouse.is_active ? "default" : "secondary"}>
                        {warehouse.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fullAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                      <p className="text-sm">{fullAddress}</p>
                    </div>
                  </div>
                )}
                {warehouse.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                      <p className="text-sm">{warehouse.phone}</p>
                    </div>
                  </div>
                )}
                {warehouse.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm">{warehouse.email}</p>
                    </div>
                  </div>
                )}
                {warehouse.manager_id && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Responsable
                      </label>
                      <p className="text-sm">ID: {warehouse.manager_id}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ubicaciones del Almacén</CardTitle>
              <CardDescription>
                Estructura de ubicaciones para almacenamiento de productos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Show
                when={!isLoadingLocations}
                fallback={
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                }
              >
                {locations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No hay ubicaciones configuradas</p>
                    <p className="text-sm text-muted-foreground">
                      Cree ubicaciones para organizar el inventario
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-center">Recepción</TableHead>
                        <TableHead className="text-center">Picking</TableHead>
                        <TableHead className="text-right">Productos</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locations.map((location) => (
                        <TableRow key={location.location_id}>
                          <TableCell className="font-mono text-sm">{location.code}</TableCell>
                          <TableCell className="font-medium">{location.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getLocationTypeColor(location.location_type)}
                            >
                              {getLocationTypeLabel(location.location_type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {location.is_receivable ? (
                              <Check className="h-4 w-4 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {location.is_pickable ? (
                              <Check className="h-4 w-4 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {location.product_count ?? 0}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {(location.stock_count ?? 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={location.is_active ? "default" : "secondary"}>
                              {location.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Show>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Tab */}
        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock del Almacén</CardTitle>
              <CardDescription>Resumen de inventario por producto</CardDescription>
            </CardHeader>
            <CardContent>
              <Show
                when={!isLoadingStock}
                fallback={
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                }
              >
                {stockSummary.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Boxes className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No hay stock en este almacén</p>
                    <p className="text-sm text-muted-foreground">
                      Los productos aparecerán aquí cuando se registren movimientos
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">En Mano</TableHead>
                        <TableHead className="text-right">Reservado</TableHead>
                        <TableHead className="text-right">Disponible</TableHead>
                        <TableHead className="text-right">Ubicaciones</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockSummary.map((item) => (
                        <TableRow
                          key={item.product_id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() =>
                            router.push(`/dashboard/inventory/products/${item.product_id}`)
                          }
                        >
                          <TableCell className="font-mono text-sm">{item.product_code}</TableCell>
                          <TableCell className="font-medium">{item.product_name}</TableCell>
                          <TableCell className="text-right font-mono">
                            {item.quantity_on_hand.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono text-orange-600">
                            {item.quantity_reserved.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono text-green-600">
                            {item.quantity_available.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">{item.location_count ?? 1}</TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(item.total_value ?? 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Show>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
