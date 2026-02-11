import type { FormConfig } from "@/shared/presentation/types/form-config.types";

export const incotermFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      fields: [
        { name: "code", label: "Código", type: "text", required: true, maxLength: 10 },
        { name: "name", label: "Nombre", type: "text", required: true, maxLength: 100 },
        { name: "description", label: "Descripción", type: "textarea", required: true, maxLength: 500, gridCols: 2 },
        {
          name: "version",
          label: "Versión",
          type: "select",
          options: [
            { label: "2020", value: "2020" },
            { label: "2010", value: "2010" },
          ],
          defaultValue: "2020",
        },
        {
          name: "applies_to",
          label: "Tipo de Transporte",
          type: "select",
          options: [
            { label: "Cualquiera", value: "any" },
            { label: "Marítimo", value: "sea" },
            { label: "Aéreo", value: "air" },
            { label: "Terrestre", value: "land" },
          ],
          defaultValue: "any",
        },
      ],
    },
    {
      title: "Obligaciones y Riesgo",
      fields: [
        { name: "seller_obligations", label: "Obligaciones del Vendedor", type: "textarea", gridCols: 2 },
        { name: "buyer_obligations", label: "Obligaciones del Comprador", type: "textarea", gridCols: 2 },
        { name: "risk_transfer_point", label: "Punto de Transferencia de Riesgo", type: "text", maxLength: 500, gridCols: 2 },
        { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
      ],
    },
  ],
  fields: [],
};
