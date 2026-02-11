"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { adminUpdateUser } from "@/action/user/admin-update-user.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, UserCog, XCircle } from "lucide-react";

const roleGroups = [
  {
    label: "Direccion",
    roles: [
      { value: "ceo", label: "CEO" },
      { value: "cfo", label: "CFO" },
      { value: "coo", label: "COO" },
      { value: "cto", label: "CTO" },
      { value: "areaManager", label: "Gerente de Area" },
    ],
  },
  {
    label: "Finanzas",
    roles: [
      { value: "accountant", label: "Contador" },
      { value: "treasurer", label: "Tesorero" },
      { value: "financialAnalyst", label: "Analista Financiero" },
      { value: "taxSpecialist", label: "Especialista Tributario" },
      { value: "costAnalyst", label: "Analista de Costos" },
      { value: "billing", label: "Facturacion" },
    ],
  },
  {
    label: "Compras",
    roles: [
      { value: "purchasingManager", label: "Jefe de Compras" },
      { value: "purchasingApprover", label: "Aprobador de Compras" },
      { value: "buyer", label: "Comprador" },
    ],
  },
  {
    label: "Produccion",
    roles: [
      { value: "plantSupervisor", label: "Supervisor de Planta" },
      { value: "productionOperator", label: "Operario de Produccion" },
      { value: "productionPlanner", label: "Planificador de Produccion" },
      { value: "qualityInspector", label: "Inspector de Calidad" },
      { value: "qualityManager", label: "Jefe de Calidad" },
    ],
  },
  {
    label: "Mantenimiento",
    roles: [
      { value: "maintenanceManager", label: "Jefe de Mantenimiento" },
      { value: "maintenanceTechnician", label: "Tecnico de Mantenimiento" },
      { value: "maintenancePlanner", label: "Planificador de Mantenimiento" },
    ],
  },
  {
    label: "Almacen",
    roles: [
      { value: "warehouseManager", label: "Jefe de Almacen" },
      { value: "warehouseOperator", label: "Auxiliar de Almacen" },
      { value: "inventoryAnalyst", label: "Analista de Inventarios" },
    ],
  },
  {
    label: "Logistica / Despachos",
    roles: [
      { value: "logisticsCoordinator", label: "Coordinador Logistico" },
      { value: "dispatchManager", label: "Jefe de Despachos" },
      { value: "dispatchOperator", label: "Auxiliar de Despachos" },
      { value: "transportCoordinator", label: "Coordinador de Transporte" },
      { value: "driver", label: "Conductor" },
    ],
  },
  {
    label: "Ventas",
    roles: [
      { value: "salesManager", label: "Jefe de Ventas" },
      { value: "salesExecutive", label: "Ejecutivo de Ventas" },
      { value: "salesRepresentative", label: "Representante Comercial" },
      { value: "presalesConsultant", label: "Consultor Preventa" },
      { value: "ecommerceManager", label: "Admin E-commerce" },
    ],
  },
  {
    label: "Servicio al Cliente",
    roles: [
      { value: "customerService", label: "Atencion al Cliente" },
      { value: "customerSuccessManager", label: "Customer Success" },
    ],
  },
  {
    label: "RRHH",
    roles: [
      { value: "hrManager", label: "Jefe de RRHH" },
      { value: "recruiter", label: "Reclutador" },
      { value: "payrollSpecialist", label: "Especialista de Nomina" },
    ],
  },
  {
    label: "Auditoria",
    roles: [
      { value: "internalAuditor", label: "Auditor Interno" },
      { value: "externalConsultant", label: "Consultor Externo" },
    ],
  },
  {
    label: "General",
    roles: [
      { value: "employee", label: "Empleado" },
      { value: "supplier", label: "Proveedor" },
      { value: "client", label: "Cliente" },
    ],
  },
];

const statusOptions = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "blocked", label: "Bloqueado" },
  { value: "suspended", label: "Suspendido" },
];

const editUserSchema = z.object({
  first_name: z.string().min(2, "El nombre es requerido"),
  last_name: z.string().min(2, "El apellido es requerido"),
  email: z.string().email("Email invalido"),
  phone: z.string().optional(),
  address: z.string().optional(),
  roles: z.string().min(1, "Seleccione un rol"),
  status: z.string().min(1, "Seleccione un estado"),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface User {
  user_Id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string;
  status: string;
  phone?: string;
  address?: string;
}

interface Props {
  user: User;
}

export function EditUserForm({ user }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      roles: user.roles || "",
      status: user.status || "active",
    },
  });

  async function onSubmit(data: EditUserFormValues) {
    setLoading(true);
    setError(null);

    const result = await adminUpdateUser(user.user_Id, data);
    if (result.success) {
      router.push("/dashboard/admin/users");
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/admin/users"
          className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Usuarios
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar Usuario
        </h1>
        <p className="text-sm text-muted-foreground">
          Modificar informacion de {user.username}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <div className="max-w-2xl">
        <div className="rounded-lg border">
          <div className="flex items-center gap-2 border-b bg-muted/40 px-5 py-3">
            <UserCog className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Informacion del Usuario
            </span>
          </div>
          <div className="p-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Username
                    </label>
                    <p className="mt-1 text-sm">{user.username}</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Perez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="usuario@empresa.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefono</FormLabel>
                        <FormControl>
                          <Input placeholder="+57 300 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Direccion</FormLabel>
                        <FormControl>
                          <Input placeholder="Calle 123 #45-67" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roleGroups.map((group) => (
                              <SelectGroup key={group.label}>
                                <SelectLabel>{group.label}</SelectLabel>
                                {group.roles.map((role) => (
                                  <SelectItem
                                    key={role.value}
                                    value={role.value}
                                  >
                                    {role.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-2 border-t pt-5">
                  <Button type="submit" size="sm" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    )}
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboard/admin/users")}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
