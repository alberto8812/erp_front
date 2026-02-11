"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Ban, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminUpdateUserStatus, UserStatus } from "@/action/user/admin-update-user-status.action";

interface UserActionsProps {
  userId: string;
  username: string;
  currentStatus: string;
}

export function UserActions({ userId, username, currentStatus }: UserActionsProps) {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<"block" | "activate" | null>(null);

  const isBlocked = currentStatus === "blocked" || currentStatus === "inactive";

  const handleAction = async () => {
    setLoading(true);
    const newStatus: UserStatus = action === "block" ? "blocked" : "active";
    const result = await adminUpdateUserStatus(userId, newStatus);

    if (!result.success) {
      console.error(result.error);
    }

    setLoading(false);
    setDialogOpen(false);
  };

  const openDialog = (actionType: "block" | "activate") => {
    setAction(actionType);
    setDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/admin/users/${userId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isBlocked ? (
            <DropdownMenuItem onClick={() => openDialog("activate")}>
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              <span className="text-green-600">Activar</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => openDialog("block")}>
              <Ban className="mr-2 h-4 w-4 text-destructive" />
              <span className="text-destructive">Bloquear</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "block" ? "Bloquear usuario" : "Activar usuario"}
            </DialogTitle>
            <DialogDescription>
              {action === "block"
                ? `¿Estás seguro de que deseas bloquear a "${username}"? El usuario no podrá acceder al sistema.`
                : `¿Estás seguro de que deseas activar a "${username}"? El usuario podrá acceder nuevamente al sistema.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant={action === "block" ? "destructive" : "default"}
              onClick={handleAction}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {action === "block" ? "Bloquear" : "Activar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
