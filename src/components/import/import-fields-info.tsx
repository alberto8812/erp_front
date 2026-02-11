"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Type,
  Hash,
  ToggleLeft,
  Mail,
  List,
  Calendar,
  AlertCircle,
  FileText,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  getImportFields,
  type ImportFieldsConfig,
  type FieldInfo,
} from "@/action/import/get-fields.action";

interface ImportFieldsInfoProps {
  moduleKey: string;
  rute?: string;
}

// Corporate blue-tinted palette matching the ERP system
const typeConfig: Record<
  string,
  { icon: typeof Type; label: string; color: string }
> = {
  string: {
    icon: Type,
    label: "Texto",
    color: "text-slate-500 dark:text-slate-400",
  },
  number: {
    icon: Hash,
    label: "Numero",
    color: "text-slate-500 dark:text-slate-400",
  },
  boolean: {
    icon: ToggleLeft,
    label: "Si/No",
    color: "text-slate-500 dark:text-slate-400",
  },
  email: {
    icon: Mail,
    label: "Email",
    color: "text-slate-500 dark:text-slate-400",
  },
  enum: {
    icon: List,
    label: "Lista",
    color: "text-slate-500 dark:text-slate-400",
  },
  date: {
    icon: Calendar,
    label: "Fecha",
    color: "text-slate-500 dark:text-slate-400",
  },
};

function FieldChip({
  field,
  isRequired,
}: {
  field: FieldInfo;
  isRequired: boolean;
}) {
  const config = typeConfig[field.type] || {
    icon: Type,
    label: field.type,
    color: "text-muted-foreground",
  };
  const Icon = config.icon;

  const tooltipContent = (
    <div className="space-y-1.5 text-xs">
      <div className="font-medium">{field.name}</div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>{config.label}</span>
        {field.maxLength && <span>· max {field.maxLength}</span>}
      </div>
      {field.type === "enum" && field.enumValues && (
        <div className="flex flex-wrap gap-1 pt-1">
          {field.enumValues.map((val) => (
            <span
              key={val}
              className="rounded bg-muted px-1.5 py-0.5 text-[10px]"
            >
              {val}
            </span>
          ))}
        </div>
      )}
      {field.example && (
        <div className="pt-1 text-muted-foreground">
          Ej:{" "}
          <code className="rounded bg-muted px-1 font-mono">
            {field.example}
          </code>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          className={`
            group flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-all cursor-default
            ${
              isRequired
                ? "border-primary/20 bg-primary/5 hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/15"
                : "border-border/50 bg-muted/20 hover:bg-muted/40"
            }
          `}
        >
          <Icon
            className={`h-3 w-3 shrink-0 ${isRequired ? "text-primary" : config.color}`}
          />
          <span className="truncate max-w-[100px] font-medium">
            {field.name}
          </span>
          {isRequired && <span className="text-primary text-[10px]">*</span>}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px]">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}

export function ImportFieldsInfo({ moduleKey, rute }: ImportFieldsInfoProps) {
  const [config, setConfig] = useState<ImportFieldsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadFields() {
      try {
        setLoading(true);
        setError(null);
        const data = await getImportFields(moduleKey, rute);
        if (mounted) {
          setConfig(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Error cargando campos",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFields();

    return () => {
      mounted = false;
    };
  }, [moduleKey]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border/50 bg-muted/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="ml-auto h-4 w-16" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm">
        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
        <span className="text-destructive text-xs">{error}</span>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  const requiredFields = config.fields.filter((f) => f.required);
  const optionalFields = config.fields.filter((f) => !f.required);

  return (
    <TooltipProvider>
      <Accordion
        type="single"
        collapsible
        className="rounded-lg border border-border/50 bg-card/50"
      >
        <AccordionItem value="fields" className="border-0">
          <AccordionTrigger className="px-3 py-2.5 hover:no-underline [&[data-state=open]]:pb-1.5">
            <div className="flex items-center gap-2.5 text-sm w-full">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <FileText className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-medium text-[13px]">
                Campos del archivo
              </span>
              <div className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="text-primary font-medium">
                  {requiredFields.length}
                </span>
                <span>obligatorios</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{optionalFields.length} opcionales</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-3 pt-1 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
              {/* Required Fields */}
              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Obligatorios
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {requiredFields.map((field) => (
                    <FieldChip
                      key={field.key}
                      field={field}
                      isRequired={true}
                    />
                  ))}
                </div>
              </div>

              {/* Optional Fields */}
              {optionalFields.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5">
                    <Circle className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Opcionales
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {optionalFields.map((field) => (
                      <FieldChip
                        key={field.key}
                        field={field}
                        isRequired={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  );
}
