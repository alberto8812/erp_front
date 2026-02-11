"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAuditLogs,
  getEntityHistory,
} from "../../application/use-cases/audit.actions";
import type { AuditFilters } from "../../domain/entities/audit-log.entity";

export function useAuditLogs(filters: AuditFilters) {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => getAuditLogs(filters),
  });
}

export function useEntityHistory(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ["entity-history", entityType, entityId],
    queryFn: () => getEntityHistory(entityType, entityId),
    enabled: !!entityType && !!entityId,
  });
}
