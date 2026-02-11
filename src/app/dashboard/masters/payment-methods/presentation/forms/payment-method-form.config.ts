import type { FormConfig } from "@/shared/presentation/types/form-config.types";

export const paymentMethodFormConfig: FormConfig = {
  fields: [
    { name: "code", label: "Código", type: "text", required: true, maxLength: 30 },
    { name: "name", label: "Nombre", type: "text", required: true, maxLength: 100 },
    { name: "description", label: "Descripción", type: "textarea", maxLength: 255, gridCols: 2 },
    {
      name: "payment_type",
      label: "Tipo de Pago",
      type: "select",
      options: [
        { label: "Efectivo", value: "cash" },
        { label: "Transferencia Bancaria", value: "bank_transfer" },
        { label: "Cheque", value: "check" },
        { label: "Tarjeta de Crédito", value: "credit_card" },
        { label: "Tarjeta Débito", value: "debit_card" },
        { label: "Electrónico", value: "electronic" },
        { label: "Crédito", value: "credit" },
        { label: "Otro", value: "other" },
      ],
      defaultValue: "cash",
    },
    { name: "requires_reference", label: "Requiere Referencia", type: "boolean", defaultValue: false },
    { name: "requires_bank_account", label: "Requiere Cuenta Bancaria", type: "boolean", defaultValue: false },
    { name: "is_active", label: "Activo", type: "boolean", defaultValue: true },
  ],
};
