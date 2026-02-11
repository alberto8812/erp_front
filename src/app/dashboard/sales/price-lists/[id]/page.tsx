"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star,
  Copy,
  MoreHorizontal,
  Pencil,
  Loader2,
  Calendar,
  Building2,
  Package,
  FileText,
  Clock,
  Tag,
  Percent,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  activatePriceList,
  deactivatePriceList,
  duplicatePriceList,
  setAsDefault,
} from "../application/use-cases/price-list.actions";
import type { PriceList, PriceListItem } from "../domain/entities/price-list.entity";
import {
  getPriceListStatusLabel,
  getPriceListStatusColor,
  PRICE_LIST_CUSTOMER_TYPE_OPTIONS,
} from "../../shared/types/sales.types";

function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function getCustomerTypeLabel(type: string): string {
  return PRICE_LIST_CUSTOMER_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

function PriceListItemRow({ item, currency }: { item: PriceListItem; currency: string }) {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-sm line-clamp-1">
            {item.product?.name || "Producto sin nombre"}
          </span>
          {item.product?.sku && (
            <span className="text-xs text-muted-foreground font-mono">
              {item.product.sku}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-sm">
        {formatCurrency(item.unit_price, currency)}
      </TableCell>
      <TableCell className="text-right font-mono tabular-nums text-sm text-muted-foreground">
        {item.product?.base_price ? formatCurrency(item.product.base_price, currency) : "—"}
      </TableCell>
      <TableCell className="text-right">
        {item.discount_percent && item.discount_percent > 0 ? (
          <span className="text-xs text-destructive font-mono">-{item.discount_percent}%</span>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </TableCell>
      <TableCell className="text-center text-sm text-muted-foreground">
        {item.min_quantity ?? "—"} - {item.max_quantity ?? "∞"}
      </TableCell>
      <TableCell className="text-center">
        {item.is_active ? (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Activo
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Inactivo
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
}

export default function PriceListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const priceListId = params.id as string;

  const { data: priceList, isLoading, error } = useQuery({
    queryKey: ["price-list", priceListId],
    queryFn: () => findById(priceListId),
  });

  const activateMutation = useMutation({
    mutationFn: () => activatePriceList(priceListId),
    onSuccess: () => {
      toast({ title: "Lista de precios activada" });
      queryClient.invalidateQueries({ queryKey: ["price-list", priceListId] });
    },
    onError: () => {
      toast({ title: "Error al activar la lista", variant: "destructive" });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: () => deactivatePriceList(priceListId),
    onSuccess: () => {
      toast({ title: "Lista de precios desactivada" });
      queryClient.invalidateQueries({ queryKey: ["price-list", priceListId] });
    },
    onError: () => {
      toast({ title: "Error al desactivar la lista", variant: "destructive" });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: () => duplicatePriceList(priceListId),
    onSuccess: (data) => {
      toast({ title: "Lista de precios duplicada" });
      router.push(`/dashboard/sales/price-lists/${data.price_list_id}`);
    },
    onError: () => {
      toast({ title: "Error al duplicar la lista", variant: "destructive" });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: () => setAsDefault(priceListId),
    onSuccess: () => {
      toast({ title: "Lista establecida como predeterminada" });
      queryClient.invalidateQueries({ queryKey: ["price-list", priceListId] });
    },
    onError: () => {
      toast({ title: "Error al establecer como predeterminada", variant: "destructive" });
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

  if (error || !priceList) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar la lista de precios</p>
          <button
            onClick={() => router.push("/dashboard/sales/price-lists")}
            className="mt-4 text-primary hover:underline"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const status = priceList.is_active ? "active" : "inactive";

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
                onClick={() => router.push("/dashboard/sales/price-lists")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {priceList.name}
                  </h1>
                  <span className="text-sm font-mono text-muted-foreground">
                    {priceList.code}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriceListStatusColor(
                      status
                    )}`}
                  >
                    {getPriceListStatusLabel(status)}
                  </span>
                  {priceList.is_default && (
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      Predeterminada
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {priceList.description || `${priceList.items?.length || 0} productos`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!priceList.is_active ? (
                <Button
                  size="sm"
                  onClick={() => activateMutation.mutate()}
                  disabled={activateMutation.isPending}
                >
                  {activateMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Activar
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deactivateMutation.mutate()}
                  disabled={deactivateMutation.isPending}
                >
                  {deactivateMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <XCircle className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Desactivar
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/sales/price-lists/${priceListId}/edit`)}
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
                  <DropdownMenuItem
                    onClick={() => duplicateMutation.mutate()}
                    disabled={duplicateMutation.isPending}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicar
                  </DropdownMenuItem>
                  {!priceList.is_default && (
                    <DropdownMenuItem
                      onClick={() => setDefaultMutation.mutate()}
                      disabled={setDefaultMutation.isPending}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Establecer como Predeterminada
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                    <span className="text-xs font-medium uppercase tracking-wide">Vigencia</span>
                  </div>
                  <p className="text-sm font-medium">
                    {formatDate(priceList.effective_from)}
                    {priceList.effective_to && ` - ${formatDate(priceList.effective_to)}`}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Moneda</span>
                  </div>
                  <p className="text-sm font-medium">{priceList.currency}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Tipo Cliente</span>
                  </div>
                  <p className="text-sm font-medium">
                    {getCustomerTypeLabel(priceList.customer_type || "all")}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">Productos</span>
                  </div>
                  <p className="text-sm font-medium">{priceList.items?.length || 0}</p>
                </div>
              </div>

              {/* Price Items Table */}
              <Card className="overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Precios de Productos</h3>
                      <p className="text-xs text-muted-foreground">
                        {priceList.items?.length || 0} productos configurados
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableHead className="text-[10px] font-medium uppercase tracking-wider">
                          Producto
                        </TableHead>
                        <TableHead className="w-32 text-right text-[10px] font-medium uppercase tracking-wider">
                          Precio Lista
                        </TableHead>
                        <TableHead className="w-32 text-right text-[10px] font-medium uppercase tracking-wider">
                          Precio Base
                        </TableHead>
                        <TableHead className="w-20 text-right text-[10px] font-medium uppercase tracking-wider">
                          Dto.
                        </TableHead>
                        <TableHead className="w-28 text-center text-[10px] font-medium uppercase tracking-wider">
                          Cant. Min-Max
                        </TableHead>
                        <TableHead className="w-20 text-center text-[10px] font-medium uppercase tracking-wider">
                          Estado
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priceList.items && priceList.items.length > 0 ? (
                        priceList.items.map((item) => (
                          <PriceListItemRow
                            key={item.item_id}
                            item={item}
                            currency={priceList.currency}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No hay productos en esta lista de precios
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Notes */}
              {(priceList.description || priceList.notes) && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Notas</h3>
                    </div>
                    <div className="space-y-3">
                      {priceList.description && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Descripción</p>
                          <p className="text-sm">{priceList.description}</p>
                        </div>
                      )}
                      {priceList.notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Notas adicionales</p>
                          <p className="text-sm">{priceList.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-4">
              {/* Config Summary Card */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                    Configuración
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        Prioridad
                      </span>
                      <span className="font-mono tabular-nums">{priceList.priority}</span>
                    </div>

                    {(priceList.discount_percent ?? 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Percent className="h-3.5 w-3.5" />
                          Descuento General
                        </span>
                        <span className="font-mono tabular-nums text-destructive">
                          -{priceList.discount_percent}%
                        </span>
                      </div>
                    )}

                    {(priceList.markup_percent ?? 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Percent className="h-3.5 w-3.5" />
                          Margen
                        </span>
                        <span className="font-mono tabular-nums text-success">
                          +{priceList.markup_percent}%
                        </span>
                      </div>
                    )}

                    {priceList.rounding_rule && priceList.rounding_rule !== "none" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Redondeo</span>
                        <span className="capitalize">{priceList.rounding_rule}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Estado</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriceListStatusColor(
                            status
                          )}`}
                        >
                          {getPriceListStatusLabel(status)}
                        </span>
                      </div>
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
                      Información
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {priceList.created_at && (
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full mt-1.5 bg-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Lista creada</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(priceList.created_at)}
                          </p>
                        </div>
                      </div>
                    )}
                    {priceList.updated_at && priceList.updated_at !== priceList.created_at && (
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full mt-1.5 bg-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Última actualización</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(priceList.updated_at)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer if specific */}
              {priceList.customer && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Cliente Específico
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">{priceList.customer.legal_name}</p>
                      {priceList.customer.comercial_name && (
                        <p className="text-xs text-muted-foreground">
                          {priceList.customer.comercial_name}
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
