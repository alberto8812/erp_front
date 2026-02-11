export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';

export interface AuditLog {
  audit_log_Id: string;
  entity_type: string;
  entity_id: string;
  action: AuditAction;
  user_Id?: string;
  username?: string;
  company_Id?: string;
  ip_address?: string;
  user_agent?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface AuditFilters {
  entity_type?: string;
  entity_id?: string;
  action?: AuditAction;
  user_Id?: string;
  company_Id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface AuditReportFilters {
  company_Id?: string;
  date_from: string;
  date_to: string;
  entity_types?: string[];
  actions?: AuditAction[];
}

export interface AuditLogsPaginated {
  data: AuditLog[];
  total: number;
  limit: number;
  offset: number;
}
