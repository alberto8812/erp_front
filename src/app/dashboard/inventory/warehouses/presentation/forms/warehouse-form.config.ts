import type { FormConfig } from "@/shared/presentation/types/form-config.types";

export const warehouseFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      fields: [
        {
          name: "code",
          label: "Código",
          type: "text",
          required: true,
          maxLength: 50,
          placeholder: "Ej: ALM-001",
        },
        {
          name: "name",
          label: "Nombre",
          type: "text",
          required: true,
          maxLength: 200,
          placeholder: "Nombre del almacén",
        },
        {
          name: "type",
          label: "Tipo de Almacén",
          type: "select",
          required: true,
          options: [
            { label: "Físico", value: "physical" },
            { label: "Virtual", value: "virtual" },
            { label: "Consignación", value: "consignment" },
            { label: "Tránsito", value: "transit" },
          ],
          defaultValue: "physical",
        },
        // TODO: Implementar searchUsers cuando exista el módulo
        // {
        //   name: "manager_id",
        //   label: "Responsable",
        //   type: "autocomplete",
        //   required: false,
        //   autocompleteConfig: {
        //     searchAction: searchUsers,
        //     returnMode: "code",
        //     placeholder: "Buscar responsable...",
        //   },
        // },
        {
          name: "description",
          label: "Descripción",
          type: "textarea",
          required: false,
          gridCols: 2,
          placeholder: "Descripción del almacén (opcional)",
        },
      ],
    },
    {
      title: "Dirección",
      fields: [
        {
          name: "address_line1",
          label: "Dirección Línea 1",
          type: "text",
          maxLength: 200,
          placeholder: "Calle, número, etc.",
        },
        {
          name: "address_line2",
          label: "Dirección Línea 2",
          type: "text",
          maxLength: 200,
          placeholder: "Edificio, piso, etc. (opcional)",
        },
        {
          name: "city",
          label: "Ciudad",
          type: "text",
          maxLength: 100,
        },
        {
          name: "state",
          label: "Estado/Departamento",
          type: "text",
          maxLength: 100,
        },
        {
          name: "country",
          label: "País",
          type: "text",
          maxLength: 100,
        },
        {
          name: "postal_code",
          label: "Código Postal",
          type: "text",
          maxLength: 20,
        },
      ],
    },
    {
      title: "Contacto",
      fields: [
        {
          name: "phone",
          label: "Teléfono",
          type: "text",
          maxLength: 25,
          placeholder: "+57 300 000 0000",
        },
        {
          name: "email",
          label: "Email",
          type: "text",
          maxLength: 100,
          placeholder: "almacen@empresa.com",
        },
      ],
    },
    {
      title: "Configuración",
      fields: [
        {
          name: "is_default",
          label: "Almacén por defecto",
          type: "boolean",
          defaultValue: false,
        },
        {
          name: "allows_negative_stock",
          label: "Permitir stock negativo",
          type: "boolean",
          defaultValue: false,
        },
        {
          name: "is_active",
          label: "Activo",
          type: "boolean",
          defaultValue: true,
        },
      ],
    },
  ],
  fields: [],
};
