"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  Package,
  Truck,
  MapPin,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Autocomplete } from "@/shared/presentation/components/autocomplete/Autocomplete";
import { LotSerialPickerModal, type SelectedLot, type InventoryLot } from "./LotSerialPickerModal";
import type { Shipment, ShipmentLine } from "../../domain/entities/shipment.entity";
import type { AutocompleteOption } from "@/shared/presentation/types/autocomplete.types";

const shipmentSchema = z.object({
  sales_order_id: z.string().min(1, "Orden de venta requerida"),
  shipment_date: z.string().min(1, "Fecha de despacho requerida"),
  expected_delivery_date: z.string().optional(),
  warehouse_id: z.string().min(1, "Bodega requerida"),
  carrier_id: z.string().optional(),
  tracking_number: z.string().optional(),
  shipping_method: z.string().optional(),
  shipping_cost: z.number().optional(),
  ship_to_address: z.string().optional(),
  ship_to_city: z.string().optional(),
  ship_to_state: z.string().optional(),
  ship_to_country: z.string().optional(),
  ship_to_postal_code: z.string().optional(),
  notes: z.string().optional(),
  internal_notes: z.string().optional(),
});

type ShipmentFormData = z.infer<typeof shipmentSchema>;

interface ShipmentLineWithLots extends ShipmentLine {
  selected_lots?: SelectedLot[];
  tracking_type?: "lot" | "serial" | "none";
}

interface ShipmentFormPageProps {
  defaultValues?: Partial<Shipment>;
  defaultLines?: ShipmentLineWithLots[];
  onSubmit: (data: ShipmentFormData, lines: ShipmentLineWithLots[]) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  shipmentNumber?: string;
  searchSalesOrders: (query: string) => Promise<AutocompleteOption[]>;
  searchWarehouses: (query: string) => Promise<AutocompleteOption[]>;
  searchCarriers: (query: string) => Promise<AutocompleteOption[]>;
  fetchOrderLines: (orderId: string) => Promise<ShipmentLineWithLots[]>;
  fetchAvailableLots: (productId: string, warehouseId: string, strategy?: "FIFO" | "FEFO") => Promise<InventoryLot[]>;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function ShipmentFormPage({
  defaultValues,
  defaultLines = [],
  onSubmit,
  isLoading,
  isEdit,
  shipmentNumber,
  searchSalesOrders,
  searchWarehouses,
  searchCarriers,
  fetchOrderLines,
  fetchAvailableLots,
}: ShipmentFormPageProps) {
  const router = useRouter();
  const [lines, setLines] = useState<ShipmentLineWithLots[]>(defaultLines);
  const [lotPickerOpen, setLotPickerOpen] = useState(false);
  const [currentLineForPicking, setCurrentLineForPicking] = useState<ShipmentLineWithLots | null>(null);
  const [availableLots, setAvailableLots] = useState<InventoryLot[]>([]);
  const [isLoadingLots, setIsLoadingLots] = useState(false);
  const [selectedOrderName, setSelectedOrderName] = useState<string | undefined>(
    defaultValues?.sales_order?.order_number
  );
  const [selectedWarehouseName, setSelectedWarehouseName] = useState<string | undefined>(
    defaultValues?.warehouse?.name
  );
  const [selectedCarrierName, setSelectedCarrierName] = useState<string | undefined>(
    defaultValues?.carrier?.name
  );

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      sales_order_id: defaultValues?.sales_order_id || "",
      shipment_date: defaultValues?.shipment_date || new Date().toISOString().split("T")[0],
      expected_delivery_date: defaultValues?.expected_delivery_date || "",
      warehouse_id: defaultValues?.warehouse_id || "",
      carrier_id: defaultValues?.carrier_id || "",
      tracking_number: defaultValues?.tracking_number || "",
      shipping_method: defaultValues?.shipping_method || "",
      shipping_cost: defaultValues?.shipping_cost || 0,
      ship_to_address: defaultValues?.ship_to_address || "",
      ship_to_city: defaultValues?.ship_to_city || "",
      ship_to_state: defaultValues?.ship_to_state || "",
      ship_to_country: defaultValues?.ship_to_country || "",
      ship_to_postal_code: defaultValues?.ship_to_postal_code || "",
      notes: defaultValues?.notes || "",
      internal_notes: defaultValues?.internal_notes || "",
    },
  });

  const warehouseId = form.watch("warehouse_id");

  // Load order lines when order is selected
  const handleOrderSelect = useCallback(async (option: AutocompleteOption | null) => {
    if (!option) return;
    setSelectedOrderName(option.value);

    try {
      const orderLines = await fetchOrderLines(option.code);
      setLines(orderLines);
    } catch (error) {
      console.error("Error fetching order lines:", error);
    }
  }, [fetchOrderLines]);

  const handleWarehouseSelect = useCallback((option: AutocompleteOption | null) => {
    if (option) {
      setSelectedWarehouseName(option.value);
    }
  }, []);

  const handleCarrierSelect = useCallback((option: AutocompleteOption | null) => {
    if (option) {
      setSelectedCarrierName(option.value);
    }
  }, []);

  // Handle quantity change
  const handleQuantityChange = useCallback((lineId: string, value: number) => {
    setLines(prev => prev.map(line => {
      if (line.line_id !== lineId) return line;
      return { ...line, quantity_shipped: Math.min(value, line.quantity_ordered) };
    }));
  }, []);

  // Open lot picker
  const handleOpenLotPicker = useCallback(async (line: ShipmentLineWithLots) => {
    if (!warehouseId) {
      alert("Seleccione primero una bodega");
      return;
    }

    setCurrentLineForPicking(line);
    setIsLoadingLots(true);

    try {
      const lots = await fetchAvailableLots(line.product_id, warehouseId);
      setAvailableLots(lots);
      setLotPickerOpen(true);
    } catch (error) {
      console.error("Error fetching lots:", error);
    } finally {
      setIsLoadingLots(false);
    }
  }, [warehouseId, fetchAvailableLots]);

  // Handle auto-select lots
  const handleAutoSelectLots = useCallback(async (strategy: "FIFO" | "FEFO") => {
    if (!currentLineForPicking) return;

    setIsLoadingLots(true);
    try {
      const lots = await fetchAvailableLots(currentLineForPicking.product_id, warehouseId, strategy);
      setAvailableLots(lots);

      // Auto-select lots to fulfill quantity
      const autoSelected = new Map<string, SelectedLot>();
      let remaining = currentLineForPicking.quantity_shipped;

      for (const lot of lots) {
        if (remaining <= 0) break;

        const qtyToTake = Math.min(lot.quantity_available, remaining);
        autoSelected.set(lot.lot_id, {
          lot_id: lot.lot_id,
          lot_number: lot.lot_number,
          serial_number: lot.serial_number,
          quantity_to_ship: qtyToTake,
          location_id: lot.location_id,
          location_name: lot.location_name,
        });
        remaining -= qtyToTake;
      }

      // Update the line with auto-selected lots
      setLines(prev => prev.map(line => {
        if (line.line_id !== currentLineForPicking.line_id) return line;

        const selectedArray = Array.from(autoSelected.values());
        const totalQty = selectedArray.reduce((sum, lot) => sum + lot.quantity_to_ship, 0);
        const lotNumbers = [...new Set(selectedArray.map(l => l.lot_number))].join(", ");
        const serialNumbers = selectedArray.map(l => l.serial_number).filter(Boolean).join(", ");

        return {
          ...line,
          quantity_shipped: totalQty,
          lot_number: lotNumbers || undefined,
          serial_number: serialNumbers || undefined,
          selected_lots: selectedArray,
        };
      }));
    } catch (error) {
      console.error("Error auto-selecting lots:", error);
    } finally {
      setIsLoadingLots(false);
    }
  }, [currentLineForPicking, warehouseId, fetchAvailableLots]);

  // Handle lot selection confirm
  const handleLotsConfirm = useCallback((selectedLots: SelectedLot[]) => {
    if (!currentLineForPicking) return;

    setLines(prev => prev.map(line => {
      if (line.line_id !== currentLineForPicking.line_id) return line;

      const totalQty = selectedLots.reduce((sum, lot) => sum + lot.quantity_to_ship, 0);
      const lotNumbers = [...new Set(selectedLots.map(l => l.lot_number))].join(", ");
      const serialNumbers = selectedLots.map(l => l.serial_number).filter(Boolean).join(", ");

      return {
        ...line,
        quantity_shipped: totalQty,
        lot_number: lotNumbers || undefined,
        serial_number: serialNumbers || undefined,
        selected_lots: selectedLots,
      };
    }));

    setCurrentLineForPicking(null);
  }, [currentLineForPicking]);

  const handleSubmit = useCallback((data: ShipmentFormData) => {
    onSubmit(data, lines);
  }, [lines, onSubmit]);

  const totalLines = lines.length;
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity_shipped, 0);

  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => router.push("/dashboard/sales/shipments")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold tracking-tight">
                      {isEdit ? "Editar Despacho" : "Nuevo Despacho"}
                    </h1>
                    {shipmentNumber && (
                      <span className="text-sm font-mono text-muted-foreground">
                        #{shipmentNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prepara el despacho de productos al cliente
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard/sales/shipments")}
                  disabled={isLoading}
                >
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  form="shipment-form"
                  disabled={isLoading || lines.length === 0}
                >
                  {isLoading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Form {...form}>
          <form
            id="shipment-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 overflow-auto"
          >
            <div className="p-6 space-y-6">
              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Order & Shipment Info */}
                  <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Información del Despacho
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name="sales_order_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground">
                                  Orden de Venta <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Autocomplete
                                    searchAction={searchSalesOrders}
                                    returnMode="code"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onSelect={handleOrderSelect}
                                    placeholder="Buscar orden de venta..."
                                    disabled={isLoading || isEdit}
                                    initialDisplayValue={selectedOrderName}
                                    queryKeyPrefix="sales-order"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="shipment_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Fecha de Despacho <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input type="date" className="h-9" {...field} disabled={isLoading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="expected_delivery_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Entrega Esperada
                              </FormLabel>
                              <FormControl>
                                <Input type="date" className="h-9" {...field} disabled={isLoading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name="warehouse_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground">
                                  Bodega de Despacho <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Autocomplete
                                    searchAction={searchWarehouses}
                                    returnMode="code"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onSelect={handleWarehouseSelect}
                                    placeholder="Buscar bodega..."
                                    disabled={isLoading}
                                    initialDisplayValue={selectedWarehouseName}
                                    queryKeyPrefix="warehouse"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Info */}
                  <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-chart-2" />
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Información de Envío
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name="carrier_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground">
                                  Transportadora
                                </FormLabel>
                                <FormControl>
                                  <Autocomplete
                                    searchAction={searchCarriers}
                                    returnMode="code"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    onSelect={handleCarrierSelect}
                                    placeholder="Buscar transportadora..."
                                    disabled={isLoading}
                                    initialDisplayValue={selectedCarrierName}
                                    queryKeyPrefix="carrier"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="tracking_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Número de Guía
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Número de tracking" className="h-9 font-mono" {...field} disabled={isLoading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shipping_cost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Costo de Envío
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  step={100}
                                  placeholder="0"
                                  className="h-9 tabular-nums"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Destination Address */}
                  <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-warning" />
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Dirección de Destino
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2 md:col-span-4">
                          <FormField
                            control={form.control}
                            name="ship_to_address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground">
                                  Dirección
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Calle, número, edificio..." className="h-9" {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="ship_to_city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Ciudad
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Ciudad" className="h-9" {...field} disabled={isLoading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ship_to_state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Departamento
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Departamento" className="h-9" {...field} disabled={isLoading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ship_to_country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                País
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="País" className="h-9" {...field} disabled={isLoading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ship_to_postal_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Código Postal
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Código postal" className="h-9" {...field} disabled={isLoading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-4">
                  <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] sticky top-24">
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-success" />
                    <CardContent className="p-5">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-4">
                        Resumen del Despacho
                      </p>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Líneas</span>
                          <span className="font-semibold tabular-nums">{totalLines}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Unidades a Despachar</span>
                          <span className="font-semibold tabular-nums">{totalQuantity}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex items-center gap-2">
                            <Boxes className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {lines.filter(l => l.selected_lots?.length).length} líneas con lote/serie
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Lines Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Líneas de Despacho
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Productos a despachar de la orden de venta
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="w-12 text-center text-xs font-medium uppercase tracking-wide">
                            #
                          </TableHead>
                          <TableHead className="min-w-[200px] text-xs font-medium uppercase tracking-wide">
                            Producto
                          </TableHead>
                          <TableHead className="w-24 text-center text-xs font-medium uppercase tracking-wide">
                            Pedido
                          </TableHead>
                          <TableHead className="w-32 text-center text-xs font-medium uppercase tracking-wide">
                            A Despachar
                          </TableHead>
                          <TableHead className="min-w-[150px] text-xs font-medium uppercase tracking-wide">
                            Lote / Serial
                          </TableHead>
                          <TableHead className="w-32" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lines.length === 0 ? (
                          <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={6} className="h-32 text-center">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <div className="rounded-full bg-muted p-3">
                                  <Package className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium">Sin líneas</p>
                                <p className="text-xs text-muted-foreground">
                                  Selecciona una orden de venta para cargar las líneas
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          lines.map((line) => (
                            <TableRow key={line.line_id}>
                              <TableCell className="text-center text-sm font-mono text-muted-foreground">
                                {line.line_number}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-sm">{line.product?.name || line.description}</div>
                                  {line.product?.sku && (
                                    <div className="font-mono text-xs text-muted-foreground">{line.product.sku}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="font-mono text-sm tabular-nums">{line.quantity_ordered}</span>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min={0}
                                  max={line.quantity_ordered}
                                  value={line.quantity_shipped}
                                  onChange={(e) => handleQuantityChange(line.line_id, e.target.valueAsNumber || 0)}
                                  disabled={isLoading}
                                  className="h-9 w-24 text-center tabular-nums mx-auto"
                                />
                              </TableCell>
                              <TableCell>
                                {line.selected_lots?.length ? (
                                  <div className="flex flex-wrap gap-1">
                                    {line.selected_lots.slice(0, 2).map((lot, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs font-mono">
                                        {lot.serial_number || lot.lot_number}
                                      </Badge>
                                    ))}
                                    {line.selected_lots.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{line.selected_lots.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-sm">No asignado</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {line.tracking_type !== "none" && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenLotPicker(line)}
                                    disabled={isLoading || !warehouseId || isLoadingLots}
                                  >
                                    {isLoadingLots && currentLineForPicking?.line_id === line.line_id ? (
                                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Boxes className="mr-1.5 h-3.5 w-3.5" />
                                    )}
                                    {line.tracking_type === "serial" ? "Seriales" : "Lotes"}
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        Notas para el Cliente
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notas visibles en el documento de despacho"
                          rows={3}
                          className="resize-none"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="internal_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        Notas Internas
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notas internas (no visibles para el cliente)"
                          rows={3}
                          className="resize-none"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Lot/Serial Picker Modal */}
      {currentLineForPicking && (
        <LotSerialPickerModal
          open={lotPickerOpen}
          onOpenChange={setLotPickerOpen}
          productId={currentLineForPicking.product_id}
          productName={currentLineForPicking.product?.name || currentLineForPicking.description}
          productSku={currentLineForPicking.product?.sku}
          warehouseId={warehouseId}
          quantityRequired={currentLineForPicking.quantity_shipped}
          trackingType={currentLineForPicking.tracking_type || "lot"}
          availableLots={availableLots}
          selectedLots={currentLineForPicking.selected_lots || []}
          onConfirm={handleLotsConfirm}
          onAutoSelect={handleAutoSelectLots}
          isLoading={isLoadingLots}
        />
      )}
    </>
  );
}
