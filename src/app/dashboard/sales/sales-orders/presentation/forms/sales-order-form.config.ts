import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchCustomers } from "@/app/dashboard/masters/third-party/application/use-cases/third-party-search.action";
import { searchPaymentTerms } from "@/app/dashboard/masters/payment-terms/application/use-cases/payment-term-search.action";
import { searchCurrencies } from "@/app/dashboard/masters/currencies/application/use-cases/currency-search.action";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";
import { SALES_ORDER_STATUS_OPTIONS } from "../../../shared/types/sales.types";

export const salesOrderFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      description: "Datos principales de la orden de venta",
      fields: [
        {
          name: "order_date",
          label: "Fecha de Orden",
          type: "date",
          required: true,
          gridCols: 1,
        },
        {
          name: "expected_ship_date",
          label: "Fecha Estimada de Envío",
          type: "date",
          gridCols: 1,
        },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: SALES_ORDER_STATUS_OPTIONS.map((o) => ({
            label: o.label,
            value: o.value,
          })),
          defaultValue: "draft",
          gridCols: 1,
        },
        {
          name: "customer_po",
          label: "OC del Cliente",
          type: "text",
          maxLength: 100,
          placeholder: "Número de orden del cliente",
          gridCols: 1,
        },
      ],
    },
    {
      title: "Cliente",
      description: "Información del cliente y contacto",
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
          gridCols: 2,
        },
      ],
    },
    {
      title: "Términos Comerciales",
      description: "Moneda, términos de pago y almacén",
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
        {
          name: "payment_term_id",
          label: "Condición de Pago",
          type: "autocomplete",
          autocompleteConfig: {
            searchAction: searchPaymentTerms,
            returnMode: "code",
            placeholder: "Buscar condición de pago...",
            initialDisplayValueField: "payment_term.name",
          },
          gridCols: 1,
        },
        {
          name: "default_warehouse_id",
          label: "Almacén por Defecto",
          type: "autocomplete",
          autocompleteConfig: {
            searchAction: searchWarehouses,
            returnMode: "code",
            placeholder: "Buscar almacén...",
          },
          gridCols: 1,
        },
      ],
    },
    {
      title: "Notas",
      description: "Observaciones y condiciones adicionales",
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
        {
          name: "terms_conditions",
          label: "Términos y Condiciones",
          type: "textarea",
          placeholder: "Términos y condiciones aplicables",
          gridCols: 2,
        },
      ],
    },
  ],
  fields: [],
};
