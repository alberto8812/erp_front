"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuditLogs } from "../hooks/use-audit-logs";
import { AuditLogTable } from "./AuditLogTable";
import type { AuditAction } from "../../domain/entities/audit-log.entity";

interface AuditLogsPageProps {
  companyId?: string;
}

const DATE_RANGES = {
  today: "Hoy",
  week: "Últimos 7 días",
  month: "Últimos 30 días",
  custom: "Personalizado",
};

export function AuditLogsPage({ companyId }: AuditLogsPageProps) {
  const [entityType, setEntityType] = useState<string>("all");
  const [action, setAction] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("week");
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [page, setPage] = useState(0);
  const limit = 50;

  const filters = useMemo(() => {
    const now = new Date();
    let dateFrom: string | undefined;
    let dateTo: string | undefined;

    if (dateRange === "today") {
      dateFrom = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      dateTo = new Date(now.setHours(23, 59, 59, 999)).toISOString();
    } else if (dateRange === "week") {
      dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      dateTo = new Date().toISOString();
    } else if (dateRange === "month") {
      dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      dateTo = new Date().toISOString();
    } else if (dateRange === "custom") {
      dateFrom = customDateFrom ? new Date(customDateFrom).toISOString() : undefined;
      dateTo = customDateTo ? new Date(customDateTo).toISOString() : undefined;
    }

    return {
      entity_type: entityType === "all" ? undefined : entityType,
      action: action === "all" ? undefined : (action as AuditAction),
      company_Id: companyId,
      date_from: dateFrom,
      date_to: dateTo,
      limit,
      offset: page * limit,
    };
  }, [entityType, action, dateRange, customDateFrom, customDateTo, companyId, page]);

  const {
    data: auditData,
    isLoading,
    error,
  } = useAuditLogs(filters);

  const totalPages = auditData ? Math.ceil(auditData.total / limit) : 0;

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export audit logs");
  };

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-md bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          {error instanceof Error
            ? error.message
            : "Error al cargar los registros de auditoría"}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <Select value={entityType} onValueChange={setEntityType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo de entidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las entidades</SelectItem>
              <SelectItem value="sales_order">Orden de Venta</SelectItem>
              <SelectItem value="purchase_order">Orden de Compra</SelectItem>
              <SelectItem value="third_party">Tercero</SelectItem>
              <SelectItem value="product">Producto</SelectItem>
              <SelectItem value="preference">Preferencia</SelectItem>
              <SelectItem value="user">Usuario</SelectItem>
              <SelectItem value="company">Compañía</SelectItem>
            </SelectContent>
          </Select>

          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Acción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las acciones</SelectItem>
              <SelectItem value="CREATE">Crear</SelectItem>
              <SelectItem value="UPDATE">Actualizar</SelectItem>
              <SelectItem value="DELETE">Eliminar</SelectItem>
              <SelectItem value="READ">Leer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rango de fecha" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_RANGES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {dateRange === "custom" && (
            <>
              <Input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="w-[160px]"
              />
              <Input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="w-[160px]"
              />
            </>
          )}

          <Button variant="outline" onClick={handleExport} className="ml-auto">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>

        {auditData && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Mostrando {auditData.data.length} de {auditData.total} registros
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  Página {page + 1} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <AuditLogTable logs={auditData?.data || []} />
      )}
    </div>
  );
}
