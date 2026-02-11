"use server";

import { apiClient } from "@/lib/api";
import { createPaginatedActions } from "@/shared/application/use-cases/create-paginated-actions";
import type { MaintenanceWorkOrder } from "../../domain/entities/work-order.entity";

const BASE_PATH = "/onerp/maintenance/work-orders";
const actions = createPaginatedActions<MaintenanceWorkOrder>(BASE_PATH);

export const findAllPaginated = actions.findAllPaginated;
export const findById = actions.findById;
export const create = actions.create;
export const update = actions.update;
export const remove = actions.remove;

// Status transitions
export async function approveWorkOrder(
  workOrderId: string,
  data: { approved_by: string; notes?: string }
): Promise<MaintenanceWorkOrder> {
  return apiClient<MaintenanceWorkOrder>(`${BASE_PATH}/${workOrderId}/approve`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function startWorkOrder(
  workOrderId: string,
  data: { started_by: string; notes?: string }
): Promise<MaintenanceWorkOrder> {
  return apiClient<MaintenanceWorkOrder>(`${BASE_PATH}/${workOrderId}/start`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function holdWorkOrder(
  workOrderId: string,
  data: { reason: string; notes?: string }
): Promise<MaintenanceWorkOrder> {
  return apiClient<MaintenanceWorkOrder>(`${BASE_PATH}/${workOrderId}/hold`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function completeWorkOrder(
  workOrderId: string,
  data: {
    completed_by: string;
    completion_notes?: string;
    root_cause?: string;
    corrective_action?: string;
    preventive_action?: string;
  }
): Promise<MaintenanceWorkOrder> {
  return apiClient<MaintenanceWorkOrder>(`${BASE_PATH}/${workOrderId}/complete`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function closeWorkOrder(
  workOrderId: string,
  data: {
    closed_by: string;
    work_quality_rating?: number;
    feedback?: string;
    follow_up_required?: boolean;
  }
): Promise<MaintenanceWorkOrder> {
  return apiClient<MaintenanceWorkOrder>(`${BASE_PATH}/${workOrderId}/close`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function cancelWorkOrder(
  workOrderId: string,
  data: { cancelled_by: string; reason: string }
): Promise<MaintenanceWorkOrder> {
  return apiClient<MaintenanceWorkOrder>(`${BASE_PATH}/${workOrderId}/cancel`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Task management
export async function completeTask(
  workOrderId: string,
  taskId: string,
  data: {
    completed_by: string;
    notes?: string;
    measurement_value?: number;
    actual_minutes?: number;
  }
): Promise<MaintenanceWorkOrder> {
  return apiClient<MaintenanceWorkOrder>(
    `${BASE_PATH}/${workOrderId}/tasks/${taskId}/complete`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

// Labor management
export async function addLabor(
  workOrderId: string,
  data: {
    technician_id: string;
    start_datetime: string;
    end_datetime?: string;
    hours_worked: number;
    is_overtime?: boolean;
    hourly_rate: number;
    activity_description?: string;
    skill_type?: string;
  }
): Promise<MaintenanceWorkOrder> {
  return apiClient<MaintenanceWorkOrder>(`${BASE_PATH}/${workOrderId}/labor`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Parts management
export async function issueParts(
  workOrderId: string,
  partId: string,
  data: {
    quantity_used: number;
    issued_by: string;
    warehouse_id?: string;
    lot_id?: string;
    notes?: string;
  }
): Promise<MaintenanceWorkOrder> {
  return apiClient<MaintenanceWorkOrder>(
    `${BASE_PATH}/${workOrderId}/parts/${partId}/issue`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

// Downtime management
export async function recordDowntime(
  workOrderId: string,
  data: {
    equipment_stopped_at: string;
    equipment_restarted_at?: string;
    downtime_hours?: number;
  }
): Promise<MaintenanceWorkOrder> {
  return apiClient<MaintenanceWorkOrder>(`${BASE_PATH}/${workOrderId}/downtime`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
