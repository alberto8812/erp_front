"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Plus, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import { Autocomplete } from "../autocomplete/Autocomplete";
import { buildZodSchema } from "../../validators/build-zod-schema";
import type { FormConfig, FormFieldConfig } from "../../types/form-config.types";
import type { AutocompleteOption } from "../../types/autocomplete.types";
import {
  type OrderLine,
  createEmptyLine,
  calculateLineTotals,
  calculateOrderTotals,
} from "../order-lines/types";

interface OrderFormPageProps {
  title: string;
  subtitle?: string;
  backUrl: string;
  formConfig: FormConfig;
  defaultValues?: Record<string, unknown>;
  defaultLines?: OrderLine[];
  onSubmit: (data: Record<string, unknown>, lines: OrderLine[]) => void;
  isLoading?: boolean;
  searchProducts: (query: string) => Promise<AutocompleteOption[]>;
  searchWarehouses?: (query: string) => Promise<AutocompleteOption[]>;
  searchUom?: (query: string) => Promise<AutocompleteOption[]>;
  searchTaxCodes?: (query: string) => Promise<AutocompleteOption[]>;
  warehouseLabel?: string;
  currency?: string;
  orderNumber?: string;
}

function FieldRenderer({
  fieldConfig,
  control,
  isLoading,
  defaultValues,
}: {
  fieldConfig: FormFieldConfig;
  control: Control<FieldValues>;
  isLoading?: boolean;
  defaultValues?: Record<string, unknown>;
}) {
  const getInitialDisplayValue = () => {
    if (fieldConfig.type !== "autocomplete" || !fieldConfig.autocompleteConfig) {
      return undefined;
    }
    if (fieldConfig.autocompleteConfig.initialDisplayValue) {
      return fieldConfig.autocompleteConfig.initialDisplayValue;
    }
    if (fieldConfig.autocompleteConfig.initialDisplayValueField && defaultValues) {
      const fieldValue = defaultValues[fieldConfig.autocompleteConfig.initialDisplayValueField];
      return typeof fieldValue === "string" ? fieldValue : undefined;
    }
    return undefined;
  };

  return (
    <FormField
      key={fieldConfig.name}
      control={control}
      name={fieldConfig.name}
      render={({ field }) => (
        <FormItem>
          {fieldConfig.type !== "boolean" && (
            <FormLabel className="text-xs font-medium text-muted-foreground">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-destructive ml-0.5">*</span>}
            </FormLabel>
          )}
          <FormControl>
            {fieldConfig.type === "text" || fieldConfig.type === "date" || fieldConfig.type === "uuid" ? (
              <Input
                placeholder={fieldConfig.placeholder ?? ""}
                type={fieldConfig.type === "date" ? "date" : "text"}
                disabled={isLoading}
                className="h-9"
                {...field}
                value={(field.value as string) ?? ""}
              />
            ) : fieldConfig.type === "number" ? (
              <Input
                type="number"
                placeholder={fieldConfig.placeholder ?? ""}
                disabled={isLoading}
                className="h-9"
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                value={(field.value as number) ?? ""}
              />
            ) : fieldConfig.type === "textarea" ? (
              <Textarea
                placeholder={fieldConfig.placeholder ?? ""}
                disabled={isLoading}
                rows={2}
                className="resize-none"
                {...field}
                value={(field.value as string) ?? ""}
              />
            ) : fieldConfig.type === "select" ? (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}
                disabled={isLoading}
              >
                <SelectTrigger className="h-9">
                  <SelectValue
                    placeholder={
                      fieldConfig.placeholder ??
                      `Seleccione ${fieldConfig.label.toLowerCase()}`
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {fieldConfig.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : fieldConfig.type === "autocomplete" && fieldConfig.autocompleteConfig ? (
              <Autocomplete
                searchAction={fieldConfig.autocompleteConfig.searchAction}
                returnMode={fieldConfig.autocompleteConfig.returnMode}
                value={field.value as string}
                onChange={field.onChange}
                onSelect={fieldConfig.autocompleteConfig.onSelect}
                placeholder={
                  fieldConfig.autocompleteConfig.placeholder ?? fieldConfig.placeholder
                }
                disabled={isLoading}
                minChars={fieldConfig.autocompleteConfig.minChars}
                debounceMs={fieldConfig.autocompleteConfig.debounceMs}
                initialDisplayValue={getInitialDisplayValue()}
                queryKeyPrefix={fieldConfig.name}
              />
            ) : fieldConfig.type === "boolean" ? (
              <div className="flex items-center gap-2 pt-0.5">
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">
                  {fieldConfig.label}
                </span>
              </div>
            ) : (
              <Input
                disabled={isLoading}
                className="h-9"
                {...field}
                value={(field.value as string) ?? ""}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function cleanFormData(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === "" || value === null) {
      continue;
    }
    cleaned[key] = value;
  }
  return cleaned;
}

export function OrderFormPage({
  title,
  subtitle,
  backUrl,
  formConfig,
  defaultValues,
  defaultLines = [],
  onSubmit,
  isLoading,
  searchProducts,
  searchWarehouses,
  searchUom,
  searchTaxCodes,
  warehouseLabel = "Almacén",
  currency = "COP",
  orderNumber,
}: OrderFormPageProps) {
  const router = useRouter();
  const [lines, setLines] = useState<OrderLine[]>(defaultLines);

  const allFields = formConfig.sections
    ? formConfig.sections.flatMap((s) => s.fields)
    : formConfig.fields;

  const schema = buildZodSchema(allFields);

  const computedDefaults: Record<string, unknown> = {};
  for (const field of allFields) {
    computedDefaults[field.name] =
      defaultValues?.[field.name] ?? field.defaultValue ?? (field.type === "boolean" ? false : "");
  }

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: computedDefaults,
  });

  useEffect(() => {
    setLines(defaultLines);
    form.reset(computedDefaults);
  }, [defaultValues]);

  const handleSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const cleanedData = cleanFormData(data);
      const totals = calculateOrderTotals(lines);
      const dataWithTotals = {
        ...cleanedData,
        subtotal: totals.subtotal,
        discount_amount: totals.discount_amount,
        tax_amount: totals.tax_amount,
        total_amount: totals.total_amount,
      };
      onSubmit(dataWithTotals, lines);
    },
    [lines, onSubmit]
  );

  const handleAddLine = useCallback(() => {
    const newLine = createEmptyLine(lines.length + 1);
    setLines([...lines, newLine]);
  }, [lines]);

  const handleRemoveLine = useCallback(
    (id: string) => {
      const updatedLines = lines
        .filter((line) => line.id !== id)
        .map((line, index) => ({ ...line, line_number: index + 1 }));
      setLines(updatedLines);
    },
    [lines]
  );

  const handleLineChange = useCallback(
    (id: string, field: keyof OrderLine, value: unknown) => {
      const updatedLines = lines.map((line) => {
        if (line.id !== id) return line;
        const updatedLine = { ...line, [field]: value };
        if (["quantity", "unit_price", "discount_percent", "tax_percent"].includes(field)) {
          return calculateLineTotals(updatedLine);
        }
        return updatedLine;
      });
      setLines(updatedLines);
    },
    [lines]
  );

  const handleProductSelect = useCallback(
    (id: string, option: AutocompleteOption | null) => {
      if (!option) return;
      const updatedLines = lines.map((line) => {
        if (line.id !== id) return line;
        const updatedLine = {
          ...line,
          product_id: option.code,
          product_name: option.value,
          product_sku: option.meta?.sku as string | undefined,
          description: option.value,
          unit_price: (option.meta?.base_price as number) || 0,
        };
        return calculateLineTotals(updatedLine);
      });
      setLines(updatedLines);
    },
    [lines]
  );

  const handleWarehouseSelect = useCallback(
    (id: string, option: AutocompleteOption | null) => {
      if (!option) return;
      const updatedLines = lines.map((line) => {
        if (line.id !== id) return line;
        return {
          ...line,
          warehouse_id: option.code,
          warehouse_name: option.value,
        };
      });
      setLines(updatedLines);
    },
    [lines]
  );

  const handleUomSelect = useCallback(
    (id: string, option: AutocompleteOption | null) => {
      if (!option) return;
      const updatedLines = lines.map((line) => {
        if (line.id !== id) return line;
        return {
          ...line,
          uom_id: option.code,
          uom_name: option.value,
        };
      });
      setLines(updatedLines);
    },
    [lines]
  );

  const handleTaxCodeSelect = useCallback(
    (id: string, option: AutocompleteOption | null) => {
      if (!option) return;
      const taxRate = (option.meta?.tax_rate as number) || 0;
      const updatedLines = lines.map((line) => {
        if (line.id !== id) return line;
        const updatedLine = {
          ...line,
          tax_code_id: option.code,
          tax_code_name: option.value,
          tax_percent: taxRate,
        };
        return calculateLineTotals(updatedLine);
      });
      setLines(updatedLines);
    },
    [lines]
  );

  const totals = calculateOrderTotals(lines);

  // Group fields by section for the header area
  const headerSections = formConfig.sections?.filter(
    (s) => s.title !== "Notas"
  ) || [];
  const notesSections = formConfig.sections?.filter(
    (s) => s.title === "Notas"
  ) || [];

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
                onClick={() => router.push(backUrl)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
                  {orderNumber && (
                    <span className="text-sm font-mono text-muted-foreground">
                      #{orderNumber}
                    </span>
                  )}
                </div>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push(backUrl)}
                disabled={isLoading}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                form="order-form"
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
          id="order-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex-1 overflow-auto"
        >
          <div className="p-6 space-y-6">
            {/* Header Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Main info */}
              <div className="lg:col-span-8 space-y-6">
                {headerSections.map((section) => {
                  const regularFields = section.fields.filter(
                    (f) => !f.hidden && f.type !== "boolean"
                  );
                  const booleanFields = section.fields.filter(
                    (f) => !f.hidden && f.type === "boolean"
                  );

                  return (
                    <Card key={section.title} className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                      <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                      <CardContent className="p-5">
                        <div className="mb-4">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {section.title}
                          </p>
                          {section.description && (
                            <p className="mt-0.5 text-xs text-muted-foreground/70">
                              {section.description}
                            </p>
                          )}
                        </div>
                        {regularFields.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {regularFields.map((fieldConfig) => (
                              <div
                                key={fieldConfig.name}
                                className={
                                  fieldConfig.gridCols === 2
                                    ? "col-span-2"
                                    : "col-span-2 sm:col-span-1"
                                }
                              >
                                <FieldRenderer
                                  fieldConfig={fieldConfig}
                                  control={form.control}
                                  isLoading={isLoading}
                                  defaultValues={defaultValues}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {booleanFields.length > 0 && (
                          <div
                            className={`flex flex-wrap items-center gap-5 ${
                              regularFields.length > 0
                                ? "mt-4 pt-4 border-t border-dashed"
                                : ""
                            }`}
                          >
                            {booleanFields.map((fieldConfig) => (
                              <FieldRenderer
                                key={fieldConfig.name}
                                fieldConfig={fieldConfig}
                                control={form.control}
                                isLoading={isLoading}
                                defaultValues={defaultValues}
                              />
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Right Column: Totals Summary */}
              <div className="lg:col-span-4">
                <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] sticky top-24">
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-success" />
                  <CardContent className="p-5">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-4">
                      Resumen
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-mono tabular-nums">
                          {formatCurrency(totals.subtotal, currency)}
                        </span>
                      </div>
                      {totals.discount_amount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Descuento</span>
                          <span className="font-mono tabular-nums text-destructive">
                            -{formatCurrency(totals.discount_amount, currency)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Impuestos</span>
                        <span className="font-mono tabular-nums">
                          {formatCurrency(totals.tax_amount, currency)}
                        </span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-mono text-xl font-semibold tabular-nums tracking-tight">
                            {formatCurrency(totals.total_amount, currency)}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right pt-1">
                        {totals.line_count} línea{totals.line_count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Order Lines Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Líneas de Detalle
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Productos y cantidades de la orden
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

              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-12 text-center text-xs font-medium uppercase tracking-wide">
                          #
                        </TableHead>
                        <TableHead className="min-w-[220px] text-xs font-medium uppercase tracking-wide">
                          Producto
                        </TableHead>
                        <TableHead className="min-w-[180px] text-xs font-medium uppercase tracking-wide">
                          Descripción
                        </TableHead>
                        <TableHead className="w-24 text-center text-xs font-medium uppercase tracking-wide">
                          Cant.
                        </TableHead>
                        {searchUom && (
                          <TableHead className="min-w-[120px] text-xs font-medium uppercase tracking-wide">
                            UOM
                          </TableHead>
                        )}
                        <TableHead className="w-32 text-right text-xs font-medium uppercase tracking-wide">
                          Precio Unit.
                        </TableHead>
                        <TableHead className="w-20 text-center text-xs font-medium uppercase tracking-wide">
                          Dto.%
                        </TableHead>
                        {searchTaxCodes && (
                          <TableHead className="min-w-[150px] text-xs font-medium uppercase tracking-wide">
                            Impuesto
                          </TableHead>
                        )}
                        <TableHead className="w-20 text-center text-xs font-medium uppercase tracking-wide">
                          IVA%
                        </TableHead>
                        <TableHead className="w-32 text-right text-xs font-medium uppercase tracking-wide">
                          Total
                        </TableHead>
                        {searchWarehouses && (
                          <TableHead className="min-w-[160px] text-xs font-medium uppercase tracking-wide">
                            {warehouseLabel}
                          </TableHead>
                        )}
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lines.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell
                            colSpan={
                              9 +
                              (searchWarehouses ? 1 : 0) +
                              (searchUom ? 1 : 0) +
                              (searchTaxCodes ? 1 : 0)
                            }
                            className="h-32 text-center"
                          >
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="rounded-full bg-muted p-3">
                                <Plus className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <p className="text-sm font-medium">Sin líneas</p>
                              <p className="text-xs text-muted-foreground">
                                Haz clic en "Agregar Línea" para comenzar
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        lines.map((line) => (
                          <TableRow key={line.id}>
                            <TableCell className="text-center text-sm font-mono text-muted-foreground">
                              {line.line_number}
                            </TableCell>
                            <TableCell>
                              <Autocomplete
                                searchAction={searchProducts}
                                returnMode="code"
                                value={line.product_id || ""}
                                onChange={(value) =>
                                  handleLineChange(line.id, "product_id", value)
                                }
                                onSelect={(option) =>
                                  handleProductSelect(line.id, option)
                                }
                                placeholder="Buscar producto..."
                                disabled={isLoading}
                                initialDisplayValue={line.product_name}
                                queryKeyPrefix={`product-${line.id}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={line.description}
                                onChange={(e) =>
                                  handleLineChange(line.id, "description", e.target.value)
                                }
                                placeholder="Descripción"
                                disabled={isLoading}
                                className="h-9"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={0.0001}
                                step={0.01}
                                value={line.quantity}
                                onChange={(e) =>
                                  handleLineChange(
                                    line.id,
                                    "quantity",
                                    e.target.valueAsNumber || 0
                                  )
                                }
                                disabled={isLoading}
                                className="h-9 text-center tabular-nums"
                              />
                            </TableCell>
                            {searchUom && (
                              <TableCell>
                                <Autocomplete
                                  searchAction={searchUom}
                                  returnMode="code"
                                  value={line.uom_id || ""}
                                  onChange={(value) =>
                                    handleLineChange(line.id, "uom_id", value)
                                  }
                                  onSelect={(option) =>
                                    handleUomSelect(line.id, option)
                                  }
                                  placeholder="UOM..."
                                  disabled={isLoading}
                                  initialDisplayValue={line.uom_name}
                                  queryKeyPrefix={`uom-${line.id}`}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <Input
                                type="number"
                                min={0}
                                step={0.01}
                                value={line.unit_price}
                                onChange={(e) =>
                                  handleLineChange(
                                    line.id,
                                    "unit_price",
                                    e.target.valueAsNumber || 0
                                  )
                                }
                                disabled={isLoading}
                                className="h-9 text-right tabular-nums"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                step={0.1}
                                value={line.discount_percent}
                                onChange={(e) =>
                                  handleLineChange(
                                    line.id,
                                    "discount_percent",
                                    e.target.valueAsNumber || 0
                                  )
                                }
                                disabled={isLoading}
                                className="h-9 text-center tabular-nums"
                              />
                            </TableCell>
                            {searchTaxCodes && (
                              <TableCell>
                                <Autocomplete
                                  searchAction={searchTaxCodes}
                                  returnMode="code"
                                  value={line.tax_code_id || ""}
                                  onChange={(value) =>
                                    handleLineChange(line.id, "tax_code_id", value)
                                  }
                                  onSelect={(option) =>
                                    handleTaxCodeSelect(line.id, option)
                                  }
                                  placeholder="Impuesto..."
                                  disabled={isLoading}
                                  initialDisplayValue={line.tax_code_name}
                                  queryKeyPrefix={`taxcode-${line.id}`}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                step={0.1}
                                value={line.tax_percent}
                                onChange={(e) =>
                                  handleLineChange(
                                    line.id,
                                    "tax_percent",
                                    e.target.valueAsNumber || 0
                                  )
                                }
                                disabled={isLoading}
                                className="h-9 text-center tabular-nums"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="font-mono text-sm font-medium tabular-nums">
                                {formatCurrency(line.line_total, currency)}
                              </span>
                            </TableCell>
                            {searchWarehouses && (
                              <TableCell>
                                <Autocomplete
                                  searchAction={searchWarehouses}
                                  returnMode="code"
                                  value={line.warehouse_id || ""}
                                  onChange={(value) =>
                                    handleLineChange(line.id, "warehouse_id", value)
                                  }
                                  onSelect={(option) =>
                                    handleWarehouseSelect(line.id, option)
                                  }
                                  placeholder="Almacén..."
                                  disabled={isLoading}
                                  initialDisplayValue={line.warehouse_name}
                                  queryKeyPrefix={`warehouse-${line.id}`}
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveLine(line.id)}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {notesSections.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {notesSections[0]?.fields
                  .filter((f) => !f.hidden)
                  .map((fieldConfig) => (
                    <div key={fieldConfig.name}>
                      <FieldRenderer
                        fieldConfig={fieldConfig}
                        control={form.control}
                        isLoading={isLoading}
                        defaultValues={defaultValues}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
