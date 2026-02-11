import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchCountries } from "@/app/dashboard/masters/countries/application/use-cases/country-search.action";
import { searchStates } from "@/app/dashboard/masters/state-deparment/application/use-cases/state-search.action";

export const cityFormConfig: FormConfig = {
  fields: [
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
    {
      name: "state_id",
      label: "Departamento",
      type: "autocomplete",
      required: true,
      autocompleteConfig: {
        searchAction: searchStates,
        returnMode: "code",
        placeholder: "Buscar departamento...",
      },
    },
    { name: "code", label: "Código", type: "text", required: true, maxLength: 20 },
    { name: "name", label: "Nombre", type: "text", required: true, maxLength: 150 },
    { name: "dane_code", label: "Código DANE", type: "text", required: true, maxLength: 20, placeholder: "Código DANE" },
    { name: "postal_code", label: "Código Postal", type: "text", maxLength: 20 },
    { name: "iso_code", label: "Código ISO", type: "text", maxLength: 20 },
    { name: "is_capital", label: "Es Capital", type: "boolean", defaultValue: false },
    { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
  ],
};
