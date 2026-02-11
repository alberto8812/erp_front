"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AuditLog } from "../../domain/entities/audit-log.entity";

interface AuditLogDetailDialogProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const actionColors: Record<string, string> = {
  CREATE: "bg-green-100 text-green-800",
  UPDATE: "bg-blue-100 text-blue-800",
  DELETE: "bg-red-100 text-red-800",
  READ: "bg-gray-100 text-gray-800",
};

export function AuditLogDetailDialog({
  log,
  open,
  onOpenChange,
}: AuditLogDetailDialogProps) {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalle del Registro de Auditoría</DialogTitle>
          <DialogDescription>
            Información completa del evento de auditoría
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Acción</p>
                <Badge className={actionColors[log.action] || actionColors.READ}>
                  {log.action}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Fecha</p>
                <p className="text-sm">
                  {new Date(log.created_at).toLocaleString("es-CO")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Usuario</p>
                <p className="text-sm">{log.username || "—"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">ID Usuario</p>
                <p className="text-sm font-mono text-xs">{log.user_Id || "—"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Entidad</p>
                <p className="text-sm">{log.entity_type}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">ID Entidad</p>
                <p className="text-sm font-mono text-xs">{log.entity_id}</p>
              </div>

              {log.ip_address && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">IP</p>
                  <p className="text-sm font-mono">{log.ip_address}</p>
                </div>
              )}

              {log.company_Id && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Compañía</p>
                  <p className="text-sm font-mono text-xs">{log.company_Id}</p>
                </div>
              )}
            </div>

            {log.changes && Object.keys(log.changes).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Cambios</p>
                <div className="rounded-md bg-muted p-3">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(log.changes, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Metadata</p>
                <div className="rounded-md bg-muted p-3">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {log.user_agent && (
              <div className="space-y-2">
                <p className="text-sm font-medium">User Agent</p>
                <p className="text-xs text-muted-foreground break-all">
                  {log.user_agent}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
