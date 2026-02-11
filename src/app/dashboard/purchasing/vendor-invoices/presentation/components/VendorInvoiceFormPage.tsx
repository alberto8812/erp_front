"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  Building2,
  FileText,
  Package,
  Calculator,
  Plus,
  Trash2,
  Link2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Autocomplete } from "@/shared/presentation/components/autocomplete/Autocomplete";
import type { VendorInvoice, VendorInvoiceLine } from "../../domain/entities/vendor-invoice.entity";
import type { AutocompleteOption } from "@/shared/presentation/types/autocomplete.types";
import { cn } from "@/lib/utils";

const invoiceLineSchema = z.object({
  product_id: z.string().optional(),
  description: z.string().min(1, "Descripción requerida"),
  quantity: z.coerce.number().min(0.01, "Cantidad debe ser mayor a 0"),
  unit_price: z.coerce.number().min(0, "Precio debe ser mayor o igual a 0"),
  discount_percent: z.coerce.number().min(0).max(100),
  tax_amount: z.coerce.number().min(0),
  po_line_id: z.string().optional(),
  receipt_line_id: z.string().optional(),
});

const invoiceSchema = z.object({
  vendor_id: z.string().min(1, "Proveedor requerido"),
  vendor_invoice_ref: z.string().optional(),
  invoice_date: z.string().min(1, "Fecha de factura requerida"),
  due_date: z.string().min(1, "Fecha de vencimiento requerida"),
  payment_term_id: z.string().optional(),
  currency: z.string(),
  primary_po_id: z.string().optional(),
  notes: z.string().optional(),
  internal_notes: z.string().optional(),
  lines: z.array(invoiceLineSchema).min(1, "Debe agregar al menos una línea"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface VendorInvoiceFormPageProps {
  defaultValues?: Partial<VendorInvoice>;
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  invoiceNumber?: string;
  searchVendors: (query: string) => Promise<AutocompleteOption[]>;
  searchProducts: (query: string) => Promise<AutocompleteOption[]>;
  searchPurchaseOrders: (query: string) => Promise<AutocompleteOption[]>;
  searchPaymentTerms: (query: string) => Promise<AutocompleteOption[]>;
}

// Format currency
function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function VendorInvoiceFormPage({
  defaultValues,
  onSubmit,
  isLoading,
  isEdit,
  invoiceNumber,
  searchVendors,
  searchProducts,
  searchPurchaseOrders,
  searchPaymentTerms,
}: VendorInvoiceFormPageProps) {
  const router = useRouter();
  const [selectedVendorName, setSelectedVendorName] = useState<string | undefined>(
    defaultValues?.vendor?.comercial_name || defaultValues?.vendor?.legal_name
  );

  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      vendor_id: defaultValues?.vendor_id || "",
      vendor_invoice_ref: defaultValues?.vendor_invoice_ref || "",
      invoice_date: defaultValues?.invoice_date || new Date().toISOString().split("T")[0],
      due_date: defaultValues?.due_date || "",
      payment_term_id: defaultValues?.payment_term_id || "",
      currency: defaultValues?.currency || "COP",
      primary_po_id: defaultValues?.primary_po_id || "",
      notes: defaultValues?.notes || "",
      internal_notes: defaultValues?.internal_notes || "",
      lines: defaultValues?.lines?.map((line) => ({
        product_id: line.product_id || "",
        description: line.description,
        quantity: line.quantity,
        unit_price: line.unit_price,
        discount_percent: line.discount_percent,
        tax_amount: line.tax_amount,
        po_line_id: line.po_line_id || "",
        receipt_line_id: line.receipt_line_id || "",
      })) || [
        {
          product_id: "",
          description: "",
          quantity: 1,
          unit_price: 0,
          discount_percent: 0,
          tax_amount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  const watchedLines = form.watch("lines");
  const currency = form.watch("currency");

  // Calculate totals
  const calculateLineTotal = (line: typeof watchedLines[0]) => {
    const subtotal = line.quantity * line.unit_price;
    const discount = subtotal * (line.discount_percent / 100);
    return subtotal - discount + (line.tax_amount || 0);
  };

  const subtotal = watchedLines.reduce((acc, line) => {
    return acc + line.quantity * line.unit_price;
  }, 0);

  const discountTotal = watchedLines.reduce((acc, line) => {
    return acc + (line.quantity * line.unit_price * line.discount_percent) / 100;
  }, 0);

  const taxTotal = watchedLines.reduce((acc, line) => acc + (line.tax_amount || 0), 0);
  const totalAmount = subtotal - discountTotal + taxTotal;

  const handleVendorSelect = useCallback((option: AutocompleteOption | null) => {
    if (option) {
      setSelectedVendorName(option.value);
    }
  }, []);

  const handleAddLine = () => {
    append({
      product_id: "",
      description: "",
      quantity: 1,
      unit_price: 0,
      discount_percent: 0,
      tax_amount: 0,
    });
  };

  const handleFormSubmit = (data: Record<string, unknown>) => {
    onSubmit(data);
  };

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
                onClick={() => router.push("/dashboard/purchasing/vendor-invoices")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {isEdit ? "Editar Factura" : "Nueva Factura de Proveedor"}
                  </h1>
                  {invoiceNumber && (
                    <span className="text-sm font-mono text-muted-foreground">
                      #{invoiceNumber}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Registra una factura de proveedor para conciliación
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/purchasing/vendor-invoices")}
                disabled={isLoading}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                form="invoice-form"
                disabled={isLoading}
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
          id="invoice-form"
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-auto"
        >
          <div className="p-6 space-y-6">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-8 space-y-6">
                {/* Vendor Information */}
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Información del Proveedor
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="vendor_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-muted-foreground">
                                Proveedor <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Autocomplete
                                  searchAction={searchVendors}
                                  returnMode="code"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onSelect={handleVendorSelect}
                                  placeholder="Buscar proveedor..."
                                  disabled={isLoading || isEdit}
                                  initialDisplayValue={selectedVendorName}
                                  queryKeyPrefix="vendor"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="vendor_invoice_ref"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Ref. Factura Proveedor
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej: FAC-12345"
                                className="h-9"
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
                        name="primary_po_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Orden de Compra
                            </FormLabel>
                            <FormControl>
                              <Autocomplete
                                searchAction={searchPurchaseOrders}
                                returnMode="code"
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Vincular OC..."
                                disabled={isLoading}
                                queryKeyPrefix="po"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Details */}
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-chart-2" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Detalles de Factura
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="invoice_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Fecha Factura <span className="text-destructive">*</span>
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
                        name="due_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Fecha Vencimiento <span className="text-destructive">*</span>
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
                        name="payment_term_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Condición de Pago
                            </FormLabel>
                            <FormControl>
                              <Autocomplete
                                searchAction={searchPaymentTerms}
                                returnMode="code"
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Seleccionar..."
                                disabled={isLoading}
                                queryKeyPrefix="paymentterm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">
                              Moneda
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                                <SelectItem value="USD">USD - Dólar</SelectItem>
                                <SelectItem value="EUR">EUR - Euro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Lines */}
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-chart-3" />
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Líneas de Factura
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddLine}
                        disabled={isLoading}
                      >
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Agregar Línea
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-[300px]">Descripción</TableHead>
                            <TableHead className="w-[100px] text-right">Cantidad</TableHead>
                            <TableHead className="w-[120px] text-right">Precio Unit.</TableHead>
                            <TableHead className="w-[80px] text-right">Desc. %</TableHead>
                            <TableHead className="w-[100px] text-right">Impuesto</TableHead>
                            <TableHead className="w-[120px] text-right">Total</TableHead>
                            <TableHead className="w-[50px]" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => {
                            const line = watchedLines[index];
                            const lineTotal = line ? calculateLineTotal(line) : 0;

                            return (
                              <TableRow key={field.id}>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`lines.${index}.description`}
                                    render={({ field }) => (
                                      <FormItem className="space-y-0">
                                        <FormControl>
                                          <Input
                                            placeholder="Descripción del producto/servicio"
                                            className="h-8 text-sm"
                                            {...field}
                                            disabled={isLoading}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`lines.${index}.quantity`}
                                    render={({ field }) => (
                                      <FormItem className="space-y-0">
                                        <FormControl>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="h-8 text-sm text-right tabular-nums"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            disabled={isLoading}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`lines.${index}.unit_price`}
                                    render={({ field }) => (
                                      <FormItem className="space-y-0">
                                        <FormControl>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="h-8 text-sm text-right tabular-nums"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            disabled={isLoading}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`lines.${index}.discount_percent`}
                                    render={({ field }) => (
                                      <FormItem className="space-y-0">
                                        <FormControl>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            className="h-8 text-sm text-right tabular-nums"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            disabled={isLoading}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`lines.${index}.tax_amount`}
                                    render={({ field }) => (
                                      <FormItem className="space-y-0">
                                        <FormControl>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="h-8 text-sm text-right tabular-nums"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            disabled={isLoading}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell className="text-right font-medium tabular-nums">
                                  {formatCurrency(lineTotal, currency)}
                                </TableCell>
                                <TableCell>
                                  {fields.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-destructive"
                                      onClick={() => remove(index)}
                                      disabled={isLoading}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    {form.formState.errors.lines && (
                      <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {form.formState.errors.lines.message}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            placeholder="Notas visibles en la factura..."
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
                            placeholder="Notas solo para uso interno..."
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

              {/* Right Column - Summary */}
              <div className="lg:col-span-4">
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] sticky top-24">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-success" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Calculator className="h-4 w-4 text-muted-foreground" />
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Resumen
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-mono tabular-nums">{formatCurrency(subtotal, currency)}</span>
                      </div>
                      {discountTotal > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Descuentos</span>
                          <span className="font-mono tabular-nums text-destructive">
                            -{formatCurrency(discountTotal, currency)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Impuestos</span>
                        <span className="font-mono tabular-nums">{formatCurrency(taxTotal, currency)}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total</span>
                          <span className="text-xl font-bold tabular-nums">
                            {formatCurrency(totalAmount, currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Link2 className="h-3.5 w-3.5" />
                        <span>
                          {watchedLines.length} línea{watchedLines.length !== 1 ? "s" : ""} en esta factura
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
