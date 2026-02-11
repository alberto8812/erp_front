"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AlertTriangle,
  ArrowUp,
  DollarSign,
  Download,
  Filter,
  Package,
  PackageX,
  Plus,
  Search,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const inventoryData = [
  { id: 1, name: "Laptop HP Pavilion", category: "Electronicos", stock: 45, price: 899.99, status: "En stock" },
  { id: 2, name: 'Monitor Dell 27"', category: "Electronicos", stock: 30, price: 349.99, status: "En stock" },
  { id: 3, name: "Teclado Mecanico", category: "Accesorios", stock: 100, price: 79.99, status: "En stock" },
  { id: 4, name: "Mouse Inalambrico", category: "Accesorios", stock: 75, price: 29.99, status: "En stock" },
  { id: 5, name: "Impresora HP LaserJet", category: "Electronicos", stock: 15, price: 299.99, status: "Bajo stock" },
  { id: 6, name: "Auriculares Bluetooth", category: "Audio", stock: 60, price: 129.99, status: "En stock" },
  { id: 7, name: "Tablet Samsung", category: "Electronicos", stock: 5, price: 449.99, status: "Critico" },
  { id: 8, name: "Camara Web HD", category: "Accesorios", stock: 0, price: 89.99, status: "Sin stock" },
];

const stockByCategory = [
  { name: "Electronicos", stock: 95 },
  { name: "Accesorios", stock: 175 },
  { name: "Audio", stock: 60 },
  { name: "Cables", stock: 120 },
  { name: "Almacenamiento", stock: 80 },
];

const stockStatus = [
  { name: "En stock", value: 310 },
  { name: "Bajo stock", value: 15 },
  { name: "Critico", value: 5 },
  { name: "Sin stock", value: 1 },
];

// Corporate palette derived from chart tokens
const PIE_COLORS = [
  "oklch(0.55 0.15 155)", // success green
  "oklch(0.70 0.15 75)",  // warning amber
  "oklch(0.55 0.12 25)",  // muted red
  "oklch(0.50 0.01 255)", // neutral slate
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "En stock"
      ? "success"
      : status === "Bajo stock"
        ? "warning"
        : status === "Critico"
          ? "destructive"
          : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventario</h1>
          <p className="text-sm text-muted-foreground">
            Gestion de productos, stock y categorias
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="estadisticas" className="hidden sm:block">
            <TabsList>
              <TabsTrigger value="estadisticas">Estadisticas</TabsTrigger>
              <TabsTrigger value="tabla">Productos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Wrap content in Tabs but control from header */}
      <Tabs defaultValue="estadisticas">
        {/* Mobile tabs */}
        <TabsList className="mb-4 sm:hidden">
          <TabsTrigger value="estadisticas">Estadisticas</TabsTrigger>
          <TabsTrigger value="tabla">Productos</TabsTrigger>
        </TabsList>

        {/* Statistics tab */}
        <TabsContent value="estadisticas" className="mt-0 space-y-6">
          {/* Metric cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total de Productos</p>
                    <p className="text-2xl font-semibold tracking-tight tabular-nums">573</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  8 categorias diferentes
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-0.5 bg-success" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Valor del Inventario</p>
                    <p className="text-2xl font-semibold tracking-tight tabular-nums">
                      $125,430.89
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs">
                  <span className="flex items-center gap-0.5 text-success">
                    <ArrowUp className="h-3 w-3" />
                    +2.5%
                  </span>
                  <span className="text-muted-foreground">vs. mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-0.5 bg-destructive" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Productos sin Stock</p>
                    <p className="text-2xl font-semibold tracking-tight tabular-nums">12</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    <PackageX className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs">
                  <AlertTriangle className="h-3 w-3 text-warning" />
                  <span className="text-muted-foreground">5 en estado critico</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Stock por Categoria</CardTitle>
                <CardDescription>
                  Distribucion de productos por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stockByCategory}
                      margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="oklch(0.91 0.005 255)"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "oklch(0.50 0.01 255)" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "oklch(0.50 0.01 255)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid oklch(0.91 0.005 255)",
                          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)",
                          fontSize: "13px",
                        }}
                      />
                      <Bar
                        dataKey="stock"
                        fill="oklch(0.45 0.15 255)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={48}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Estado del Inventario</CardTitle>
                <CardDescription>
                  Distribucion por estado de stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {stockStatus.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid oklch(0.91 0.005 255)",
                          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)",
                          fontSize: "13px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom legend */}
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                  {stockStatus.map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[i] }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {entry.name}
                      </span>
                      <span className="ml-auto text-xs font-medium tabular-nums">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Table tab */}
        <TabsContent value="tabla" className="mt-0 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-9 w-[180px] text-sm">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorias</SelectItem>
                  <SelectItem value="Electronicos">Electronicos</SelectItem>
                  <SelectItem value="Accesorios">Accesorios</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {item.id}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.category}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.stock}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {currency.format(item.price)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="h-32 text-center">
                      <p className="text-sm text-muted-foreground">
                        No se encontraron productos
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
