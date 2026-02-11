import type { FormConfig } from "@/shared/presentation/types/form-config.types";

export const regionZoneFormConfig: FormConfig = {
  fields: [
    { name: "code", label: "Código", type: "text", required: true, maxLength: 30 },
    { name: "name", label: "Nombre", type: "text", required: true, maxLength: 100 },
    { name: "description", label: "Descripción", type: "textarea", maxLength: 255, gridCols: 2 },
    {
      name: "zone_type",
      label: "Tipo de Zona",
      type: "select",
      options: [
        { label: "Comercial", value: "commercial" },
        { label: "Logística", value: "logistics" },
        { label: "Servicio", value: "service" },
        { label: "Administrativa", value: "administrative" },
      ],
      defaultValue: "commercial",
    },
    { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
  ],
};
