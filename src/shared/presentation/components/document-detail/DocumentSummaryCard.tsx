"use client";

import { Card, CardContent } from "@/components/ui/card";

interface SummaryItem {
  label: string;
  value: number;
  type?: "currency" | "number" | "percent";
  highlight?: boolean;
  negative?: boolean;
}

interface DocumentSummaryCardProps {
  title?: string;
  items: SummaryItem[];
  currency?: string;
  totalLabel?: string;
  totalValue?: number;
  footerText?: string;
}

function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}

function formatValue(item: SummaryItem, currency: string): string {
  switch (item.type) {
    case "percent":
      return formatPercent(item.value);
    case "number":
      return formatNumber(item.value);
    case "currency":
    default:
      return formatCurrency(item.value, currency);
  }
}

export function DocumentSummaryCard({
  title = "Resumen",
  items,
  currency = "COP",
  totalLabel,
  totalValue,
  footerText,
}: DocumentSummaryCardProps) {
  return (
    <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
      <div className="absolute inset-y-0 left-0 w-0.5 bg-success" />
      <CardContent className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-4">
          {title}
        </p>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between text-sm ${
                item.highlight ? "font-medium" : ""
              }`}
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span
                className={`font-mono tabular-nums ${
                  item.negative ? "text-destructive" : ""
                }`}
              >
                {item.negative && item.value > 0 ? "-" : ""}
                {formatValue(item, currency)}
              </span>
            </div>
          ))}

          {totalLabel && totalValue !== undefined && (
            <>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-medium">{totalLabel}</span>
                  <span className="font-mono text-xl font-semibold tabular-nums tracking-tight">
                    {formatCurrency(totalValue, currency)}
                  </span>
                </div>
              </div>
            </>
          )}

          {footerText && (
            <p className="text-xs text-muted-foreground text-right pt-1">
              {footerText}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
