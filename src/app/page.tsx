import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Box,
  Lock,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

function SignInForm({ children }: { children: React.ReactNode }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("keycloak", { redirectTo: "/" });
      }}
    >
      {children}
    </form>
  );
}

const features = [
  {
    icon: BarChart3,
    title: "Analisis Financiero",
    description:
      "Informes detallados sobre el rendimiento financiero con dashboards personalizables.",
  },
  {
    icon: Users,
    title: "Gestion de RRHH",
    description:
      "Administre informacion de empleados, nominas y procesos de contratacion.",
  },
  {
    icon: Box,
    title: "Inventario",
    description:
      "Control de inventario en tiempo real con optimizacion de niveles de stock.",
  },
  {
    icon: Settings,
    title: "Operaciones",
    description:
      "Automatizacion de procesos operativos para mayor eficiencia productiva.",
  },
  {
    icon: Lock,
    title: "Seguridad",
    description:
      "Proteccion de datos empresariales con autenticacion avanzada y permisos granulares.",
  },
  {
    icon: ShieldCheck,
    title: "CRM",
    description:
      "Gestion de relaciones con clientes para mejorar retencion y satisfaccion.",
  },
];

export default async function Home() {
  const session = await auth();

  // Si hay error de refresh token, redirigir a logout para limpiar cookies
  if (session?.error === "RefreshTokenError") {
    redirect("/auth/logout");
  }

  if (session) {
    const roles = session.roles ?? [];
    if (roles.includes("sysAdmin")) {
      redirect("/dashboard/admin/companies");
    }
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <img
              src="/logo_out.png"
              alt="OnERP"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <SignInForm>
            <Button variant="ghost" size="sm" type="submit">
              Iniciar Sesion
            </Button>
          </SignInForm>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-muted/50">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 lg:py-36">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="max-w-lg">
                <div className="mb-4 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Planificacion de Recursos Empresariales
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Sistema ERP completo para su empresa
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Gestione todos los aspectos de su negocio con una plataforma
                  integral. Inventario, ventas, clientes y reportes en un solo
                  lugar.
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <SignInForm>
                    <Button type="submit" size="lg">
                      Iniciar Sesion
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </SignInForm>
                  <Link href="/contact">
                    <Button variant="outline" size="lg">
                      Solicitar Demo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero visual — abstract data representation instead of stock image */}
              <div className="relative hidden lg:block">
                <div className="relative mx-auto w-full max-w-md">
                  {/* Background shape */}
                  <div className="absolute -inset-4 rounded-2xl bg-primary/[0.04] ring-1 ring-primary/[0.06]" />

                  {/* Mock dashboard card */}
                  <div className="relative rounded-xl border bg-card p-6 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                    {/* Top bar */}
                    <div className="flex items-center gap-2 mb-5">
                      <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                      <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                      <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                      <div className="ml-3 h-3 w-32 rounded bg-muted" />
                    </div>

                    {/* Mini metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { label: "Ventas", value: "$45.2K", color: "bg-primary" },
                        { label: "Clientes", value: "2,350", color: "bg-success" },
                        { label: "Ordenes", value: "12.2K", color: "bg-chart-2" },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="relative overflow-hidden rounded-lg border bg-background p-3"
                        >
                          <div className={`absolute inset-y-0 left-0 w-0.5 ${m.color}`} />
                          <p className="text-[10px] text-muted-foreground">{m.label}</p>
                          <p className="mt-1 text-sm font-semibold tabular-nums">{m.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Mini chart bars */}
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="h-2.5 w-24 rounded bg-muted" />
                        <div className="h-2.5 w-12 rounded bg-muted" />
                      </div>
                      <div className="flex items-end gap-1.5 h-20">
                        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 65].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t bg-primary/20"
                            style={{ height: `${h}%` }}
                          >
                            <div
                              className="w-full rounded-t bg-primary transition-all"
                              style={{ height: `${h > 60 ? 100 : 70}%` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mini table rows */}
                    <div className="space-y-2">
                      {[1, 2, 3].map((row) => (
                        <div key={row} className="flex items-center gap-3">
                          <div className="h-2.5 w-2.5 rounded-full bg-muted" />
                          <div className="h-2.5 flex-1 rounded bg-muted" />
                          <div className="h-2.5 w-16 rounded bg-muted" />
                          <div className="h-5 w-14 rounded-full bg-success/15" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-card">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Todo lo que necesita en un solo sistema
              </h2>
              <p className="mt-3 text-muted-foreground">
                Herramientas integradas para optimizar cada area de su operacion.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-lg border bg-background p-5 transition-colors hover:border-primary/20 hover:bg-muted/40"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 transition-colors group-hover:bg-primary/12">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/40">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
            <div className="mx-auto max-w-lg text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Comience a gestionar su empresa hoy
              </h2>
              <p className="mt-3 text-muted-foreground">
                Acceda a su cuenta o solicite una demostracion para ver como
                OnERP puede transformar sus operaciones.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <SignInForm>
                  <Button type="submit" size="lg">
                    Iniciar Sesion
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </SignInForm>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contactar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; 2025 OnERP. Todos los derechos reservados.
          </p>
          <nav className="flex gap-6">
            <Link
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              href="#"
            >
              Terminos de Servicio
            </Link>
            <Link
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              href="#"
            >
              Politica de Privacidad
            </Link>
            <Link
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              href="#"
            >
              Contacto
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
