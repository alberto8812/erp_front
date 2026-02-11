import type { FormConfig } from "@/shared/presentation/types/form-config.types";

export const paymentTermFormConfig: FormConfig = {
  fields: [
    { name: "code", label: "Código", type: "text", required: true, maxLength: 30 },
    { name: "name", label: "Nombre", type: "text", required: true, maxLength: 100 },
    { name: "description", label: "Descripción", type: "textarea", maxLength: 255, gridCols: 2 },
    { name: "days", label: "Días", type: "number", required: true, min: 0 },
    { name: "discount_days", label: "Días Descuento", type: "number", min: 0 },
    { name: "discount_percent", label: "% Descuento", type: "number", min: 0 },
    { name: "is_immediate", label: "Pago Inmediato", type: "boolean", defaultValue: false },
    { name: "is_default_sales", label: "Predeterminado Ventas", type: "boolean", defaultValue: false },
    { name: "is_default_purchase", label: "Predeterminado Compras", type: "boolean", defaultValue: false },
    { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
  ],
};
