import type { FormConfig } from "@/shared/presentation/types/form-config.types";

export const currencyFormConfig: FormConfig = {
  fields: [
    { name: "iso_code", label: "Código ISO", type: "text", required: true, maxLength: 3, placeholder: "USD", pattern: { regex: "^[A-Z]{3}$", message: "Debe ser 3 letras mayúsculas" } },
    { name: "iso_numeric", label: "Código Numérico ISO", type: "text", required: true, maxLength: 3, placeholder: "840", pattern: { regex: "^\\d{3}$", message: "Debe ser 3 dígitos" } },
    { name: "name", label: "Nombre", type: "text", required: true, maxLength: 100 },
    { name: "name_en", label: "Nombre (Inglés)", type: "text", required: true, maxLength: 100, placeholder: "US Dollar" },
    { name: "symbol", label: "Símbolo", type: "text", required: true, maxLength: 10, placeholder: "$" },
    { name: "decimal_places", label: "Decimales", type: "number", min: 0, max: 4, defaultValue: 2 },
    { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
  ],
};
