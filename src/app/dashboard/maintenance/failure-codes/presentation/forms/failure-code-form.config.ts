import type { FormConfig } from "@/shared/presentation/types/form-config.types";

const CODE_TYPE_OPTIONS = [
  { label: "Falla", value: "failure" },
  { label: "Causa", value: "cause" },
  { label: "Acción Correctiva", value: "action" },
];

const CATEGORY_OPTIONS = [
  { label: "Eléctrico", value: "electrical" },
  { label: "Mecánico", value: "mechanical" },
  { label: "Hidráulico", value: "hydraulic" },
  { label: "Neumático", value: "pneumatic" },
  { label: "Electrónico", value: "electronic" },
  { label: "Software", value: "software" },
  { label: "Operacional", value: "operational" },
  { label: "Desgaste", value: "wear" },
  { label: "Otro", value: "other" },
];

export const failureCodeFormConfig: FormConfig = {
  sections: [
    {
      title: "Información del Código",
      fields: [
        {
          name: "code",
          label: "Código",
          type: "text",
          required: true,
          maxLength: 20,
          placeholder: "FC-001",
        },
        {
          name: "name",
          label: "Nombre",
          type: "text",
          required: true,
          maxLength: 100,
          placeholder: "Falla de motor",
        },
        {
          name: "code_type",
          label: "Tipo",
          type: "select",
          required: true,
          options: CODE_TYPE_OPTIONS,
          defaultValue: "failure",
        },
        {
          name: "category",
          label: "Categoría",
          type: "select",
          options: CATEGORY_OPTIONS,
        },
      ],
    },
    {
      title: "Detalles",
      fields: [
        {
          name: "description",
          label: "Descripción",
          type: "textarea",
          gridCols: 2,
          placeholder: "Descripción detallada del código...",
        },
        {
          name: "is_active",
          label: "Activo",
          type: "switch",
          defaultValue: true,
        },
      ],
    },
  ],
  fields: [],
};
