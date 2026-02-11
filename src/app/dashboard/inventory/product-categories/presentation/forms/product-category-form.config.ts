import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchProductCategories } from "../../application/use-cases/product-category-search.action";

export const productCategoryFormConfig: FormConfig = {
  fields: [
    {
      name: "code",
      label: "Código",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "Ej: CAT-001",
    },
    {
      name: "name",
      label: "Nombre",
      type: "text",
      required: true,
      maxLength: 200,
      placeholder: "Nombre de la categoría",
    },
    {
      name: "parent_category_id",
      label: "Categoría Padre",
      type: "autocomplete",
      required: false,
      autocompleteConfig: {
        searchAction: searchProductCategories,
        returnMode: "code",
        placeholder: "Buscar categoría padre...",
        initialDisplayValueField: "parent_category_name",
      },
    },
    {
      name: "description",
      label: "Descripción",
      type: "textarea",
      required: false,
      gridCols: 2,
      placeholder: "Descripción de la categoría (opcional)",
    },
    {
      name: "is_active",
      label: "Activo",
      type: "boolean",
      defaultValue: true,
    },
  ],
};
