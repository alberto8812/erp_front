"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  DollarSign,
  Package,
  Search,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  useModuleSearchStore,
  allModules,
  type ModuleSection,
  type ModuleItem,
} from "@/stores/module-search.store";

// ─────────────────────────────────────────────────────────────
// Metric Card Component
// ─────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trend === "up"
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-rose-500/10 text-rose-600"
            )}
          >
            {trend === "up" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {change}
          </div>
          <span className="text-xs text-muted-foreground">vs. mes anterior</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Module Item Component
// ─────────────────────────────────────────────────────────────

function ModuleItemCard({ item, sectionColor }: { item: ModuleItem; sectionColor: string }) {
  return (
    <Link href={item.href}>
      <div className="group flex items-center gap-3 rounded-lg border border-transparent bg-muted/30 p-3 transition-all hover:border-border hover:bg-accent/50 hover:shadow-sm">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm transition-transform group-hover:scale-105",
            sectionColor
          )}
        >
          <item.icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {item.title}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// Module Section Component
// ─────────────────────────────────────────────────────────────

function ModuleSectionCard({ section }: { section: ModuleSection }) {
  const totalItems = section.subGroups.reduce((acc, sg) => acc + sg.items.length, 0);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className={cn("rounded-lg bg-muted p-2", section.color)}>
          <section.icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{section.label}</h3>
          <p className="text-xs text-muted-foreground">{totalItems} módulos</p>
        </div>
      </div>

      {/* SubGroups */}
      <div className="space-y-4 pl-2">
        {section.subGroups.map((subGroup) => (
          <div key={subGroup.label} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                {subGroup.label}
              </span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <div className="grid gap-2">
              {subGroup.items.map((item) => (
                <ModuleItemCard key={item.href} item={item} sectionColor={section.color} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Search Results Component
// ─────────────────────────────────────────────────────────────

function SearchResults({ filteredModules }: { filteredModules: ModuleSection[] }) {
  const totalResults = filteredModules.reduce(
    (acc, section) =>
      acc + section.subGroups.reduce((sgAcc, sg) => sgAcc + sg.items.length, 0),
    0
  );

  if (filteredModules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 font-medium text-foreground">Sin resultados</p>
        <p className="mt-1 text-sm text-muted-foreground">
          No se encontraron módulos con ese nombre
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {totalResults} resultado{totalResults !== 1 ? "s" : ""} encontrado
        {totalResults !== 1 ? "s" : ""}
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filteredModules.flatMap((section) =>
          section.subGroups.flatMap((subGroup) =>
            subGroup.items.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-md">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted",
                      section.color
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {section.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Activity Feed Component
// ─────────────────────────────────────────────────────────────

const activities = [
  {
    action: "Venta completada",
    user: "María López",
    time: "5 min",
    type: "success",
  },
  {
    action: "Producto actualizado",
    user: "Juan Pérez",
    time: "15 min",
    type: "info",
  },
  {
    action: "Nuevo cliente registrado",
    user: "Admin",
    time: "1 h",
    type: "success",
  },
  {
    action: "Inventario ajustado",
    user: "Carlos Ruiz",
    time: "3 h",
    type: "warning",
  },
  {
    action: "Reporte generado",
    user: "Admin",
    time: "5 h",
    type: "info",
  },
];

function ActivityFeed() {
  return (
    <div className="space-y-1">
      {activities.map((activity, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
        >
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              activity.type === "success" && "bg-emerald-500/10 text-emerald-600",
              activity.type === "warning" && "bg-amber-500/10 text-amber-600",
              activity.type === "info" && "bg-blue-500/10 text-blue-600"
            )}
          >
            {i + 1}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-none">{activity.action}</p>
            <p className="mt-1 text-xs text-muted-foreground">{activity.user}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground/60">{activity.time}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Dashboard Component
// ─────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { searchQuery, setSearchQuery, getFilteredModules } = useModuleSearchStore();
  const filteredModules = useMemo(() => getFilteredModules(), [searchQuery, getFilteredModules]);
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Panel de control del sistema ERP
          </p>
        </div>
        <Button size="sm" variant="outline" className="w-fit">
          Descargar Reporte
        </Button>
      </div>

      {/* KPI Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Ventas Totales"
          value="$45,231.89"
          change="+20.1%"
          trend="up"
          icon={DollarSign}
        />
        <MetricCard
          label="Productos"
          value="573"
          change="-4.5%"
          trend="down"
          icon={Package}
        />
        <MetricCard
          label="Clientes"
          value="2,350"
          change="+10.1%"
          trend="up"
          icon={Users}
        />
        <MetricCard
          label="Órdenes Activas"
          value="12,234"
          change="+19%"
          trend="up"
          icon={ShoppingCart}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Modules Section */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Módulos del Sistema</CardTitle>
                <CardDescription>
                  Acceso rápido a todas las áreas del ERP
                </CardDescription>
              </div>
              <Badge variant="secondary" className="w-fit">
                {allModules.reduce(
                  (acc, s) => acc + s.subGroups.reduce((sg, g) => sg + g.items.length, 0),
                  0
                )}{" "}
                módulos
              </Badge>
            </div>

            {/* Search Input */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar módulo por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {isSearching && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-[500px] pr-4">
              {isSearching ? (
                <SearchResults filteredModules={filteredModules} />
              ) : (
                <div className="grid gap-8 md:grid-cols-2">
                  {allModules.map((section) => (
                    <ModuleSectionCard key={section.id} section={section} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ActivityFeed />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
