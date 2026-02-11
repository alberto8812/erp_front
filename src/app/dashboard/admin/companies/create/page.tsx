"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createCompany } from "@/action/company/create-company.action";
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
import { useState } from "react";
import { ArrowLeft, Building2, Loader2, XCircle } from "lucide-react";

const companySchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  legal_name: z.string().min(2, "La razón social es requerida"),
  tax_id: z.string().min(2, "El NIT/Tax ID es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(5, "El teléfono es requerido"),
  country: z.string().min(2, "El país es requerido"),
  city: z.string().min(2, "La ciudad es requerida"),
  currency: z.string().min(2, "La moneda es requerida"),
  timezone: z.string().min(2, "La zona horaria es requerida"),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CreateCompanyPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      legal_name: "",
      tax_id: "",
      email: "",
      phone: "",
      country: "CO",
      city: "",
      currency: "COP",
      timezone: "America/Bogota",
    },
  });

  async function onSubmit(data: CompanyFormValues) {
    setLoading(true);
    setError(null);
    const result = await createCompany(data);
    if (result.success) {
      router.push("/dashboard/admin/companies");
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard/admin/companies"
            className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Companias
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Crear Compania
          </h1>
          <p className="text-sm text-muted-foreground">
            Registrar una nueva compania en el sistema
          </p>
        </div>
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
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Informacion de la Compania
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre de la compañía"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="legal_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razon Social</FormLabel>
                        <FormControl>
                          <Input placeholder="Razón social" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tax_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIT / Tax ID</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789-0" {...field} />
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
                            placeholder="empresa@ejemplo.com"
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
                          <Input placeholder="+57 300 1234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pais</FormLabel>
                        <FormControl>
                          <Input placeholder="CO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Input placeholder="Bogotá" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moneda</FormLabel>
                        <FormControl>
                          <Input placeholder="COP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Zona Horaria</FormLabel>
                        <FormControl>
                          <Input placeholder="America/Bogota" {...field} />
                        </FormControl>
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
                    {loading ? "Creando..." : "Crear Compania"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      router.push("/dashboard/admin/companies")
                    }
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
