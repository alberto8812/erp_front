import type { FormConfig } from "@/shared/presentation/types/form-config.types";

export const branchFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      fields: [
        { name: "branch_code", label: "Código", type: "text", required: true, maxLength: 20 },
        { name: "branch_name", label: "Nombre", type: "text", required: true, maxLength: 150 },
        {
          name: "branch_type",
          label: "Tipo de Sucursal",
          type: "select",
          options: [
            { label: "Sede Principal", value: "headquarters" },
            { label: "Sucursal", value: "branch" },
            { label: "Tienda", value: "store" },
            { label: "Bodega", value: "warehouse" },
            { label: "Oficina", value: "office" },
            { label: "Centro de Servicio", value: "service_center" },
          ],
          defaultValue: "branch",
        },
        { name: "address", label: "Dirección", type: "text", required: true, maxLength: 300, gridCols: 2 },
      ],
    },
    {
      title: "Contacto",
      fields: [
        { name: "phone", label: "Teléfono", type: "text", maxLength: 30, placeholder: "+57 300 000 0000" },
        { name: "email", label: "Correo Electrónico", type: "text", maxLength: 150, placeholder: "sucursal@empresa.com" },
      ],
    },
    {
      title: "Configuración",
      fields: [
        { name: "opening_date", label: "Fecha de Apertura", type: "date" },
        { name: "closing_date", label: "Fecha de Cierre", type: "date" },
        { name: "is_headquarters", label: "Es Sede Principal", type: "boolean", defaultValue: false },
        { name: "is_billing_location", label: "Punto de Facturación", type: "boolean", defaultValue: false },
        { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
      ],
    },
  ],
  fields: [],
};
