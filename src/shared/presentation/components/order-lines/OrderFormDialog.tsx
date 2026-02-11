"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Autocomplete } from "../autocomplete/Autocomplete";
import { OrderLinesEditor } from "./OrderLinesEditor";
import { buildZodSchema } from "../../validators/build-zod-schema";
import type { FormConfig, FormFieldConfig } from "../../types/form-config.types";
import type { AutocompleteOption } from "../../types/autocomplete.types";
import { type OrderLine, calculateOrderTotals } from "./types";

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  formConfig: FormConfig;
  defaultValues?: Record<string, unknown>;
  defaultLines?: OrderLine[];
  onSubmit: (data: Record<string, unknown>, lines: OrderLine[]) => void;
  isLoading?: boolean;
  // Lines configuration
  searchProducts: (query: string) => Promise<AutocompleteOption[]>;
  searchWarehouses?: (query: string) => Promise<AutocompleteOption[]>;
  searchUom?: (query: string) => Promise<AutocompleteOption[]>;
  searchTaxCodes?: (query: string) => Promise<AutocompleteOption[]>;
  warehouseLabel?: string;
  currency?: string;
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
        <FormItem
          className={
            fieldConfig.gridCols === 2 ? "col-span-2" : "col-span-2 sm:col-span-1"
          }
        >
          {fieldConfig.type !== "boolean" && (
            <FormLabel>{fieldConfig.label}</FormLabel>
          )}
          <FormControl>
            {fieldConfig.type === "text" || fieldConfig.type === "date" || fieldConfig.type === "uuid" ? (
              <Input
                placeholder={fieldConfig.placeholder ?? ""}
                type={fieldConfig.type === "date" ? "date" : "text"}
                disabled={isLoading}
                {...field}
                value={(field.value as string) ?? ""}
              />
            ) : fieldConfig.type === "number" ? (
              <Input
                type="number"
                placeholder={fieldConfig.placeholder ?? ""}
                disabled={isLoading}
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                value={(field.value as number) ?? ""}
              />
            ) : fieldConfig.type === "textarea" ? (
              <Textarea
                placeholder={fieldConfig.placeholder ?? ""}
                disabled={isLoading}
                {...field}
                value={(field.value as string) ?? ""}
              />
            ) : fieldConfig.type === "select" ? (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}
                disabled={isLoading}
              >
                <SelectTrigger>
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

export function OrderFormDialog({
  open,
  onOpenChange,
  title,
  description,
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
}: OrderFormDialogProps) {
  const [lines, setLines] = useState<OrderLine[]>(defaultLines);
  const [activeTab, setActiveTab] = useState("header");

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

  // Reset lines when dialog opens with new data
  useEffect(() => {
    if (open) {
      setLines(defaultLines);
      form.reset(computedDefaults);
      setActiveTab("header");
    }
  }, [open, defaultLines]);

  const handleSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const cleanedData = cleanFormData(data);

      // Add totals from lines to the form data
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

  const totals = calculateOrderTotals(lines);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 overflow-hidden sm:max-w-4xl max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Divider */}
        <div className="border-t" />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="header">Información General</TabsTrigger>
              <TabsTrigger value="lines">
                Líneas ({lines.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <Form {...form}>
            <form id="order-form" onSubmit={form.handleSubmit(handleSubmit)}>
              {/* Header Tab */}
              <TabsContent value="header" className="mt-0">
                <ScrollArea className="max-h-[calc(90vh-280px)]">
                  <div className="space-y-0">
                    {formConfig.sections?.map((section, sIdx) => {
                      const regularFields = section.fields.filter(
                        (f) => !f.hidden && f.type !== "boolean"
                      );
                      const booleanFields = section.fields.filter(
                        (f) => !f.hidden && f.type === "boolean"
                      );

                      return (
                        <div key={section.title}>
                          {sIdx > 0 && <div className="border-t" />}
                          <div className="px-6 py-5">
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
                              <div className="grid grid-cols-2 gap-4">
                                {regularFields.map((fieldConfig) => (
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Lines Tab */}
              <TabsContent value="lines" className="mt-0">
                <ScrollArea className="max-h-[calc(90vh-280px)]">
                  <div className="px-6 py-5">
                    <OrderLinesEditor
                      lines={lines}
                      onChange={setLines}
                      currency={currency}
                      searchProducts={searchProducts}
                      searchWarehouses={searchWarehouses}
                      searchUom={searchUom}
                      searchTaxCodes={searchTaxCodes}
                      warehouseLabel={warehouseLabel}
                      disabled={isLoading}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
            </form>
          </Form>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-mono font-semibold tabular-nums">
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }).format(totals.total_amount)}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              ({lines.length} línea{lines.length !== 1 ? "s" : ""})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" form="order-form" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
