import type { FormConfig } from "@/shared/presentation/types/form-config.types";

export const movementReasonFormConfig: FormConfig = {
  fields: [
    {
      name: "code",
      label: "Código",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "Ej: ADJ-001",
    },
    {
      name: "name",
      label: "Nombre",
      type: "text",
      required: true,
      maxLength: 200,
      placeholder: "Nombre de la razón de movimiento",
    },
    {
      name: "description",
      label: "Descripción",
      type: "textarea",
      gridCols: 2,
      placeholder: "Descripción detallada (opcional)",
    },
    // CRITICAL: movement_types is REQUIRED as an array in the backend DTO
    // TODO: Implement multiselect component for proper UX
    // For now, this field must be handled programmatically or with a custom component
    // Valid values from KardexMovementType enum:
    // purchase_receipt, production_receipt, transfer_in, return_from_customer, adjustment_in,
    // initial_inventory, found_inventory, sales_shipment, production_consumption, transfer_out,
    // return_to_vendor, adjustment_out, scrap, lost_inventory, sample, donation,
    // quality_hold, quality_release, location_transfer, lot_transfer, revaluation
    {
      name: "movement_types",
      label: "Tipos de Movimiento (array de valores separados por coma)",
      type: "textarea",
      required: true,
      placeholder: "Ej: adjustment_in, adjustment_out, initial_inventory",
      gridCols: 2,
    },
    {
      name: "requires_approval",
      label: "Requiere Aprobación",
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
};
