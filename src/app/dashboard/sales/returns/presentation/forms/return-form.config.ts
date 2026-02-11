import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchCustomers } from "@/app/dashboard/masters/third-party/application/use-cases/third-party-search.action";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";
import { searchCurrencies } from "@/app/dashboard/masters/currencies/application/use-cases/currency-search.action";
import {
  RETURN_STATUS_OPTIONS,
  RETURN_REASON_OPTIONS,
  REFUND_METHOD_OPTIONS,
} from "../../../shared/types/sales.types";

export const returnFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      description: "Datos principales de la devolución",
      fields: [
        {
          name: "return_date",
          label: "Fecha de Devolución",
          type: "date",
          required: true,
          gridCols: 1,
        },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: RETURN_STATUS_OPTIONS.map((o) => ({
            label: o.label,
            value: o.value,
          })),
          defaultValue: "draft",
          gridCols: 1,
        },
        {
          name: "reason_code",
          label: "Motivo de Devolución",
          type: "select",
          required: true,
          options: RETURN_REASON_OPTIONS.map((o) => ({
            label: o.label,
            value: o.value,
          })),
          gridCols: 1,
        },
        {
          name: "refund_method",
          label: "Método de Reembolso",
          type: "select",
          options: REFUND_METHOD_OPTIONS.map((o) => ({
            label: o.label,
            value: o.value,
          })),
          gridCols: 1,
        },
      ],
    },
    {
      title: "Cliente y Almacén",
      description: "Cliente que realiza la devolución y almacén de recepción",
      fields: [
        {
          name: "customer_id",
          label: "Cliente",
          type: "autocomplete",
          required: true,
          autocompleteConfig: {
            searchAction: searchCustomers,
            returnMode: "code",
            placeholder: "Buscar cliente por nombre o NIT...",
            initialDisplayValueField: "customer.legal_name",
          },
          gridCols: 1,
        },
        {
          name: "warehouse_id",
          label: "Almacén de Recepción",
          type: "autocomplete",
          autocompleteConfig: {
            searchAction: searchWarehouses,
            returnMode: "code",
            placeholder: "Buscar almacén...",
            initialDisplayValueField: "warehouse.name",
          },
          gridCols: 1,
        },
      ],
    },
    {
      title: "Moneda",
      description: "Moneda de la transacción",
      fields: [
        {
          name: "currency",
          label: "Moneda",
          type: "autocomplete",
          required: true,
          autocompleteConfig: {
            searchAction: searchCurrencies,
            returnMode: "code",
            placeholder: "Buscar moneda...",
          },
          gridCols: 1,
        },
        {
          name: "exchange_rate",
          label: "Tasa de Cambio",
          type: "number",
          min: 0,
          defaultValue: 1,
          placeholder: "1.00",
          gridCols: 1,
        },
      ],
    },
    {
      title: "Notas",
      description: "Observaciones adicionales",
      fields: [
        {
          name: "notes",
          label: "Notas para el Cliente",
          type: "textarea",
          placeholder: "Notas visibles para el cliente",
          gridCols: 2,
        },
        {
          name: "internal_notes",
          label: "Notas Internas",
          type: "textarea",
          placeholder: "Notas internas (no visibles para el cliente)",
          gridCols: 2,
        },
      ],
    },
  ],
  fields: [],
};
