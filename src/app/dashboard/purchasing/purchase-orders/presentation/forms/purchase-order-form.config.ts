import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchVendors } from "@/app/dashboard/masters/third-party/application/use-cases/vendor-search.action";
import { searchPaymentTerms } from "@/app/dashboard/masters/payment-terms/application/use-cases/payment-term-search.action";
import { searchCurrencies } from "@/app/dashboard/masters/currencies/application/use-cases/currency-search.action";
import { searchWarehouses } from "@/app/dashboard/inventory/warehouses/application/use-cases/warehouse-search.action";
import {
  PURCHASE_ORDER_STATUS_OPTIONS,
  PURCHASE_SOURCE_TYPE_OPTIONS,
} from "../../../shared/types/purchasing.types";

export const purchaseOrderFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      description: "Datos principales de la orden de compra",
      fields: [
        {
          name: "order_date",
          label: "Fecha de Orden",
          type: "date",
          required: true,
          gridCols: 1,
        },
        {
          name: "expected_date",
          label: "Fecha Esperada de Entrega",
          type: "date",
          gridCols: 1,
        },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: PURCHASE_ORDER_STATUS_OPTIONS.map((o) => ({
            label: o.label,
            value: o.value,
          })),
          defaultValue: "draft",
          gridCols: 1,
        },
        {
          name: "source_type",
          label: "Origen",
          type: "select",
          options: PURCHASE_SOURCE_TYPE_OPTIONS.map((o) => ({
            label: o.label,
            value: o.value,
          })),
          defaultValue: "manual",
          gridCols: 1,
        },
      ],
    },
    {
      title: "Proveedor",
      description: "Información del proveedor",
      fields: [
        {
          name: "vendor_id",
          label: "Proveedor",
          type: "autocomplete",
          required: true,
          autocompleteConfig: {
            searchAction: searchVendors,
            returnMode: "code",
            placeholder: "Buscar proveedor por nombre o NIT...",
            initialDisplayValueField: "vendor.legal_name",
          },
          gridCols: 2,
        },
        {
          name: "vendor_reference",
          label: "Referencia del Proveedor",
          type: "text",
          maxLength: 100,
          placeholder: "Número de cotización o referencia",
          gridCols: 2,
        },
      ],
    },
    {
      title: "Términos Comerciales",
      description: "Moneda, términos de pago y almacén de destino",
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
          name: "destination_warehouse_id",
          label: "Almacén de Destino",
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
      title: "Costos Adicionales",
      description: "Fletes y otros gastos",
      fields: [
        {
          name: "shipping_amount",
          label: "Costo de Envío",
          type: "number",
          min: 0,
          defaultValue: 0,
          placeholder: "0.00",
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
          label: "Notas para el Proveedor",
          type: "textarea",
          placeholder: "Notas visibles para el proveedor",
          gridCols: 2,
        },
        {
          name: "internal_notes",
          label: "Notas Internas",
          type: "textarea",
          placeholder: "Notas internas (no visibles para el proveedor)",
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
