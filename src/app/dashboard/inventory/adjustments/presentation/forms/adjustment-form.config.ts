import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";

const ADJUSTMENT_TYPE_OPTIONS = [
  { label: "Ajuste de Cantidad", value: "quantity" },
  { label: "Ajuste de Valor", value: "value" },
  { label: "Ajuste de Cantidad y Valor", value: "both" },
];

export const adjustmentFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      fields: [
        {
          name: "adjustment_number",
          label: "Número de Ajuste",
          type: "text",
          required: true,
          maxLength: 50,
          placeholder: "Ej: ADJ-2024-001",
        },
        {
          name: "adjustment_date",
          label: "Fecha de Ajuste",
          type: "date",
          required: true,
        },
        {
          name: "adjustment_type",
          label: "Tipo de Ajuste",
          type: "select",
          required: true,
          options: ADJUSTMENT_TYPE_OPTIONS,
          defaultValue: "quantity",
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
      title: "Detalles",
      fields: [
        {
          name: "reason_code",
          label: "Código de Razón",
          type: "text",
          maxLength: 50,
          placeholder: "Ej: DAMAGE, THEFT, COUNT_DIFF",
        },
        {
          name: "description",
          label: "Descripción",
          type: "textarea",
          gridCols: 2,
          placeholder: "Descripción del ajuste y razón...",
        },
      ],
    },
  ],
  fields: [],
};
