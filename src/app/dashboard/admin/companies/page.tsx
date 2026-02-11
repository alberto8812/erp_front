import Link from "next/link";
import { getAllCompanies } from "@/action/company/get-all-companies.action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Inbox, Plus, XCircle } from "lucide-react";

export default async function CompaniesPage() {
  let companies: Awaited<ReturnType<typeof getAllCompanies>> = [];
  let error: string | null = null;

  try {
    companies = await getAllCompanies();
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al cargar companias";
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Companias</h1>
          <p className="text-sm text-muted-foreground">
            Administracion de companias del sistema
          </p>
        </div>
        <Link href="/dashboard/admin/companies/create">
          <Button size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Crear Compania
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-md bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Nombre</TableHead>
                <TableHead>NIT / Tax ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado Tenant</TableHead>
                <TableHead>Fecha Creacion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-48">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">Sin companias</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        No hay companias registradas
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.company_Id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {company.tax_id}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {company.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          company.tenant_status === "provisioned"
                            ? "success"
                            : company.tenant_status === "failed"
                              ? "destructive"
                              : "warning"
                        }
                      >
                        {company.tenant_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {new Date(company.created_at).toLocaleDateString("es-CO")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
