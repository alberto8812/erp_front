import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchCountries } from "@/app/dashboard/masters/countries/application/use-cases/country-search.action";

export const economicActivityFormConfig: FormConfig = {
  fields: [
    { name: "code", label: "Código CIIU", type: "text", required: true, maxLength: 20 },
    { name: "name", label: "Nombre", type: "text", required: true, maxLength: 300, gridCols: 2 },
    { name: "description", label: "Descripción", type: "textarea", maxLength: 500, gridCols: 2 },
    { name: "section", label: "Sección", type: "text", required: true, maxLength: 5, placeholder: "A" },
    { name: "division", label: "División", type: "text", maxLength: 10 },
    { name: "activity_group", label: "Grupo", type: "text", maxLength: 10 },
    { name: "activity_class", label: "Clase", type: "text", maxLength: 10 },
    { name: "ica_rate", label: "Tarifa ICA", type: "number", min: 0 },
    {
      name: "country_id",
      label: "País",
      type: "autocomplete",
      required: true,
      autocompleteConfig: {
        searchAction: searchCountries,
        returnMode: "code",
        placeholder: "Buscar país...",
      },
    },
    { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
  ],
};
