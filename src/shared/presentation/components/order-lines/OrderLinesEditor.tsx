"use client";

import { useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Autocomplete } from "../autocomplete/Autocomplete";
import type { AutocompleteOption } from "../../types/autocomplete.types";
import {
  type OrderLine,
  type OrderLinesEditorProps,
  createEmptyLine,
  calculateLineTotals,
  calculateOrderTotals,
} from "./types";

function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function OrderLinesEditor({
  lines,
  onChange,
  currency = "COP",
  searchProducts,
  searchWarehouses,
  searchUom,
  searchTaxCodes,
  disabled = false,
  warehouseLabel = "Almacén",
}: OrderLinesEditorProps) {
  const totals = calculateOrderTotals(lines);

  const handleAddLine = useCallback(() => {
    const newLine = createEmptyLine(lines.length + 1);
    onChange([...lines, newLine]);
  }, [lines, onChange]);

  const handleRemoveLine = useCallback(
    (id: string) => {
      const updatedLines = lines
        .filter((line) => line.id !== id)
        .map((line, index) => ({ ...line, line_number: index + 1 }));
      onChange(updatedLines);
    },
    [lines, onChange]
  );

  const handleLineChange = useCallback(
    (id: string, field: keyof OrderLine, value: unknown) => {
      const updatedLines = lines.map((line) => {
        if (line.id !== id) return line;

        const updatedLine = { ...line, [field]: value };

        // Recalculate totals when quantity, price, discount, or tax changes
        if (["quantity", "unit_price", "discount_percent", "tax_percent"].includes(field)) {
          return calculateLineTotals(updatedLine);
        }

        return updatedLine;
      });
      onChange(updatedLines);
    },
    [lines, onChange]
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
      onChange(updatedLines);
    },
    [lines, onChange]
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
      onChange(updatedLines);
    },
    [lines, onChange]
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
      onChange(updatedLines);
    },
    [lines, onChange]
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
      onChange(updatedLines);
    },
    [lines, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Lines Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10 text-center text-xs font-medium uppercase tracking-wide">
                  #
                </TableHead>
                <TableHead className="min-w-[200px] text-xs font-medium uppercase tracking-wide">
                  Producto
                </TableHead>
                <TableHead className="min-w-[150px] text-xs font-medium uppercase tracking-wide">
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
                <TableHead className="w-28 text-right text-xs font-medium uppercase tracking-wide">
                  Precio
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
                <TableHead className="w-28 text-right text-xs font-medium uppercase tracking-wide">
                  Total
                </TableHead>
                {searchWarehouses && (
                  <TableHead className="min-w-[150px] text-xs font-medium uppercase tracking-wide">
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
                    className="h-24 text-center"
                  >
                    <p className="text-sm text-muted-foreground">
                      No hay líneas. Haz clic en "Agregar Línea" para comenzar.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                lines.map((line) => (
                  <TableRow key={line.id}>
                    {/* Line Number */}
                    <TableCell className="text-center text-sm font-mono text-muted-foreground">
                      {line.line_number}
                    </TableCell>

                    {/* Product */}
                    <TableCell>
                      <Autocomplete
                        searchAction={searchProducts}
                        returnMode="code"
                        value={line.product_id || ""}
                        onChange={(value) => handleLineChange(line.id, "product_id", value)}
                        onSelect={(option) => handleProductSelect(line.id, option)}
                        placeholder="Buscar producto..."
                        disabled={disabled}
                        initialDisplayValue={line.product_name}
                        queryKeyPrefix={`product-${line.id}`}
                      />
                    </TableCell>

                    {/* Description */}
                    <TableCell>
                      <Input
                        value={line.description}
                        onChange={(e) =>
                          handleLineChange(line.id, "description", e.target.value)
                        }
                        placeholder="Descripción"
                        disabled={disabled}
                        className="h-9"
                      />
                    </TableCell>

                    {/* Quantity */}
                    <TableCell>
                      <Input
                        type="number"
                        min={0.0001}
                        step={0.01}
                        value={line.quantity}
                        onChange={(e) =>
                          handleLineChange(line.id, "quantity", e.target.valueAsNumber || 0)
                        }
                        disabled={disabled}
                        className="h-9 text-center tabular-nums"
                      />
                    </TableCell>

                    {/* UOM */}
                    {searchUom && (
                      <TableCell>
                        <Autocomplete
                          searchAction={searchUom}
                          returnMode="code"
                          value={line.uom_id || ""}
                          onChange={(value) => handleLineChange(line.id, "uom_id", value)}
                          onSelect={(option) => handleUomSelect(line.id, option)}
                          placeholder="UOM..."
                          disabled={disabled}
                          initialDisplayValue={line.uom_name}
                          queryKeyPrefix={`uom-${line.id}`}
                        />
                      </TableCell>
                    )}

                    {/* Unit Price */}
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={line.unit_price}
                        onChange={(e) =>
                          handleLineChange(line.id, "unit_price", e.target.valueAsNumber || 0)
                        }
                        disabled={disabled}
                        className="h-9 text-right tabular-nums"
                      />
                    </TableCell>

                    {/* Discount % */}
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
                        disabled={disabled}
                        className="h-9 text-center tabular-nums"
                      />
                    </TableCell>

                    {/* Tax Code */}
                    {searchTaxCodes && (
                      <TableCell>
                        <Autocomplete
                          searchAction={searchTaxCodes}
                          returnMode="code"
                          value={line.tax_code_id || ""}
                          onChange={(value) => handleLineChange(line.id, "tax_code_id", value)}
                          onSelect={(option) => handleTaxCodeSelect(line.id, option)}
                          placeholder="Impuesto..."
                          disabled={disabled}
                          initialDisplayValue={line.tax_code_name}
                          queryKeyPrefix={`taxcode-${line.id}`}
                        />
                      </TableCell>
                    )}

                    {/* Tax % */}
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        value={line.tax_percent}
                        onChange={(e) =>
                          handleLineChange(line.id, "tax_percent", e.target.valueAsNumber || 0)
                        }
                        disabled={disabled}
                        className="h-9 text-center tabular-nums"
                      />
                    </TableCell>

                    {/* Line Total */}
                    <TableCell className="text-right">
                      <span className="font-mono text-sm font-medium tabular-nums">
                        {formatCurrency(line.line_total, currency)}
                      </span>
                    </TableCell>

                    {/* Warehouse */}
                    {searchWarehouses && (
                      <TableCell>
                        <Autocomplete
                          searchAction={searchWarehouses}
                          returnMode="code"
                          value={line.warehouse_id || ""}
                          onChange={(value) =>
                            handleLineChange(line.id, "warehouse_id", value)
                          }
                          onSelect={(option) => handleWarehouseSelect(line.id, option)}
                          placeholder="Almacén..."
                          disabled={disabled}
                          initialDisplayValue={line.warehouse_name}
                          queryKeyPrefix={`warehouse-${line.id}`}
                        />
                      </TableCell>
                    )}

                    {/* Actions */}
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveLine(line.id)}
                        disabled={disabled}
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

        {/* Add Line Button */}
        <div className="border-t bg-muted/20 px-4 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddLine}
            disabled={disabled}
            className="text-primary"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Agregar Línea
          </Button>
        </div>
      </div>

      {/* Totals Summary */}
      {lines.length > 0 && (
        <div className="flex justify-end">
          <div className="w-72 space-y-2 rounded-lg border bg-muted/20 p-4">
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
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-mono text-lg font-semibold tabular-nums">
                  {formatCurrency(totals.total_amount, currency)}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              {totals.line_count} línea(s)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
