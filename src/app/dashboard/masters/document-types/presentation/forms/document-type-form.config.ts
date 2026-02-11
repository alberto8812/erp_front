import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchCountries } from "@/app/dashboard/masters/countries/application/use-cases/country-search.action";

export const documentTypeFormConfig: FormConfig = {
  fields: [
    { name: "code", label: "Código", type: "text", required: true, maxLength: 20 },
    { name: "name", label: "Nombre", type: "text", required: true, maxLength: 100 },
    {
      name: "country_id",
      label: "País",
      type: "autocomplete",
      required: false,
      autocompleteConfig: {
        searchAction: searchCountries,
        returnMode: "code",
        placeholder: "Buscar país...",
      },
    },
    { name: "description", label: "Descripción", type: "textarea", maxLength: 255, gridCols: 2 },
    {
      name: "applies_to",
      label: "Aplica a",
      type: "select",
      options: [
        { label: "Persona", value: "person" },
        { label: "Empresa", value: "company" },
        { label: "Ambos", value: "both" },
      ],
      defaultValue: "both",
    },
    { name: "regex_pattern", label: "Patrón de Validación", type: "text", maxLength: 255, placeholder: "^[0-9]{6,12}$" },
    { name: "min_length", label: "Longitud Mínima", type: "number", min: 0 },
    { name: "max_length", label: "Longitud Máxima", type: "number", min: 1 },
    { name: "requires_verification_digit", label: "Requiere Dígito de Verificación", type: "boolean", defaultValue: false },
    { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
  ],
};
