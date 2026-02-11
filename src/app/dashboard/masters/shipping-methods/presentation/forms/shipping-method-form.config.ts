import type { FormConfig } from "@/shared/presentation/types/form-config.types";

export const shippingMethodFormConfig: FormConfig = {
  fields: [
    { name: "code", label: "Código", type: "text", required: true, maxLength: 30 },
    { name: "name", label: "Nombre", type: "text", required: true, maxLength: 100 },
    { name: "description", label: "Descripción", type: "textarea", maxLength: 255, gridCols: 2 },
    { name: "estimated_days_min", label: "Días Mínimos", type: "number", min: 0 },
    { name: "estimated_days_max", label: "Días Máximos", type: "number", min: 0 },
    { name: "base_cost", label: "Costo Base", type: "number", min: 0 },
    { name: "cost_per_kg", label: "Costo por Kg", type: "number", min: 0 },
    { name: "is_default", label: "Predeterminado", type: "boolean", defaultValue: false },
    { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
  ],
};
