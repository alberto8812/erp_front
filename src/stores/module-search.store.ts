import { create } from "zustand";
import {
  ShoppingCart,
  FileSpreadsheet,
  PackageCheck,
  RotateCcw,
  Receipt,
  ShoppingBag,
  ClipboardCheck,
  PackageOpen,
  ReceiptText,
  Star,
  FolderTree,
  Package,
  Tags,
  Warehouse,
  MapPinned,
  Layers,
  Box,
  ScrollText,
  ClipboardList,
  Gauge,
  Cog,
  ClipboardPen,
  Clock,
  AlertTriangle,
  Users,
  Truck,
  Store,
  FileText,
  Hash,
  CreditCard,
  Landmark,
  Wallet,
  CircleDollarSign,
  Banknote,
  Ship,
  Globe,
  MapPin,
  Building2,
  FileCheck,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface ModuleItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export interface ModuleSubGroup {
  label: string;
  items: ModuleItem[];
}

export interface ModuleSection {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  subGroups: ModuleSubGroup[];
}

// All ERP modules organized by section
export const allModules: ModuleSection[] = [
  {
    id: "ventas",
    label: "Ventas",
    icon: ShoppingCart,
    color: "text-emerald-600",
    subGroups: [
      {
        label: "Transacciones",
        items: [
          { title: "Órdenes de Venta", href: "/dashboard/sales/sales-orders", icon: ShoppingCart, description: "Gestión de pedidos de clientes" },
          { title: "Cotizaciones", href: "/dashboard/sales/quotations", icon: FileSpreadsheet, description: "Propuestas comerciales" },
          { title: "Despachos", href: "/dashboard/sales/shipments", icon: PackageCheck, description: "Envíos y entregas" },
          { title: "Devoluciones", href: "/dashboard/sales/returns", icon: RotateCcw, description: "Gestión de devoluciones" },
          { title: "Facturas", href: "/dashboard/sales/invoices", icon: ReceiptText, description: "Facturación electrónica" },
          { title: "Notas Crédito", href: "/dashboard/sales/credit-notes", icon: FileCheck, description: "Notas de crédito" },
        ],
      },
      {
        label: "Configuración",
        items: [
          { title: "Listas de Precios", href: "/dashboard/sales/price-lists", icon: Receipt, description: "Precios y descuentos" },
        ],
      },
    ],
  },
  {
    id: "compras",
    label: "Compras",
    icon: ShoppingBag,
    color: "text-blue-600",
    subGroups: [
      {
        label: "Transacciones",
        items: [
          { title: "Órdenes de Compra", href: "/dashboard/purchasing/purchase-orders", icon: ShoppingBag, description: "Pedidos a proveedores" },
          { title: "Requisiciones", href: "/dashboard/purchasing/requisitions", icon: ClipboardCheck, description: "Solicitudes internas" },
          { title: "Recepciones", href: "/dashboard/purchasing/receipts", icon: PackageOpen, description: "Entrada de mercancía" },
          { title: "Facturas Proveedor", href: "/dashboard/purchasing/vendor-invoices", icon: ReceiptText, description: "Facturas de compra" },
        ],
      },
      {
        label: "Gestión",
        items: [
          { title: "Evaluación Proveedores", href: "/dashboard/purchasing/vendor-evaluations", icon: Star, description: "Calificación de proveedores" },
        ],
      },
    ],
  },
  {
    id: "inventario",
    label: "Inventario",
    icon: Package,
    color: "text-orange-600",
    subGroups: [
      {
        label: "Catálogos",
        items: [
          { title: "Productos", href: "/dashboard/inventory/products", icon: Package, description: "Catálogo de productos" },
          { title: "Categorías", href: "/dashboard/inventory/product-categories", icon: FolderTree, description: "Clasificación de productos" },
          { title: "Razones de Movimiento", href: "/dashboard/inventory/movement-reasons", icon: Tags, description: "Motivos de ajuste" },
        ],
      },
      {
        label: "Almacenes",
        items: [
          { title: "Almacenes", href: "/dashboard/inventory/warehouses", icon: Warehouse, description: "Centros de almacenamiento" },
          { title: "Ubicaciones", href: "/dashboard/inventory/warehouse-locations", icon: MapPinned, description: "Zonas y estantes" },
        ],
      },
      {
        label: "Control",
        items: [
          { title: "Niveles de Stock", href: "/dashboard/inventory/stock-levels", icon: Box, description: "Disponibilidad actual" },
          { title: "Lotes", href: "/dashboard/inventory/lots", icon: Layers, description: "Trazabilidad por lote" },
          { title: "Ajustes", href: "/dashboard/inventory/adjustments", icon: ClipboardCheck, description: "Ajustes de inventario" },
        ],
      },
      {
        label: "Movimientos",
        items: [
          { title: "Kardex", href: "/dashboard/inventory/kardex", icon: ScrollText, description: "Historial de movimientos" },
          { title: "Conteos", href: "/dashboard/inventory/inventory-counts", icon: ClipboardList, description: "Inventario físico" },
        ],
      },
    ],
  },
  {
    id: "mantenimiento",
    label: "Mantenimiento",
    icon: Cog,
    color: "text-violet-600",
    subGroups: [
      {
        label: "Principal",
        items: [
          { title: "Dashboard", href: "/dashboard/maintenance", icon: Gauge, description: "Panel de mantenimiento" },
        ],
      },
      {
        label: "Gestión",
        items: [
          { title: "Activos / Equipos", href: "/dashboard/maintenance/assets", icon: Cog, description: "Equipos y maquinaria" },
          { title: "Órdenes de Trabajo", href: "/dashboard/maintenance/work-orders", icon: ClipboardPen, description: "Trabajos programados" },
          { title: "Planes Preventivos", href: "/dashboard/maintenance/plans", icon: ClipboardList, description: "Mantenimiento preventivo" },
        ],
      },
      {
        label: "Control",
        items: [
          { title: "Tiempos de Parada", href: "/dashboard/maintenance/downtime", icon: Clock, description: "Registro de paradas" },
          { title: "Fallas y Causas", href: "/dashboard/maintenance/failure-codes", icon: AlertTriangle, description: "Códigos de falla" },
        ],
      },
    ],
  },
  {
    id: "maestros",
    label: "Maestros",
    icon: Building2,
    color: "text-slate-600",
    subGroups: [
      {
        label: "Entidades",
        items: [
          { title: "Terceros", href: "/dashboard/masters/third-party", icon: Users, description: "Clientes, proveedores, empleados" },
          { title: "Transportistas", href: "/dashboard/masters/carriers", icon: Truck, description: "Empresas de transporte" },
          { title: "Sucursales", href: "/dashboard/masters/branches", icon: Store, description: "Puntos de venta" },
        ],
      },
      {
        label: "Documentos",
        items: [
          { title: "Tipos de Documento", href: "/dashboard/masters/document-types", icon: FileText, description: "Tipos de identificación" },
          { title: "Secuencias", href: "/dashboard/masters/document-sequences", icon: Hash, description: "Numeración automática" },
        ],
      },
      {
        label: "Pagos",
        items: [
          { title: "Condiciones de Pago", href: "/dashboard/masters/payment-terms", icon: Receipt, description: "Plazos y condiciones" },
          { title: "Métodos de Pago", href: "/dashboard/masters/payment-methods", icon: CreditCard, description: "Formas de pago" },
          { title: "Bancos", href: "/dashboard/masters/banks", icon: Landmark, description: "Entidades bancarias" },
          { title: "Cuentas Bancarias", href: "/dashboard/masters/bank-accounts", icon: Wallet, description: "Cuentas de la empresa" },
        ],
      },
      {
        label: "Fiscal",
        items: [
          { title: "Responsab. Tributarias", href: "/dashboard/masters/tax-responsibilities", icon: CircleDollarSign, description: "Obligaciones fiscales" },
          { title: "Actividades Económicas", href: "/dashboard/masters/economic-activities", icon: Banknote, description: "CIIU y actividades" },
          { title: "Monedas", href: "/dashboard/masters/currencies", icon: Banknote, description: "Divisas y tasas" },
        ],
      },
      {
        label: "Envío",
        items: [
          { title: "Métodos de Envío", href: "/dashboard/masters/shipping-methods", icon: Ship, description: "Formas de despacho" },
          { title: "Incoterms", href: "/dashboard/masters/incoterms", icon: Globe, description: "Términos comerciales" },
        ],
      },
      {
        label: "Geografía",
        items: [
          { title: "Países", href: "/dashboard/masters/countries", icon: Globe, description: "Catálogo de países" },
          { title: "Departamentos", href: "/dashboard/masters/state-deparment", icon: MapPin, description: "Estados y departamentos" },
          { title: "Ciudades", href: "/dashboard/masters/city", icon: Building2, description: "Municipios y ciudades" },
          { title: "Regiones y Zonas", href: "/dashboard/masters/regions-zones", icon: MapPin, description: "Zonas comerciales" },
        ],
      },
    ],
  },
  {
    id: "reportes",
    label: "Reportes",
    icon: BarChart3,
    color: "text-pink-600",
    subGroups: [
      {
        label: "Análisis",
        items: [
          { title: "Reportes", href: "/dashboard/reports", icon: BarChart3, description: "Informes y estadísticas" },
        ],
      },
    ],
  },
];

interface ModuleSearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredModules: ModuleSection[];
  getFilteredModules: () => ModuleSection[];
}

export const useModuleSearchStore = create<ModuleSearchState>((set, get) => ({
  searchQuery: "",
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  filteredModules: allModules,
  getFilteredModules: () => {
    const { searchQuery } = get();
    if (!searchQuery.trim()) {
      return allModules;
    }

    const query = searchQuery.toLowerCase().trim();

    return allModules
      .map((section) => {
        const filteredSubGroups = section.subGroups
          .map((subGroup) => ({
            ...subGroup,
            items: subGroup.items.filter(
              (item) =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            ),
          }))
          .filter((subGroup) => subGroup.items.length > 0);

        return {
          ...section,
          subGroups: filteredSubGroups,
        };
      })
      .filter((section) => section.subGroups.length > 0);
  },
}));
