import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";

const COUNT_TYPE_OPTIONS = [
  { label: "Conteo Completo", value: "full" },
  { label: "Conteo Cíclico", value: "cycle" },
  { label: "Conteo Puntual", value: "spot" },
];

export const inventoryCountFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      fields: [
        {
          name: "count_number",
          label: "Número de Conteo",
          type: "text",
          required: true,
          maxLength: 50,
          placeholder: "Ej: CNT-2024-001",
        },
        {
          name: "count_date",
          label: "Fecha de Conteo",
          type: "date",
          required: true,
        },
        {
          name: "count_type",
          label: "Tipo de Conteo",
          type: "select",
          required: true,
          options: COUNT_TYPE_OPTIONS,
          defaultValue: "cycle",
        },
        {
          name: "warehouse_id",
          label: "Almacén",
          type: "autocomplete",
          required: true,
          autocompleteConfig: {
            searchAction: searchWarehouses,
            returnMode: "code",
            placeholder: "Buscar almacén...",
          },
        },
      ],
    },
    {
      title: "Planificación",
      fields: [
        {
          name: "planned_date",
          label: "Fecha Planificada",
          type: "date",
        },
        {
          name: "assigned_to",
          label: "Asignado a",
          type: "text",
          maxLength: 100,
          placeholder: "Nombre del responsable",
        },
        {
          name: "notes",
          label: "Notas",
          type: "textarea",
          gridCols: 2,
          placeholder: "Observaciones o instrucciones especiales...",
        },
      ],
    },
  ],
  fields: [],
};
