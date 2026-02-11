"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { adminCreateUser } from "@/action/user/admin-create-user.action";
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
import { ArrowLeft, Loader2, UserPlus, XCircle } from "lucide-react";

const roleGroups = [
  {
    label: "Dirección",
    roles: [
      { value: "ceo", label: "CEO" },
      { value: "cfo", label: "CFO" },
      { value: "coo", label: "COO" },
      { value: "cto", label: "CTO" },
      { value: "areaManager", label: "Gerente de Área" },
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
      { value: "billing", label: "Facturación" },
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
    label: "Producción",
    roles: [
      { value: "plantSupervisor", label: "Supervisor de Planta" },
      { value: "productionOperator", label: "Operario de Producción" },
      { value: "productionPlanner", label: "Planificador de Producción" },
      { value: "qualityInspector", label: "Inspector de Calidad" },
      { value: "qualityManager", label: "Jefe de Calidad" },
    ],
  },
  {
    label: "Mantenimiento",
    roles: [
      { value: "maintenanceManager", label: "Jefe de Mantenimiento" },
      { value: "maintenanceTechnician", label: "Técnico de Mantenimiento" },
      { value: "maintenancePlanner", label: "Planificador de Mantenimiento" },
    ],
  },
  {
    label: "Almacén",
    roles: [
      { value: "warehouseManager", label: "Jefe de Almacén" },
      { value: "warehouseOperator", label: "Auxiliar de Almacén" },
      { value: "inventoryAnalyst", label: "Analista de Inventarios" },
    ],
  },
  {
    label: "Logística / Despachos",
    roles: [
      { value: "logisticsCoordinator", label: "Coordinador Logístico" },
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
      { value: "customerService", label: "Atención al Cliente" },
      { value: "customerSuccessManager", label: "Customer Success" },
    ],
  },
  {
    label: "RRHH",
    roles: [
      { value: "hrManager", label: "Jefe de RRHH" },
      { value: "recruiter", label: "Reclutador" },
      { value: "payrollSpecialist", label: "Especialista de Nómina" },
    ],
  },
  {
    label: "Auditoría",
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

// Schema for sysAdmin (requires company selection)
const sysAdminUserSchema = z.object({
  username: z.string().min(3, "El username debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  first_name: z.string().min(2, "El nombre es requerido"),
  last_name: z.string().min(2, "El apellido es requerido"),
  roles: z.string().min(1, "Seleccione un rol"),
  company_Id: z.string().uuid("Seleccione una compañía"),
});

// Schema for hrManager (company injected from JWT)
const hrManagerUserSchema = z.object({
  username: z.string().min(3, "El username debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  first_name: z.string().min(2, "El nombre es requerido"),
  last_name: z.string().min(2, "El apellido es requerido"),
  roles: z.string().min(1, "Seleccione un rol"),
});

type SysAdminFormValues = z.infer<typeof sysAdminUserSchema>;
type HrManagerFormValues = z.infer<typeof hrManagerUserSchema>;
type UserFormValues = SysAdminFormValues | HrManagerFormValues;

interface Company {
  company_Id: string;
  name: string;
}

interface Props {
  companies: Company[];
  isSysAdmin: boolean;
}

export function CreateUserForm({ companies, isSysAdmin }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const schema = isSysAdmin ? sysAdminUserSchema : hrManagerUserSchema;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      roles: "",
      ...(isSysAdmin && { company_Id: "" }),
    },
  });

  async function onSubmit(data: UserFormValues) {
    setLoading(true);
    setError(null);

    // For hrManager, company_Id is not in the form (injected by backend from JWT)
    const payload = isSysAdmin
      ? (data as SysAdminFormValues)
      : { ...data, company_Id: undefined };

    const result = await adminCreateUser(payload as SysAdminFormValues);
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
          Crear Usuario
        </h1>
        <p className="text-sm text-muted-foreground">
          Registrar un nuevo usuario en el sistema
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
            <UserPlus className="h-4 w-4 text-muted-foreground" />
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
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="usuario123" {...field} />
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contrasena</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Contraseña temporal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          <Input placeholder="Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isSysAdmin && (
                    <FormField
                      control={form.control}
                      name="company_Id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compania</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value as string}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar compañía" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companies.map((company) => (
                                <SelectItem
                                  key={company.company_Id}
                                  value={company.company_Id}
                                >
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
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
                </div>

                <div className="flex items-center gap-2 border-t pt-5">
                  <Button type="submit" size="sm" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    )}
                    {loading ? "Creando..." : "Crear Usuario"}
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
