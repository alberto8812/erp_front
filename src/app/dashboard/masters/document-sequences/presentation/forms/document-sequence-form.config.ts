import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchBranches } from "@/app/dashboard/masters/branches/application/use-cases/branch-search.action";

export const documentSequenceFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      fields: [
        { name: "sequence_code", label: "Código", type: "text", required: true, maxLength: 50 },
        { name: "sequence_name", label: "Nombre", type: "text", required: true, maxLength: 150 },
        {
          name: "branch_id",
          label: "Sucursal",
          type: "autocomplete",
          required: false,
          autocompleteConfig: {
            searchAction: searchBranches,
            returnMode: "code",
            placeholder: "Buscar sucursal...",
          },
        },
        { name: "prefix", label: "Prefijo", type: "text", maxLength: 20, placeholder: "FAC-" },
        { name: "suffix", label: "Sufijo", type: "text", maxLength: 20 },
      ],
    },
    {
      title: "Numeración",
      fields: [
        { name: "current_number", label: "Número Actual", type: "number", min: 0, defaultValue: 0 },
        { name: "padding", label: "Dígitos (Padding)", type: "number", min: 1, defaultValue: 6, placeholder: "6" },
        {
          name: "reset_frequency",
          label: "Frecuencia de Reinicio",
          type: "select",
          options: [
            { label: "Nunca", value: "never" },
            { label: "Anual", value: "yearly" },
            { label: "Mensual", value: "monthly" },
            { label: "Diario", value: "daily" },
          ],
          defaultValue: "never",
        },
        { name: "fiscal_year", label: "Año Fiscal", type: "number" },
        { name: "include_year", label: "Incluir Año", type: "boolean", defaultValue: false },
        { name: "include_branch", label: "Incluir Sucursal", type: "boolean", defaultValue: false },
        { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
      ],
    },
  ],
  fields: [],
};
