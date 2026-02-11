"use client";

import { useState, useCallback } from "react";
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
  ClipboardCheck,
  AlertTriangle,
  Check,
  XCircle,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Autocomplete } from "@/shared/presentation/components/autocomplete/Autocomplete";
import type { Receipt, ReceiptLine } from "../../domain/entities/receipt.entity";
import type { AutocompleteOption } from "@/shared/presentation/types/autocomplete.types";

const receiptSchema = z.object({
  purchase_order_id: z.string().min(1, "Orden de compra requerida"),
  receipt_date: z.string().min(1, "Fecha de recepción requerida"),
  warehouse_id: z.string().min(1, "Bodega requerida"),
  delivery_note_number: z.string().optional(),
  carrier: z.string().optional(),
  tracking_number: z.string().optional(),
  requires_inspection: z.boolean(),
  notes: z.string().optional(),
  internal_notes: z.string().optional(),
});

type ReceiptFormData = z.infer<typeof receiptSchema>;

interface ReceiptLineWithDetails extends ReceiptLine {
  lot_entries?: Array<{
    lot_number: string;
    serial_number?: string;
    quantity: number;
    expiration_date?: string;
    manufacture_date?: string;
    location_id?: string;
    location_name?: string;
  }>;
  product?: {
    product_id: string;
    sku: string;
    name: string;
    is_lot_tracked?: boolean;
    is_serial_tracked?: boolean;
  };
}

interface ReceiptFormPageProps {
  defaultValues?: Partial<Receipt>;
  defaultLines?: ReceiptLineWithDetails[];
  onSubmit: (data: ReceiptFormData, lines: ReceiptLineWithDetails[]) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  receiptNumber?: string;
  searchPurchaseOrders: (query: string) => Promise<AutocompleteOption[]>;
  searchWarehouses: (query: string) => Promise<AutocompleteOption[]>;
  searchLocations: (query: string, warehouseId: string) => Promise<AutocompleteOption[]>;
  fetchOrderLines: (orderId: string) => Promise<ReceiptLineWithDetails[]>;
}

export function ReceiptFormPage({
  defaultValues,
  defaultLines = [],
  onSubmit,
  isLoading,
  isEdit,
  receiptNumber,
  searchPurchaseOrders,
  searchWarehouses,
  searchLocations,
  fetchOrderLines,
}: ReceiptFormPageProps) {
  const router = useRouter();
  const [lines, setLines] = useState<ReceiptLineWithDetails[]>(defaultLines);
  const [selectedOrderName, setSelectedOrderName] = useState<string | undefined>(
    defaultValues?.purchase_order?.order_number
  );
  const [selectedWarehouseName, setSelectedWarehouseName] = useState<string | undefined>(
    defaultValues?.warehouse?.name
  );

  const form = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      purchase_order_id: defaultValues?.purchase_order_id || "",
      receipt_date: defaultValues?.receipt_date || new Date().toISOString().split("T")[0],
      warehouse_id: defaultValues?.warehouse_id || "",
      delivery_note_number: defaultValues?.delivery_note_number || "",
      carrier: defaultValues?.carrier || "",
      tracking_number: defaultValues?.tracking_number || "",
      requires_inspection: defaultValues?.requires_inspection || false,
      notes: defaultValues?.notes || "",
      internal_notes: defaultValues?.internal_notes || "",
    },
  });

  const warehouseId = form.watch("warehouse_id");
  const requiresInspection = form.watch("requires_inspection");

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

  // Handle quantity changes
  const handleQuantityReceived = useCallback((lineId: string, value: number) => {
    setLines(prev => prev.map(line => {
      if (line.line_id !== lineId) return line;
      return {
        ...line,
        quantity_received: Math.min(value, line.quantity_ordered),
        quantity_accepted: Math.min(value, line.quantity_ordered),
        quantity_rejected: 0,
      };
    }));
  }, []);

  const handleQuantityAccepted = useCallback((lineId: string, value: number) => {
    setLines(prev => prev.map(line => {
      if (line.line_id !== lineId) return line;
      const accepted = Math.min(value, line.quantity_received);
      return {
        ...line,
        quantity_accepted: accepted,
        quantity_rejected: line.quantity_received - accepted,
      };
    }));
  }, []);

  // Handle lot/serial entry
  const handleLotNumberChange = useCallback((lineId: string, value: string) => {
    setLines(prev => prev.map(line => {
      if (line.line_id !== lineId) return line;
      return { ...line, lot_number: value };
    }));
  }, []);

  const handleSerialNumberChange = useCallback((lineId: string, value: string) => {
    setLines(prev => prev.map(line => {
      if (line.line_id !== lineId) return line;
      return { ...line, serial_number: value };
    }));
  }, []);

  const handleExpirationChange = useCallback((lineId: string, value: string) => {
    setLines(prev => prev.map(line => {
      if (line.line_id !== lineId) return line;
      return { ...line, expiration_date: value };
    }));
  }, []);

  const handleManufactureDateChange = useCallback((lineId: string, value: string) => {
    setLines(prev => prev.map(line => {
      if (line.line_id !== lineId) return line;
      return { ...line, manufacture_date: value };
    }));
  }, []);

  const handleInspectionStatusChange = useCallback((lineId: string, value: string) => {
    setLines(prev => prev.map(line => {
      if (line.line_id !== lineId) return line;
      return { ...line, inspection_status: value as ReceiptLine["inspection_status"] };
    }));
  }, []);

  const handleSubmit = useCallback((data: ReceiptFormData) => {
    onSubmit(data, lines);
  }, [lines, onSubmit]);

  const totalLines = lines.length;
  const totalOrdered = lines.reduce((sum, line) => sum + line.quantity_ordered, 0);
  const totalReceived = lines.reduce((sum, line) => sum + line.quantity_received, 0);
  const totalAccepted = lines.reduce((sum, line) => sum + line.quantity_accepted, 0);
  const totalRejected = lines.reduce((sum, line) => sum + line.quantity_rejected, 0);

  return (
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
                onClick={() => router.push("/dashboard/purchasing/receipts")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {isEdit ? "Editar Recepción" : "Nueva Recepción"}
                  </h1>
                  {receiptNumber && (
                    <span className="text-sm font-mono text-muted-foreground">
                      #{receiptNumber}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Registra la recepción de mercancía del proveedor
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/purchasing/receipts")}
                disabled={isLoading}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                form="receipt-form"
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
          id="receipt-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex-1 overflow-auto"
        >
          <div className="p-6 space-y-6">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Order & Receipt Info */}
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Información de la Recepción
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="purchase_order_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Orden de Compra <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Autocomplete
                                  searchAction={searchPurchaseOrders}
                                  returnMode="code"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onSelect={handleOrderSelect}
                                  placeholder="Buscar orden de compra..."
                                  disabled={isLoading || isEdit}
                                  initialDisplayValue={selectedOrderName}
                                  queryKeyPrefix="purchase-order"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="receipt_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Fecha de Recepción <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="date" className="h-9" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="col-span-2 md:col-span-1">
                        <FormField
                          control={form.control}
                          name="warehouse_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Bodega <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Autocomplete
                                  searchAction={searchWarehouses}
                                  returnMode="code"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onSelect={handleWarehouseSelect}
                                  placeholder="Bodega..."
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

                {/* Delivery Info */}
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-chart-2" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Información del Transporte
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="delivery_note_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Número de Remisión
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Remisión del proveedor" className="h-9 font-mono" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="carrier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Transportadora
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre de transportadora" className="h-9" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                    </div>
                  </CardContent>
                </Card>

                {/* Inspection Toggle */}
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-warning" />
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-warning/10 p-2">
                          <ClipboardCheck className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Inspección de Calidad</p>
                          <p className="text-xs text-muted-foreground">
                            Requiere revisión de calidad antes de confirmar la recepción
                          </p>
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name="requires_inspection"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isLoading}
                              />
                            </FormControl>
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
                      Resumen de Recepción
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Líneas</span>
                        <span className="font-semibold tabular-nums">{totalLines}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ordenado</span>
                        <span className="font-semibold tabular-nums">{totalOrdered}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Recibido</span>
                        <span className="font-semibold tabular-nums">{totalReceived}</span>
                      </div>
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-success" />
                            <span className="text-muted-foreground">Aceptado</span>
                          </div>
                          <span className="font-semibold tabular-nums text-success">{totalAccepted}</span>
                        </div>
                        {totalRejected > 0 && (
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1.5">
                              <XCircle className="h-3.5 w-3.5 text-destructive" />
                              <span className="text-muted-foreground">Rechazado</span>
                            </div>
                            <span className="font-semibold tabular-nums text-destructive">{totalRejected}</span>
                          </div>
                        )}
                      </div>
                      {requiresInspection && (
                        <div className="pt-2 border-t">
                          <Badge variant="outline" className="bg-warning/15 text-warning border-0">
                            <ClipboardCheck className="mr-1.5 h-3 w-3" />
                            Requiere inspección
                          </Badge>
                        </div>
                      )}
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
                    Líneas de Recepción
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Productos recibidos de la orden de compra
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
                        <TableHead className="min-w-[180px] text-xs font-medium uppercase tracking-wide">
                          Producto
                        </TableHead>
                        <TableHead className="w-20 text-center text-xs font-medium uppercase tracking-wide">
                          Pedido
                        </TableHead>
                        <TableHead className="w-28 text-center text-xs font-medium uppercase tracking-wide">
                          Recibido
                        </TableHead>
                        <TableHead className="w-28 text-center text-xs font-medium uppercase tracking-wide">
                          Aceptado
                        </TableHead>
                        <TableHead className="min-w-[120px] text-xs font-medium uppercase tracking-wide">
                          Lote
                        </TableHead>
                        <TableHead className="min-w-[120px] text-xs font-medium uppercase tracking-wide">
                          Serial
                        </TableHead>
                        <TableHead className="w-32 text-xs font-medium uppercase tracking-wide">
                          Vencimiento
                        </TableHead>
                        <TableHead className="w-32 text-xs font-medium uppercase tracking-wide">
                          F. Fabricación
                        </TableHead>
                        {requiresInspection && (
                          <TableHead className="w-32 text-xs font-medium uppercase tracking-wide">
                            Inspección
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={requiresInspection ? 10 : 9} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="rounded-full bg-muted p-3">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <p className="text-sm font-medium">Sin líneas</p>
                              <p className="text-xs text-muted-foreground">
                                Selecciona una orden de compra para cargar las líneas
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
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{line.product?.name || line.description}</span>
                                  {(line.product?.is_lot_tracked || line.product?.is_serial_tracked) && (
                                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-primary/10 text-primary border-primary/20">
                                      <Boxes className="h-2.5 w-2.5 mr-0.5" />
                                      {line.product?.is_serial_tracked ? "Serie" : "Lote"}
                                    </Badge>
                                  )}
                                </div>
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
                                value={line.quantity_received}
                                onChange={(e) => handleQuantityReceived(line.line_id, e.target.valueAsNumber || 0)}
                                disabled={isLoading}
                                className="h-8 w-20 text-center tabular-nums mx-auto"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={0}
                                max={line.quantity_received}
                                value={line.quantity_accepted}
                                onChange={(e) => handleQuantityAccepted(line.line_id, e.target.valueAsNumber || 0)}
                                disabled={isLoading}
                                className="h-8 w-20 text-center tabular-nums mx-auto"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={line.lot_number || ""}
                                onChange={(e) => handleLotNumberChange(line.line_id, e.target.value)}
                                placeholder={line.product?.is_lot_tracked ? "Lote (requerido)" : "Lote"}
                                className={`h-8 font-mono text-xs ${line.product?.is_lot_tracked && !line.lot_number ? "border-warning" : ""}`}
                                disabled={isLoading}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={line.serial_number || ""}
                                onChange={(e) => handleSerialNumberChange(line.line_id, e.target.value)}
                                placeholder={line.product?.is_serial_tracked ? "Serial (requerido)" : "Serial"}
                                className={`h-8 font-mono text-xs ${line.product?.is_serial_tracked && !line.serial_number ? "border-warning" : ""}`}
                                disabled={isLoading}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={line.expiration_date || ""}
                                onChange={(e) => handleExpirationChange(line.line_id, e.target.value)}
                                className="h-8 text-xs"
                                disabled={isLoading}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={line.manufacture_date || ""}
                                onChange={(e) => handleManufactureDateChange(line.line_id, e.target.value)}
                                className="h-8 text-xs"
                                disabled={isLoading}
                              />
                            </TableCell>
                            {requiresInspection && (
                              <TableCell>
                                <Select
                                  value={line.inspection_status || "pending"}
                                  onValueChange={(value) => handleInspectionStatusChange(line.line_id, value)}
                                  disabled={isLoading}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pendiente</SelectItem>
                                    <SelectItem value="passed">Aprobado</SelectItem>
                                    <SelectItem value="failed">Rechazado</SelectItem>
                                    <SelectItem value="partial">Parcial</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            )}
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
                      Notas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observaciones sobre la recepción"
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
                        placeholder="Notas internas del equipo"
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
  );
}
