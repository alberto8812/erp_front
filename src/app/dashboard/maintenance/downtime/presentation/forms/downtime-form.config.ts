import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchAssets } from "@/app/dashboard/maintenance/assets/application/use-cases/asset-search.action";

const DOWNTIME_TYPE_OPTIONS = [
  { label: "Planificado", value: "planned" },
  { label: "No Planificado", value: "unplanned" },
  { label: "Avería", value: "breakdown" },
  { label: "Configuración", value: "setup" },
  { label: "Cambio de Producto", value: "changeover" },
];

const IMPACT_OPTIONS = [
  { label: "Crítico", value: "critical" },
  { label: "Alto", value: "high" },
  { label: "Medio", value: "medium" },
  { label: "Bajo", value: "low" },
];

export const downtimeFormConfig: FormConfig = {
  sections: [
    {
      title: "Información del Evento",
      fields: [
        {
          name: "downtime_number",
          label: "Número",
          type: "text",
          required: true,
          maxLength: 50,
          placeholder: "DT-2024-001",
        },
        {
          name: "asset_id",
          label: "Activo",
          type: "autocomplete",
          required: true,
          autocompleteConfig: {
            searchAction: searchAssets,
            returnMode: "code",
            placeholder: "Buscar activo...",
          },
        },
        {
          name: "downtime_type",
          label: "Tipo de Parada",
          type: "select",
          required: true,
          options: DOWNTIME_TYPE_OPTIONS,
          defaultValue: "unplanned",
        },
        {
          name: "impact_level",
          label: "Nivel de Impacto",
          type: "select",
          options: IMPACT_OPTIONS,
          defaultValue: "medium",
        },
      ],
    },
    {
      title: "Fecha y Hora",
      fields: [
        {
          name: "start_datetime",
          label: "Inicio",
          type: "datetime-local",
          required: true,
        },
        {
          name: "end_datetime",
          label: "Fin",
          type: "datetime-local",
        },
      ],
    },
    {
      title: "Detalles",
      fields: [
        {
          name: "description",
          label: "Descripción",
          type: "textarea",
          gridCols: 2,
          placeholder: "Describa el evento de parada...",
        },
        {
          name: "notes",
          label: "Notas Adicionales",
          type: "textarea",
          gridCols: 2,
          placeholder: "Observaciones...",
        },
      ],
    },
  ],
  fields: [],
};
