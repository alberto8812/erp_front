import type { FormConfig } from "@/shared/presentation/types/form-config.types";
import { searchCustomers } from "@/app/dashboard/masters/third-party/application/use-cases/third-party-search.action";
import { searchCurrencies } from "@/app/dashboard/masters/currencies/application/use-cases/currency-search.action";
import {
  PRICE_LIST_CUSTOMER_TYPE_OPTIONS,
  ROUNDING_RULE_OPTIONS,
} from "../../../shared/types/sales.types";

export const priceListFormConfig: FormConfig = {
  sections: [
    {
      title: "Información General",
      description: "Datos principales de la lista de precios",
      fields: [
        {
          name: "code",
          label: "Código",
          type: "text",
          required: true,
          placeholder: "PL-001",
          maxLength: 20,
          gridCols: 1,
        },
        {
          name: "name",
          label: "Nombre",
          type: "text",
          required: true,
          placeholder: "Lista de Precios General",
          maxLength: 100,
          gridCols: 1,
        },
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
          name: "priority",
          label: "Prioridad",
          type: "number",
          min: 1,
          max: 100,
          defaultValue: 10,
          placeholder: "10",
          gridCols: 1,
        },
      ],
    },
    {
      title: "Vigencia",
      description: "Período de validez de la lista de precios",
      fields: [
        {
          name: "effective_from",
          label: "Vigente Desde",
          type: "date",
          required: true,
          gridCols: 1,
        },
        {
          name: "effective_to",
          label: "Vigente Hasta",
          type: "date",
          gridCols: 1,
        },
      ],
    },
    {
      title: "Aplicación",
      description: "Tipo de cliente y configuración específica",
      fields: [
        {
          name: "customer_type",
          label: "Tipo de Cliente",
          type: "select",
          options: PRICE_LIST_CUSTOMER_TYPE_OPTIONS.map((o) => ({
            label: o.label,
            value: o.value,
          })),
          defaultValue: "all",
          gridCols: 1,
        },
        {
          name: "customer_id",
          label: "Cliente Específico",
          type: "autocomplete",
          autocompleteConfig: {
            searchAction: searchCustomers,
            returnMode: "code",
            placeholder: "Dejar vacío para aplicar a todos...",
            initialDisplayValueField: "customer.legal_name",
          },
          gridCols: 1,
        },
      ],
    },
    {
      title: "Configuración de Precios",
      description: "Descuentos, márgenes y redondeo",
      fields: [
        {
          name: "discount_percent",
          label: "Descuento General (%)",
          type: "number",
          min: 0,
          max: 100,
          placeholder: "0",
          gridCols: 1,
        },
        {
          name: "markup_percent",
          label: "Margen (%)",
          type: "number",
          min: 0,
          placeholder: "0",
          gridCols: 1,
        },
        {
          name: "rounding_rule",
          label: "Regla de Redondeo",
          type: "select",
          options: ROUNDING_RULE_OPTIONS.map((o) => ({
            label: o.label,
            value: o.value,
          })),
          defaultValue: "none",
          gridCols: 1,
        },
        {
          name: "rounding_precision",
          label: "Precisión de Redondeo",
          type: "number",
          min: 0,
          max: 4,
          defaultValue: 2,
          placeholder: "2",
          gridCols: 1,
        },
      ],
    },
    {
      title: "Opciones",
      description: "Configuración adicional",
      fields: [
        {
          name: "is_default",
          label: "Lista por Defecto",
          type: "boolean",
          defaultValue: false,
          gridCols: 1,
        },
        {
          name: "is_active",
          label: "Activa",
          type: "boolean",
          defaultValue: true,
          gridCols: 1,
        },
      ],
    },
    {
      title: "Notas",
      description: "Información adicional",
      fields: [
        {
          name: "description",
          label: "Descripción",
          type: "textarea",
          placeholder: "Descripción de la lista de precios",
          gridCols: 2,
        },
        {
          name: "notes",
          label: "Notas",
          type: "textarea",
          placeholder: "Notas adicionales",
          gridCols: 2,
        },
      ],
    },
  ],
  fields: [],
};
