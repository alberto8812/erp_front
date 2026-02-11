import type { AutocompleteOption } from "../../types/autocomplete.types";

export interface OrderLine {
  id: string; // Temporal ID for UI
  line_number: number;
  product_id?: string;
  product_name?: string;
  product_sku?: string;
  description: string;
  quantity: number;
  uom_id: string;
  uom_name?: string;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  tax_code_id?: string;
  tax_code_name?: string;
  tax_percent: number;
  tax_amount: number;
  line_total: number;
  warehouse_id?: string;
  warehouse_name?: string;
}

export interface OrderLineTotals {
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  line_count: number;
}

export interface OrderLinesEditorProps {
  lines: OrderLine[];
  onChange: (lines: OrderLine[]) => void;
  currency?: string;
  searchProducts: (query: string) => Promise<AutocompleteOption[]>;
  searchWarehouses?: (query: string) => Promise<AutocompleteOption[]>;
  searchUom?: (query: string) => Promise<AutocompleteOption[]>;
  searchTaxCodes?: (query: string) => Promise<AutocompleteOption[]>;
  disabled?: boolean;
  warehouseLabel?: string; // "Almacén Origen" for sales, "Almacén Destino" for purchases
}

export function createEmptyLine(lineNumber: number): OrderLine {
  return {
    id: crypto.randomUUID(),
    line_number: lineNumber,
    product_id: undefined,
    product_name: undefined,
    product_sku: undefined,
    description: "",
    quantity: 1,
    uom_id: "",
    uom_name: undefined,
    unit_price: 0,
    discount_percent: 0,
    discount_amount: 0,
    tax_code_id: undefined,
    tax_code_name: undefined,
    tax_percent: 0,
    tax_amount: 0,
    line_total: 0,
    warehouse_id: undefined,
    warehouse_name: undefined,
  };
}

export function calculateLineTotals(line: OrderLine): OrderLine {
  const subtotal = line.quantity * line.unit_price;
  const discount_amount = subtotal * (line.discount_percent / 100);
  const afterDiscount = subtotal - discount_amount;
  const tax_amount = afterDiscount * (line.tax_percent / 100);
  const line_total = afterDiscount + tax_amount;

  return {
    ...line,
    discount_amount: Math.round(discount_amount * 100) / 100,
    tax_amount: Math.round(tax_amount * 100) / 100,
    line_total: Math.round(line_total * 100) / 100,
  };
}

export function calculateOrderTotals(lines: OrderLine[]): OrderLineTotals {
  const totals = lines.reduce(
    (acc, line) => {
      const subtotal = line.quantity * line.unit_price;
      return {
        subtotal: acc.subtotal + subtotal,
        discount_amount: acc.discount_amount + line.discount_amount,
        tax_amount: acc.tax_amount + line.tax_amount,
        total_amount: acc.total_amount + line.line_total,
        line_count: acc.line_count + 1,
      };
    },
    { subtotal: 0, discount_amount: 0, tax_amount: 0, total_amount: 0, line_count: 0 }
  );

  return {
    subtotal: Math.round(totals.subtotal * 100) / 100,
    discount_amount: Math.round(totals.discount_amount * 100) / 100,
    tax_amount: Math.round(totals.tax_amount * 100) / 100,
    total_amount: Math.round(totals.total_amount * 100) / 100,
    line_count: totals.line_count,
  };
}
