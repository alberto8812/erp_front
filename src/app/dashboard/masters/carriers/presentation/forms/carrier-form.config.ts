import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchThirdParties } from "@/app/dashboard/masters/third-party/application/use-cases/third-party-search.action";

export const carrierFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      fields: [
        { name: "carrier_code", label: "Código", type: "text", required: true, maxLength: 30 },
        { name: "carrier_name", label: "Nombre", type: "text", required: true, maxLength: 150 },
        {
          name: "third_party_id",
          label: "Tercero Asociado",
          type: "autocomplete",
          required: false,
          autocompleteConfig: {
            searchAction: searchThirdParties,
            returnMode: "code",
            placeholder: "Buscar tercero...",
          },
        },
        { name: "account_number", label: "Nº de Cuenta", type: "text", maxLength: 50 },
        { name: "tracking_url_template", label: "URL de Rastreo", type: "text", maxLength: 500, placeholder: "https://tracking.com/{numero}", gridCols: 2 },
      ],
    },
    {
      title: "Contacto",
      fields: [
        { name: "contact_name", label: "Nombre Contacto", type: "text", maxLength: 150 },
        { name: "contact_phone", label: "Teléfono Contacto", type: "text", maxLength: 30 },
        { name: "contact_email", label: "Email Contacto", type: "text", maxLength: 150, placeholder: "email@ejemplo.com" },
        { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
      ],
    },
  ],
  fields: [],
};
