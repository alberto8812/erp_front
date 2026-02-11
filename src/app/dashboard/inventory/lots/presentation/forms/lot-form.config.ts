import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchProducts } from "@/app/dashboard/inventory/products/application/use-cases/product-search.action";
import { searchVendors } from "@/app/dashboard/masters/third-party/application/use-cases/vendor-search.action";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";
import { searchWarehouseLocations } from "@/app/dashboard/inventory/warehouse-locations/application/use-cases/warehouse-location-search.action";
import { LOT_STATUS_OPTIONS } from "@/app/dashboard/inventory/shared/types/inventory.types";

export const lotFormConfig: FormConfig = {
  sections: [
    {
      title: "Identificación",
      fields: [
        {
          name: "product_id",
          label: "Producto",
          type: "autocomplete",
          required: true,
          autocompleteConfig: {
            searchAction: searchProducts,
            returnMode: "code",
            placeholder: "Buscar producto por SKU o nombre...",
          },
        },
        {
          name: "vendor_id",
          label: "Proveedor",
          type: "autocomplete",
          required: false,
          autocompleteConfig: {
            searchAction: searchVendors,
            returnMode: "code",
            placeholder: "Buscar proveedor...",
          },
        },
        {
          name: "warehouse_id",
          label: "Almacén",
          type: "autocomplete",
          required: true,
          autocompleteConfig: {
            searchAction: searchWarehouses,
            returnMode: "code",
            placeholder: "Buscar almacén...",
          },
        },
        {
          name: "location_id",
          label: "Ubicación",
          type: "autocomplete",
          required: false,
          autocompleteConfig: {
            searchAction: searchWarehouseLocations,
            returnMode: "code",
            placeholder: "Buscar ubicación...",
          },
        },
        {
          name: "lot_number",
          label: "Número de Lote",
          type: "text",
          required: true,
          maxLength: 100,
          placeholder: "Ej: LOT-2024-001",
        },
        {
          name: "internal_lot",
          label: "Lote Interno",
          type: "text",
          maxLength: 100,
          placeholder: "Referencia interna (opcional)",
        },
        {
          name: "supplier_lot",
          label: "Lote del Proveedor",
          type: "text",
          maxLength: 100,
          placeholder: "Lote según proveedor (opcional)",
        },
        {
          name: "serial_number",
          label: "Número de Serie",
          type: "text",
          maxLength: 100,
          placeholder: "Solo para productos serializados",
        },
      ],
    },
    {
      title: "Fechas",
      fields: [
        {
          name: "manufacture_date",
          label: "Fecha de Fabricación",
          type: "date",
        },
        {
          name: "receipt_date",
          label: "Fecha de Recepción",
          type: "date",
        },
        {
          name: "expiration_date",
          label: "Fecha de Vencimiento",
          type: "date",
        },
        {
          name: "best_before_date",
          label: "Consumir Preferentemente Antes de",
          type: "date",
        },
      ],
    },
    {
      title: "Cantidades y Costos",
      fields: [
        {
          name: "initial_quantity",
          label: "Cantidad Inicial",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "current_quantity",
          label: "Cantidad Actual",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "reserved_quantity",
          label: "Cantidad Reservada",
          type: "number",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "unit_cost",
          label: "Costo Unitario",
          type: "number",
          min: 0,
        },
      ],
    },
    {
      title: "Estado",
      fields: [
        {
          name: "status",
          label: "Estado del Lote",
          type: "select",
          required: true,
          options: LOT_STATUS_OPTIONS.map((o) => ({ label: o.label, value: o.value })),
          defaultValue: "available",
        },
        {
          name: "blocked_reason",
          label: "Razón de Bloqueo",
          type: "textarea",
          gridCols: 2,
          placeholder: "Indique la razón si el lote está bloqueado",
        },
        {
          name: "quality_status",
          label: "Estado de Calidad",
          type: "text",
          maxLength: 50,
          placeholder: "Ej: Aprobado, Pendiente, Rechazado",
        },
      ],
    },
  ],
  fields: [],
};
