"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { AuditLog } from "../../domain/entities/audit-log.entity";
import { AuditLogDetailDialog } from "./AuditLogDetailDialog";

interface AuditLogTableProps {
  logs: AuditLog[];
}

const actionColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  READ: "outline",
};

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Entidad</TableHead>
              <TableHead>ID Entidad</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead className="w-[70px]">Detalles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-48">
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-medium">Sin registros</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      No hay registros de auditoría que mostrar
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.audit_log_Id}>
                  <TableCell className="text-muted-foreground tabular-nums">
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {new Date(log.created_at).toLocaleDateString("es-CO")}
                      </span>
                      <span className="text-xs">
                        {new Date(log.created_at).toLocaleTimeString("es-CO")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{log.username || "—"}</span>
                      {log.user_Id && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {log.user_Id.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{log.entity_type}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.entity_id.length > 20
                      ? `${log.entity_id.slice(0, 20)}...`
                      : log.entity_id}
                  </TableCell>
                  <TableCell>
                    <Badge variant={actionColors[log.action] || "outline"}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AuditLogDetailDialog
        log={selectedLog}
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      />
    </>
  );
}
