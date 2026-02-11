import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";
import { searchWarehouseLocations } from "@/app/dashboard/inventory/warehouse-locations/application/use-cases/warehouse-location-search.action";
import { LOCATION_TYPE_OPTIONS } from "@/app/dashboard/inventory/shared/types/inventory.types";

export const warehouseLocationFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      fields: [
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
          name: "parent_location_id",
          label: "Ubicación Padre",
          type: "autocomplete",
          required: false,
          autocompleteConfig: {
            searchAction: searchWarehouseLocations,
            returnMode: "code",
            placeholder: "Buscar ubicación padre...",
          },
        },
        {
          name: "code",
          label: "Código",
          type: "text",
          required: true,
          maxLength: 50,
          placeholder: "Ej: UBI-A01-R01",
        },
        {
          name: "name",
          label: "Nombre",
          type: "text",
          required: true,
          maxLength: 200,
          placeholder: "Nombre de la ubicación",
        },
        {
          name: "location_type",
          label: "Tipo de Ubicación",
          type: "select",
          required: true,
          options: LOCATION_TYPE_OPTIONS.map((o) => ({ label: o.label, value: o.value })),
          defaultValue: "storage",
        },
      ],
    },
    {
      title: "Jerarquía de Ubicación",
      description: "Define la posición física dentro del almacén",
      fields: [
        {
          name: "zone",
          label: "Zona",
          type: "text",
          maxLength: 50,
          placeholder: "Ej: ZONA-A",
        },
        {
          name: "aisle",
          label: "Pasillo",
          type: "text",
          maxLength: 20,
          placeholder: "Ej: 01",
        },
        {
          name: "rack",
          label: "Rack",
          type: "text",
          maxLength: 20,
          placeholder: "Ej: R01",
        },
        {
          name: "shelf",
          label: "Estante",
          type: "text",
          maxLength: 20,
          placeholder: "Ej: E01",
        },
        {
          name: "bin",
          label: "Bin",
          type: "text",
          maxLength: 20,
          placeholder: "Ej: B01",
        },
        {
          name: "picking_sequence",
          label: "Secuencia de Picking",
          type: "number",
          defaultValue: 0,
          min: 0,
        },
      ],
    },
    {
      title: "Capacidad",
      description: "Límites de capacidad de la ubicación",
      fields: [
        {
          name: "max_weight",
          label: "Peso Máximo (kg)",
          type: "number",
          min: 0,
        },
        {
          name: "max_volume",
          label: "Volumen Máximo (m³)",
          type: "number",
          min: 0,
        },
        {
          name: "max_items",
          label: "Ítems Máximos",
          type: "number",
          min: 0,
        },
      ],
    },
    {
      title: "Configuración",
      fields: [
        {
          name: "is_pickable",
          label: "Disponible para Picking",
          type: "boolean",
          defaultValue: true,
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
