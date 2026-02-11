"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CheckCircle2, Database } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  empresa: z
    .string()
    .min(2, { message: "El nombre de la empresa es requerido" }),
  email: z.string().email({ message: "Ingrese un correo electrónico válido" }),
  telefono: z
    .string()
    .min(6, { message: "Ingrese un número de teléfono válido" }),
  tamanoEmpresa: z.string({
    required_error: "Seleccione el tamaño de su empresa",
  }),
  mensaje: z
    .string()
    .min(10, { message: "El mensaje debe tener al menos 10 caracteres" }),
});

export default function ContactoPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
      mensaje: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulamos el envío del formulario con un timeout
    try {
      // En un caso real, aquí iría la llamada a una API o Server Action
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Datos del formulario:", values);
      setIsSuccess(true);
      toast({
        title: "Solicitud enviada",
        description: "Nos pondremos en contacto con usted pronto.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Hubo un problema al enviar su solicitud. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col  ">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex justify-center">
            <img
              src="/logo_out.png"
              alt="Dashboard ERP"
              className="rounded-lg object-cover"
              width={100}
              height={200}
            />
          </div>
        </Link>
        <Link href="/login">
          <Button>Iniciar Sesión</Button>
        </Link>
      </header>

      <main className="flex-1 container max-w-4xl py-12 justify-center align-center mx-auto px-4 lg:px-6">
        {isSuccess ? (
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <CardTitle className="text-2xl font-bold">
                  ¡Solicitud Enviada!
                </CardTitle>
                <CardDescription className="text-lg">
                  Gracias por su interés en nuestro sistema ERP. Un
                  representante se pondrá en contacto con usted en las próximas
                  24-48 horas para programar su demostración personalizada.
                </CardDescription>
                <Link href="/">
                  <Button className="mt-4">Volver al Inicio</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Solicitar Demostración
              </CardTitle>
              <CardDescription>
                Complete el formulario a continuación para solicitar una
                demostración personalizada de nuestro sistema ERP.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan Pérez" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre de su empresa"
                              {...field}
                            />
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
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ejemplo@empresa.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telefono"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="+34 612 345 678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tamanoEmpresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamaño de la Empresa</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el tamaño de su empresa" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 empleados</SelectItem>
                            <SelectItem value="11-50">
                              11-50 empleados
                            </SelectItem>
                            <SelectItem value="51-200">
                              51-200 empleados
                            </SelectItem>
                            <SelectItem value="201-500">
                              201-500 empleados
                            </SelectItem>
                            <SelectItem value="501+">
                              Más de 500 empleados
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Esto nos ayuda a personalizar la demostración para sus
                          necesidades específicas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mensaje"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describa brevemente sus necesidades y qué aspectos del ERP le interesan más..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Solicitar Demostración"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Nos pondremos en contacto con usted en un plazo de 24-48 horas
                laborables.
              </p>
            </CardFooter>
          </Card>
        )}
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          © 2025 ERP System. Todos los derechos reservados.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Términos de Servicio
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Política de Privacidad
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="/contacto"
          >
            Contacto
          </Link>
        </nav>
      </footer>
    </div>
  );
}
