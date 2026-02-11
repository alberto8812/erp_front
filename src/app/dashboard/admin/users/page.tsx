import Link from "next/link";
import { adminGetAllUsers } from "@/action/user/admin-get-all-users.action";
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
import { Plus, Users, XCircle } from "lucide-react";
import { UserActions } from "./components/user-actions";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Activo", variant: "default" },
  inactive: { label: "Inactivo", variant: "secondary" },
  blocked: { label: "Bloqueado", variant: "destructive" },
  suspended: { label: "Suspendido", variant: "outline" },
};

export default async function UsersPage() {
  let users: Awaited<ReturnType<typeof adminGetAllUsers>> = [];
  let error: string | null = null;

  try {
    users = await adminGetAllUsers();
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al cargar usuarios";
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
          <p className="text-sm text-muted-foreground">
            Administracion de usuarios del sistema
          </p>
        </div>
        <Link href="/dashboard/admin/users/create">
          <Button size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Crear Usuario
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
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Compania</TableHead>
                <TableHead>Fecha Creacion</TableHead>
                <TableHead className="w-[70px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={8} className="h-48">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">Sin usuarios</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        No hay usuarios registrados
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const status = statusConfig[user.status] || statusConfig.active;
                  return (
                    <TableRow key={user.user_Id}>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.roles}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.company_name || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString("es-CO")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <UserActions
                          userId={user.user_Id}
                          username={user.username}
                          currentStatus={user.status}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
