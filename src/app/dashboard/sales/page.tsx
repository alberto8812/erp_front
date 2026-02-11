"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  Plus,
  RefreshCcw,
  ShoppingCart,
  Users,
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

// Datos de ejemplo para ventas
const salesData = [
  {
    id: 1,
    customer: "Juan Pérez",
    date: "2023-04-15",
    items: 3,
    total: 1299.97,
    status: "Completada",
  },
  {
    id: 2,
    customer: "María López",
    date: "2023-04-16",
    items: 1,
    total: 349.99,
    status: "Completada",
  },
  {
    id: 3,
    customer: "Carlos Ruiz",
    date: "2023-04-16",
    items: 2,
    total: 109.98,
    status: "Procesando",
  },
  {
    id: 4,
    customer: "Ana Martínez",
    date: "2023-04-17",
    items: 5,
    total: 599.95,
    status: "Completada",
  },
  {
    id: 5,
    customer: "Roberto Sánchez",
    date: "2023-04-18",
    items: 1,
    total: 299.99,
    status: "Cancelada",
  },
  {
    id: 6,
    customer: "Laura Gómez",
    date: "2023-04-18",
    items: 4,
    total: 449.96,
    status: "Procesando",
  },
  {
    id: 7,
    customer: "Pedro Díaz",
    date: "2023-04-19",
    items: 2,
    total: 579.98,
    status: "Completada",
  },
  {
    id: 8,
    customer: "Sofía Rodríguez",
    date: "2023-04-20",
    items: 3,
    total: 219.97,
    status: "Enviada",
  },
];

// Datos para el gráfico de líneas
const monthlySales = [
  { name: "Ene", ventas: 4000 },
  { name: "Feb", ventas: 3000 },
  { name: "Mar", ventas: 5000 },
  { name: "Abr", ventas: 8000 },
  { name: "May", ventas: 6000 },
  { name: "Jun", ventas: 7000 },
  { name: "Jul", ventas: 9000 },
  { name: "Ago", ventas: 8500 },
  { name: "Sep", ventas: 11000 },
  { name: "Oct", ventas: 12000 },
  { name: "Nov", ventas: 15000 },
  { name: "Dic", ventas: 18000 },
];

// Datos para el gráfico de área
const salesByCategory = [
  { name: "Ene", Electrónicos: 4000, Accesorios: 2400, Audio: 1800 },
  { name: "Feb", Electrónicos: 3000, Accesorios: 1800, Audio: 1500 },
  { name: "Mar", Electrónicos: 5000, Accesorios: 2800, Audio: 2000 },
  { name: "Abr", Electrónicos: 8000, Accesorios: 3800, Audio: 2500 },
  { name: "May", Electrónicos: 6000, Accesorios: 3000, Audio: 2200 },
  { name: "Jun", Electrónicos: 7000, Accesorios: 3300, Audio: 2400 },
];

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = salesData.filter(
    (item) =>
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <Tabs defaultValue="estadisticas" className="w-full">
        <div className="flex justify-evenly items-center mb-4">
          <div className="w-full">
            <h2 className="text-3xl font-bold tracking-tight">Ventas</h2>
            <p className="text-muted-foreground">
              Gestión de órdenes, clientes y facturación
            </p>
          </div>
          <div className="flex items-center justify-center mb-4 w-full">
            <TabsList className="grid min-w-20 max-w-80 grid-cols-2 mb-6 justify-center">
              <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
              <TabsTrigger value="tabla">Tabla de ventas</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex items-center gap-2 w-full justify-end">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Venta
            </Button>
          </div>
        </div>

        <TabsContent value="estadisticas">
          <div className="grid gap-6 md:grid-cols-4 mb-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas Totales
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    +20.1%
                  </span>{" "}
                  desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    +12.5%
                  </span>{" "}
                  desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    +10.1%
                  </span>{" "}
                  desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasa de Conversión
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.3%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 flex items-center">
                    <ArrowDown className="mr-1 h-4 w-4" />
                    -3%
                  </span>{" "}
                  desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ventas Mensuales</CardTitle>
                <CardDescription>
                  Tendencia de ventas durante el último año
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlySales}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="ventas"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
                <CardDescription>
                  Distribución de ventas por categoría de producto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesByCategory}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="Electrónicos"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                      <Area
                        type="monotone"
                        dataKey="Accesorios"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                      />
                      <Area
                        type="monotone"
                        dataKey="Audio"
                        stackId="1"
                        stroke="#ffc658"
                        fill="#ffc658"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="tabla">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes Recientes</CardTitle>
              <CardDescription>
                Lista de las últimas órdenes procesadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    placeholder="Buscar órdenes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" size="sm" variant="ghost">
                    <RefreshCcw className="h-4 w-4" />
                    <span className="sr-only">Buscar</span>
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                      <SelectItem value="processing">Procesando</SelectItem>
                      <SelectItem value="shipped">Enviada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                </div>
              </div>
              <div className="mt-6 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Artículos</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>#{item.id}</TableCell>
                        <TableCell className="font-medium">
                          {item.customer}
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.items}</TableCell>
                        <TableCell>${item.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === "Completada"
                                ? "success"
                                : item.status === "Procesando"
                                ? "default"
                                : item.status === "Enviada"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
