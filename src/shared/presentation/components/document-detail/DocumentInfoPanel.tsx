"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DocumentInfoSection, DocumentInfoField } from "./types";

interface DocumentInfoPanelProps {
  sections: DocumentInfoSection[];
}

function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function FieldValue({ field }: { field: DocumentInfoField }) {
  const { value, type, emptyText = "—" } = field;

  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground/50">{emptyText}</span>;
  }

  switch (type) {
    case "currency":
      return (
        <span className="font-mono tabular-nums">
          {formatCurrency(value as number)}
        </span>
      );
    case "number":
      return (
        <span className="font-mono tabular-nums">
          {formatNumber(value as number)}
        </span>
      );
    case "date":
      return <span>{formatDate(value as string)}</span>;
    case "badge":
      if (typeof value === "object" && value !== null && "label" in value && "color" in value) {
        const badgeValue = value as { label: string; color: string };
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeValue.color}`}
          >
            {badgeValue.label}
          </span>
        );
      }
      return <Badge variant="secondary">{String(value)}</Badge>;
    case "link":
      if (typeof value === "object" && value !== null && "label" in value && "href" in value) {
        const linkValue = value as { label: string; href: string };
        return (
          <a
            href={linkValue.href}
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            {linkValue.label}
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      }
      return <span>{String(value)}</span>;
    case "custom":
      return <>{value}</>;
    default:
      return <span>{String(value)}</span>;
  }
}

function InfoSection({
  section,
  isOpen,
  onToggle,
}: {
  section: DocumentInfoSection;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = section.icon;

  return (
    <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
      <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
      <CardContent className="p-0">
        {/* Header */}
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {section.title}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Content */}
        {isOpen && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {section.fields.map((field, index) => (
                <div
                  key={index}
                  className={field.colSpan === 2 ? "col-span-2" : "col-span-1"}
                >
                  <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70 mb-0.5">
                    {field.label}
                  </dt>
                  <dd className="text-sm">
                    <FieldValue field={field} />
                  </dd>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DocumentInfoPanel({ sections }: DocumentInfoPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const defaultOpen = new Set<string>();
    sections.forEach((section) => {
      if (section.defaultOpen !== false) {
        defaultOpen.add(section.id);
      }
    });
    return defaultOpen;
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <InfoSection
          key={section.id}
          section={section}
          isOpen={openSections.has(section.id)}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  );
}
