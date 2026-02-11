"use server";

import { apiClient } from "@/lib/api";
import type {
  AuditLog,
  AuditFilters,
  AuditReportFilters,
  AuditLogsPaginated,
} from "../../domain/entities/audit-log.entity";

export async function getAuditLogs(filters: AuditFilters): Promise<AuditLogsPaginated> {
  // Transform frontend field names to backend expected format
  const payload = {
    company_id: filters.company_Id,
    user_id: filters.user_Id,
    action: filters.action,
    entity_type: filters.entity_type,
    entity_id: filters.entity_id,
    start_date: filters.date_from,
    end_date: filters.date_to,
    limit: filters.limit,
    offset: filters.offset,
  };
  return apiClient<AuditLogsPaginated>('/onerp/system/audit/logs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getEntityHistory(
  entityType: string,
  entityId: string
): Promise<AuditLog[]> {
  return apiClient<AuditLog[]>('/onerp/system/audit/entity-history', {
    method: 'POST',
    body: JSON.stringify({ entity_type: entityType, entity_id: entityId }),
  });
}

export async function getAuditReport(filters: AuditReportFilters): Promise<Blob> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/onerp/system/audit/report`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    }
  );

  if (!response.ok) {
    throw new Error('Error al generar el reporte');
  }

  return response.blob();
}
