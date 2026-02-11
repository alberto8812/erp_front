import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchProductCategories } from "@/app/dashboard/inventory/product-categories/application/use-cases/product-category-search.action";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";
import { searchUom } from "@/app/dashboard/masters/uom/application/use-cases/uom-search.action";
import { searchVendors } from "@/app/dashboard/masters/third-party/application/use-cases/vendor-search.action";
import {
  PRODUCT_TYPE_OPTIONS,
  VALUATION_METHOD_OPTIONS,
} from "@/app/dashboard/inventory/shared/types/inventory.types";

export const productFormConfig: FormConfig = {
  sections: [
    {
      title: "Identificación",
      description: "Información básica del producto",
      fields: [
        {
          name: "sku",
          label: "SKU",
          type: "text",
          required: true,
          maxLength: 100,
          placeholder: "Código único del producto",
        },
        {
          name: "barcode",
          label: "Código de Barras",
          type: "text",
          maxLength: 100,
          placeholder: "EAN, UPC, etc.",
        },
        {
          name: "name",
          label: "Nombre",
          type: "text",
          required: true,
          maxLength: 200,
          gridCols: 2,
          placeholder: "Nombre del producto",
        },
        {
          name: "description",
          label: "Descripción",
          type: "textarea",
          gridCols: 2,
          placeholder: "Descripción detallada del producto",
        },
      ],
    },
    {
      title: "Clasificación",
      fields: [
        {
          name: "product_type",
          label: "Tipo de Producto",
          type: "select",
          required: true,
          options: PRODUCT_TYPE_OPTIONS.map((o) => ({ label: o.label, value: o.value })),
          defaultValue: "stockable",
        },
        {
          name: "category_id",
          label: "Categoría",
          type: "autocomplete",
          autocompleteConfig: {
            searchAction: searchProductCategories,
            returnMode: "code",
            placeholder: "Buscar categoría...",
          },
        },
        {
          name: "subcategory_id",
          label: "Subcategoría",
          type: "autocomplete",
          required: false,
          autocompleteConfig: {
            searchAction: searchProductCategories,
            returnMode: "code",
            placeholder: "Buscar subcategoría...",
          },
        },
        // TODO: Implementar módulo de Brands
        // {
        //   name: "brand_id",
        //   label: "Marca",
        //   type: "autocomplete",
        //   required: false,
        //   autocompleteConfig: {
        //     searchAction: searchBrands,
        //     returnMode: "code",
        //     placeholder: "Buscar marca...",
        //   },
        // },
        {
          name: "base_uom_id",
          label: "Unidad de Medida Base",
          type: "autocomplete",
          required: true,
          autocompleteConfig: {
            searchAction: searchUom,
            returnMode: "code",
            placeholder: "Buscar unidad de medida...",
          },
        },
        {
          name: "purchase_uom_id",
          label: "UOM Compras",
          type: "autocomplete",
          autocompleteConfig: {
            searchAction: searchUom,
            returnMode: "code",
            placeholder: "Buscar UOM para compras...",
          },
        },
        {
          name: "sales_uom_id",
          label: "UOM Ventas",
          type: "autocomplete",
          autocompleteConfig: {
            searchAction: searchUom,
            returnMode: "code",
            placeholder: "Buscar UOM para ventas...",
          },
        },
      ],
    },
    {
      title: "Control de Inventario",
      fields: [
        {
          name: "valuation_method",
          label: "Método de Valorización",
          type: "select",
          required: true,
          options: VALUATION_METHOD_OPTIONS.map((o) => ({ label: o.label, value: o.value })),
          defaultValue: "average",
        },
        {
          name: "is_inventory_tracked",
          label: "Control de Inventario",
          type: "boolean",
          defaultValue: true,
        },
        {
          name: "is_lot_tracked",
          label: "Control por Lotes",
          type: "boolean",
          defaultValue: false,
        },
        {
          name: "is_serial_tracked",
          label: "Control por Serial",
          type: "boolean",
          defaultValue: false,
        },
        {
          name: "is_purchaseable",
          label: "Se puede comprar",
          type: "boolean",
          defaultValue: true,
        },
        {
          name: "is_saleable",
          label: "Se puede vender",
          type: "boolean",
          defaultValue: true,
        },
        {
          name: "is_manufacturable",
          label: "Se puede fabricar",
          type: "boolean",
          defaultValue: false,
        },
      ],
    },
    {
      title: "Costos y Precios",
      fields: [
        {
          name: "standard_cost",
          label: "Costo Estándar",
          type: "number",
          min: 0,
          placeholder: "0.00",
        },
        {
          name: "base_price",
          label: "Precio Base",
          type: "number",
          min: 0,
          placeholder: "0.00",
        },
        {
          name: "min_sale_price",
          label: "Precio Mínimo Venta",
          type: "number",
          min: 0,
          placeholder: "0.00",
        },
      ],
    },
    {
      title: "Reabastecimiento",
      description: "Configuración de puntos de reorden y stock",
      fields: [
        {
          name: "default_warehouse_id",
          label: "Almacén por Defecto",
          type: "autocomplete",
          autocompleteConfig: {
            searchAction: searchWarehouses,
            returnMode: "code",
            placeholder: "Buscar almacén...",
          },
        },
        {
          name: "default_vendor_id",
          label: "Proveedor por Defecto",
          type: "autocomplete",
          required: false,
          autocompleteConfig: {
            searchAction: searchVendors,
            returnMode: "code",
            placeholder: "Buscar proveedor...",
          },
        },
        {
          name: "reorder_point",
          label: "Punto de Reorden",
          type: "number",
          min: 0,
          placeholder: "Cantidad mínima antes de reordenar",
        },
        {
          name: "reorder_quantity",
          label: "Cantidad a Reordenar",
          type: "number",
          min: 0,
          placeholder: "Cantidad a pedir",
        },
        {
          name: "safety_stock",
          label: "Stock de Seguridad",
          type: "number",
          min: 0,
        },
        {
          name: "min_stock",
          label: "Stock Mínimo",
          type: "number",
          min: 0,
        },
        {
          name: "max_stock",
          label: "Stock Máximo",
          type: "number",
          min: 0,
        },
        {
          name: "lead_time_days",
          label: "Tiempo de Entrega (días)",
          type: "number",
          min: 0,
          defaultValue: 0,
        },
      ],
    },
    {
      title: "Dimensiones Físicas",
      description: "Peso y medidas del producto",
      fields: [
        {
          name: "weight",
          label: "Peso",
          type: "number",
          min: 0,
        },
        {
          name: "weight_uom",
          label: "UOM Peso",
          type: "text",
          maxLength: 20,
          placeholder: "Ej: kg, lb, g",
        },
        {
          name: "length",
          label: "Largo",
          type: "number",
          min: 0,
        },
        {
          name: "width",
          label: "Ancho",
          type: "number",
          min: 0,
        },
        {
          name: "height",
          label: "Alto",
          type: "number",
          min: 0,
        },
        {
          name: "dimensions_uom",
          label: "UOM Dimensiones",
          type: "text",
          maxLength: 20,
          placeholder: "Ej: cm, m, in",
        },
        {
          name: "shelf_life_days",
          label: "Vida Útil (días)",
          type: "number",
          min: 0,
        },
        {
          name: "warranty_days",
          label: "Garantía (días)",
          type: "number",
          min: 0,
        },
      ],
    },
  ],
  fields: [],
};
