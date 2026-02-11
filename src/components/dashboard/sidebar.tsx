"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Banknote,
  Box,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  ClipboardCheck,
  CreditCard,
  Database,
  FileText,
  FileSpreadsheet,
  FolderTree,
  Globe,
  Hash,
  History,
  Landmark,
  Layers,
  LayoutDashboard,
  MapPin,
  MapPinned,
  Package,
  PackageCheck,
  PackageOpen,
  Receipt,
  ReceiptText,
  RotateCcw,
  ScrollText,
  ShoppingCart,
  ShoppingBag,
  Ship,
  SlidersHorizontal,
  Star,
  Store,
  Tags,
  Truck,
  Users,
  Wallet,
  Warehouse,
  Wrench,
  Cog,
  ClipboardPen,
  Gauge,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  pathname: string;
  roles?: string[];
  userName?: string;
  userEmail?: string;
}

// ── Admin modules ──────────────────────────────────────────────
const adminSections = [
  {
    label: "ADMINISTRACIÓN",
    items: [
      { title: "Compañías", href: "/dashboard/admin/companies", icon: Building2 },
      { title: "Usuarios", href: "/dashboard/admin/users", icon: Users },
      { title: "Preferencias", href: "/dashboard/admin/preferences", icon: SlidersHorizontal },
      { title: "Auditoría", href: "/dashboard/admin/audit-logs", icon: History },
    ],
  },
];

// ── Ventas sub-groups ─────────────────────────────────────────
const ventasSubGroups = [
  {
    label: "Transacciones",
    items: [
      { title: "Órdenes de Venta", href: "/dashboard/sales/sales-orders", icon: ShoppingCart },
      { title: "Cotizaciones", href: "/dashboard/sales/quotations", icon: FileSpreadsheet },
      { title: "Despachos", href: "/dashboard/sales/shipments", icon: PackageCheck },
      { title: "Devoluciones", href: "/dashboard/sales/returns", icon: RotateCcw },
    ],
  },
  {
    label: "Configuración",
    items: [
      { title: "Listas de Precios", href: "/dashboard/sales/price-lists", icon: Receipt },
    ],
  },
];

// ── Compras sub-groups ────────────────────────────────────────
const comprasSubGroups = [
  {
    label: "Transacciones",
    items: [
      { title: "Órdenes de Compra", href: "/dashboard/purchasing/purchase-orders", icon: ShoppingBag },
      { title: "Requisiciones", href: "/dashboard/purchasing/requisitions", icon: ClipboardCheck },
      { title: "Recepciones", href: "/dashboard/purchasing/receipts", icon: PackageOpen },
      { title: "Facturas Proveedor", href: "/dashboard/purchasing/vendor-invoices", icon: ReceiptText },
    ],
  },
  {
    label: "Gestión",
    items: [
      { title: "Evaluación Proveedores", href: "/dashboard/purchasing/vendor-evaluations", icon: Star },
    ],
  },
];

// ── Inventario sub-groups ──────────────────────────────────────
const inventarioSubGroups = [
  {
    label: "Catálogos",
    items: [
      { title: "Categorías", href: "/dashboard/inventory/product-categories", icon: FolderTree },
      { title: "Productos", href: "/dashboard/inventory/products", icon: Package },
      { title: "Razones de Movimiento", href: "/dashboard/inventory/movement-reasons", icon: Tags },
    ],
  },
  {
    label: "Almacenes",
    items: [
      { title: "Almacenes", href: "/dashboard/inventory/warehouses", icon: Warehouse },
      { title: "Ubicaciones", href: "/dashboard/inventory/warehouse-locations", icon: MapPinned },
    ],
  },
  {
    label: "Control",
    items: [
      { title: "Lotes", href: "/dashboard/inventory/lots", icon: Layers },
      { title: "Niveles de Stock", href: "/dashboard/inventory/stock-levels", icon: Box },
    ],
  },
  {
    label: "Movimientos",
    items: [
      { title: "Kardex", href: "/dashboard/inventory/kardex", icon: ScrollText },
      { title: "Conteos", href: "/dashboard/inventory/inventory-counts", icon: ClipboardList },
    ],
  },
];

// ── Mantenimiento sub-groups ──────────────────────────────────
const mantenimientoSubGroups = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", href: "/dashboard/maintenance", icon: Gauge },
    ],
  },
  {
    label: "Gestión",
    items: [
      { title: "Activos / Equipos", href: "/dashboard/maintenance/assets", icon: Cog },
      { title: "Órdenes de Trabajo", href: "/dashboard/maintenance/work-orders", icon: ClipboardPen },
      { title: "Planes Preventivos", href: "/dashboard/maintenance/plans", icon: ClipboardList },
    ],
  },
  {
    label: "Control",
    items: [
      { title: "Tiempos de Parada", href: "/dashboard/maintenance/downtime", icon: Clock },
      { title: "Fallas y Causas", href: "/dashboard/maintenance/failure-codes", icon: AlertTriangle },
    ],
  },
];

// ── Maestros sub-groups ────────────────────────────────────────
const maestrosSubGroups = [
  {
    label: "Entidades",
    items: [
      { title: "Terceros", href: "/dashboard/masters/third-party", icon: Users },
      { title: "Transportistas", href: "/dashboard/masters/carriers", icon: Truck },
      { title: "Sucursales", href: "/dashboard/masters/branches", icon: Store },
    ],
  },
  {
    label: "Documentos",
    items: [
      { title: "Tipos de documento", href: "/dashboard/masters/document-types", icon: FileText },
      { title: "Secuencias", href: "/dashboard/masters/document-sequences", icon: Hash },
    ],
  },
  {
    label: "Pagos",
    items: [
      { title: "Condiciones de pago", href: "/dashboard/masters/payment-terms", icon: Receipt },
      { title: "Métodos de pago", href: "/dashboard/masters/payment-methods", icon: CreditCard },
      { title: "Bancos", href: "/dashboard/masters/banks", icon: Landmark },
      { title: "Cuentas bancarias", href: "/dashboard/masters/bank-accounts", icon: Wallet },
    ],
  },
  {
    label: "Fiscal",
    items: [
      { title: "Responsab. tributarias", href: "/dashboard/masters/tax-responsibilities", icon: CircleDollarSign },
      { title: "Actividades económicas", href: "/dashboard/masters/economic-activities", icon: Banknote },
      { title: "Monedas", href: "/dashboard/masters/currencies", icon: Banknote },
    ],
  },
  {
    label: "Envío",
    items: [
      { title: "Métodos de envío", href: "/dashboard/masters/shipping-methods", icon: Ship },
      { title: "Incoterms", href: "/dashboard/masters/incoterms", icon: Globe },
    ],
  },
  {
    label: "Geografía",
    items: [
      { title: "Regiones y zonas", href: "/dashboard/masters/regions-zones", icon: MapPin },
      { title: "Países", href: "/dashboard/masters/countries", icon: Globe },
      { title: "Departamentos", href: "/dashboard/masters/state-deparment", icon: MapPin },
      { title: "Ciudades", href: "/dashboard/masters/city", icon: Building2 },
    ],
  },
];

// ── ERP sections ───────────────────────────────────────────────
const erpSections = [
  {
    label: "PRINCIPAL",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "VENTAS",
    accordion: "ventas",
  },
  {
    label: "COMPRAS",
    accordion: "compras",
  },
  {
    label: "INVENTARIO",
    accordion: "inventario",
  },
  {
    label: "MANTENIMIENTO",
    accordion: "mantenimiento",
  },
  {
    label: "MAESTROS",
    accordion: "maestros",
  },
  {
    label: "ANÁLISIS",
    items: [
      { title: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
    ],
  },
];

// ── RRHH section (for hrManager) ────────────────────────────────
const rrhhSection = {
  label: "RECURSOS HUMANOS",
  items: [
    { title: "Usuarios", href: "/dashboard/admin/users", icon: Users },
  ],
};

// ── Sistema section (for CEO) ────────────────────────────────────
const sistemaSection = {
  label: "SISTEMA",
  items: [
    { title: "Preferencias", href: "/dashboard/admin/preferences", icon: SlidersHorizontal },
    { title: "Auditoría", href: "/dashboard/admin/audit-logs", icon: History },
  ],
};

// ── Helpers ────────────────────────────────────────────────────

function NavItem({
  href,
  icon: Icon,
  title,
  active,
  collapsed,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <Link href={href} onClick={onClick}>
      <button
        className={cn(
          "relative flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150",
          collapsed && "justify-center px-0",
          active
            ? "bg-primary/10 text-primary font-medium"
            : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-primary" />
        )}
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{title}</span>}
      </button>
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{inner}</TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    );
  }

  return inner;
}

function SectionHeader({
  label,
  collapsed,
  first,
}: {
  label: string;
  collapsed: boolean;
  first?: boolean;
}) {
  if (collapsed) return null;
  return (
    <p
      className={cn(
        "text-[11px] font-medium uppercase tracking-wide text-sidebar-foreground/40 px-3 mb-1.5",
        first ? "mt-0" : "mt-6",
      )}
    >
      {label}
    </p>
  );
}

// ── Collapsed accordion popover (generic) ──────────────────────

function CollapsedAccordionButton({
  pathname,
  subGroups,
  icon: Icon,
  label,
}: {
  pathname: string;
  subGroups: typeof maestrosSubGroups;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isAnyActive = subGroups.some((g) =>
    g.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/")),
  );

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setPopoverOpen((v) => !v)}
            className={cn(
              "relative flex w-full items-center justify-center rounded-md py-2 text-sm transition-colors duration-150",
              isAnyActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            {isAnyActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-primary" />
            )}
            <Icon className="h-4 w-4 shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>

      {popoverOpen && (
        <>
          {/* backdrop to close */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setPopoverOpen(false)}
          />
          <div className="absolute left-full top-0 z-50 ml-2 w-56 max-h-[70vh] overflow-y-auto rounded-lg border border-sidebar-border bg-sidebar p-2 shadow-lg">
            {subGroups.map((group) => (
              <div key={group.label} className="mb-2 last:mb-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-sidebar-foreground/40 px-2 mb-1">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setPopoverOpen(false)}
                  >
                    <button
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-150",
                        pathname === item.href || pathname.startsWith(item.href + "/")
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5 shrink-0" />
                      {item.title}
                    </button>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Expanded accordion (generic) ───────────────────────────────

function ExpandedAccordion({
  pathname,
  onNavigate,
  subGroups,
  icon: Icon,
  label,
  value,
}: {
  pathname: string;
  onNavigate?: () => void;
  subGroups: typeof maestrosSubGroups;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  const isAnyActive = subGroups.some((g) =>
    g.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/")),
  );

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue={isAnyActive ? value : undefined}>
      <AccordionItem value={value} className="border-none">
        <AccordionTrigger className="py-2 px-3 text-sm font-medium text-sidebar-foreground/70 hover:no-underline hover:text-sidebar-foreground">
          <span className="flex items-center gap-2.5">
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-1">
          {subGroups.map((group) => (
            <div key={group.label} className="mb-1 last:mb-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-sidebar-foreground/40 pl-7 pr-3 mt-2 mb-1">
                {group.label}
              </p>
              <div className="ml-5 border-l border-sidebar-border/50 pl-2">
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href} onClick={onNavigate}>
                    <button
                      className={cn(
                        "relative flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors duration-150",
                        pathname === item.href || pathname.startsWith(item.href + "/")
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      )}
                    >
                      {(pathname === item.href || pathname.startsWith(item.href + "/")) && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-primary" />
                      )}
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.title}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// ── Main Sidebar ───────────────────────────────────────────────

export function DashboardSidebar({
  open,
  collapsed,
  onToggleCollapse,
  onClose,
  pathname,
  roles,
  userName,
  userEmail,
}: SidebarProps) {
  const isSysAdmin = roles?.includes("sysAdmin") ?? false;
  const isHrManager = roles?.includes("hrManager") ?? false;
  const isCeo = roles?.includes("ceo") ?? false;
  const canManageUsers = isHrManager || isCeo;

  // Build sections based on role
  const sections = isSysAdmin
    ? adminSections
    : isCeo
    ? [...erpSections, rrhhSection, sistemaSection]
    : isHrManager
    ? [...erpSections, rrhhSection]
    : erpSections;

  const handleMobileClose = () => {
    onClose();
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={handleMobileClose}
        />
      )}
      <div
        className={cn(
          "h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out",
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:transition-transform max-lg:duration-200 max-lg:ease-out",
          "lg:relative lg:flex lg:translate-x-0",
          open ? "max-lg:translate-x-0 max-lg:flex" : "max-lg:-translate-x-full max-lg:hidden",
          collapsed ? "w-[52px]" : "w-56",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img
              src="/logo_out.png"
              alt="Dashboard ERP"
              className={cn(
                "h-8 w-auto object-contain transition-opacity duration-200",
                collapsed && "hidden",
              )}
            />
            {collapsed && (
              <img
                src="/logo_out.png"
                alt="Dashboard ERP"
                className="h-6 w-6 object-contain object-left"
              />
            )}
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="min-h-0 flex-1 py-3">
          <nav className={cn("px-3", collapsed && "px-1.5")}>
            <div className="space-y-0.5">
              {sections.map((section, sIdx) => {
                // Accordion sections (ventas, compras, inventario, maestros)
                if ("accordion" in section && section.accordion) {
                  const accordionType = section.accordion;
                  const subGroups =
                    accordionType === "ventas"
                      ? ventasSubGroups
                      : accordionType === "compras"
                      ? comprasSubGroups
                      : accordionType === "inventario"
                      ? inventarioSubGroups
                      : accordionType === "mantenimiento"
                      ? mantenimientoSubGroups
                      : maestrosSubGroups;
                  const icon =
                    accordionType === "ventas"
                      ? ShoppingCart
                      : accordionType === "compras"
                      ? ShoppingBag
                      : accordionType === "inventario"
                      ? Package
                      : accordionType === "mantenimiento"
                      ? Wrench
                      : Database;
                  const label =
                    accordionType === "ventas"
                      ? "Ventas"
                      : accordionType === "compras"
                      ? "Compras"
                      : accordionType === "inventario"
                      ? "Inventario"
                      : accordionType === "mantenimiento"
                      ? "Mantenimiento"
                      : "Maestros";
                  const value = accordionType;

                  return (
                    <div key={section.label}>
                      <SectionHeader
                        label={section.label}
                        collapsed={collapsed}
                        first={sIdx === 0}
                      />
                      {collapsed ? (
                        <CollapsedAccordionButton
                          pathname={pathname}
                          subGroups={subGroups}
                          icon={icon}
                          label={label}
                        />
                      ) : (
                        <ExpandedAccordion
                          pathname={pathname}
                          onNavigate={handleMobileClose}
                          subGroups={subGroups}
                          icon={icon}
                          label={label}
                          value={value}
                        />
                      )}
                    </div>
                  );
                }

                // Regular section
                return (
                  <div key={section.label}>
                    <SectionHeader
                      label={section.label}
                      collapsed={collapsed}
                      first={sIdx === 0}
                    />
                    {"items" in section &&
                      section.items?.map((item) => (
                        <NavItem
                          key={item.href}
                          href={item.href}
                          icon={item.icon}
                          title={item.title}
                          active={pathname === item.href}
                          collapsed={collapsed}
                          onClick={handleMobileClose}
                        />
                      ))}
                  </div>
                );
              })}
            </div>
          </nav>
        </ScrollArea>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex justify-center border-t border-sidebar-border py-2">
          <button
            onClick={onToggleCollapse}
            className="flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-150"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

      </div>
    </TooltipProvider>
  );
}
