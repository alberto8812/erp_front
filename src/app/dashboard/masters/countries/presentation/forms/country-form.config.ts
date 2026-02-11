import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchCurrencies } from "@/app/dashboard/masters/currencies/application/use-cases/currency-search.action";

export const countryFormConfig: FormConfig = {
  fields: [
    { name: "iso_code", label: "Código ISO (2)", type: "text", required: true, maxLength: 3, placeholder: "CO" },
    { name: "iso_code_3", label: "Código ISO (3)", type: "text", required: true, maxLength: 3, placeholder: "COL" },
    { name: "name", label: "Nombre", type: "text", required: true, maxLength: 150 },
    { name: "name_en", label: "Nombre (Inglés)", type: "text", maxLength: 150, placeholder: "Colombia" },
    { name: "phone_code", label: "Código Telefónico", type: "text", required: true, maxLength: 3, placeholder: "57" },
    { name: "currency_code", label: "Código Moneda", type: "text", required: true, maxLength: 10, placeholder: "COP" },
    {
      name: "currency_id",
      label: "Moneda",
      type: "autocomplete",
      required: true,
      autocompleteConfig: {
        searchAction: searchCurrencies,
        returnMode: "code",
        placeholder: "Buscar moneda...",
      },
    },
    { name: "flag_emoji", label: "Emoji Bandera", type: "text", maxLength: 10 },
  ],
};
