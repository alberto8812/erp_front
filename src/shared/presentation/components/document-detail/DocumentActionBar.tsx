"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MoreHorizontal, Pencil } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { DocumentAction } from "./types";

interface DocumentActionBarProps {
  title: string;
  subtitle?: string;
  documentNumber?: string;
  backUrl: string;
  status?: {
    label: string;
    color: string;
  };
  primaryActions?: DocumentAction[];
  secondaryActions?: DocumentAction[];
  editUrl?: string;
  canEdit?: boolean;
}

export function DocumentActionBar({
  title,
  subtitle,
  documentNumber,
  backUrl,
  status,
  primaryActions = [],
  secondaryActions = [],
  editUrl,
  canEdit = false,
}: DocumentActionBarProps) {
  const router = useRouter();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: DocumentAction | null;
    inputValue: string;
  }>({ open: false, action: null, inputValue: "" });
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const handleActionClick = async (action: DocumentAction) => {
    if (action.requiresConfirmation || action.requiresInput) {
      setConfirmDialog({ open: true, action, inputValue: "" });
      return;
    }

    await executeAction(action);
  };

  const executeAction = async (action: DocumentAction, input?: string) => {
    setLoadingActionId(action.id);
    try {
      await action.onClick(input);
    } finally {
      setLoadingActionId(null);
      setConfirmDialog({ open: false, action: null, inputValue: "" });
    }
  };

  const handleConfirm = async () => {
    if (!confirmDialog.action) return;
    const input = confirmDialog.action.requiresInput
      ? confirmDialog.inputValue
      : undefined;
    await executeAction(confirmDialog.action, input);
  };

  return (
    <>
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => router.push(backUrl)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-semibold tracking-tight truncate">
                    {title}
                  </h1>
                  {documentNumber && (
                    <span className="text-sm font-mono text-muted-foreground shrink-0">
                      #{documentNumber}
                    </span>
                  )}
                  {status && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${status.color}`}
                    >
                      {status.label}
                    </span>
                  )}
                </div>
                {subtitle && (
                  <p className="text-sm text-muted-foreground truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Primary Actions */}
              {primaryActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || "default"}
                  size="sm"
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled || loadingActionId === action.id}
                >
                  {loadingActionId === action.id ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : action.icon ? (
                    <action.icon className="mr-1.5 h-3.5 w-3.5" />
                  ) : null}
                  {action.label}
                </Button>
              ))}

              {/* Edit Button */}
              {canEdit && editUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(editUrl)}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Editar
                </Button>
              )}

              {/* Secondary Actions Dropdown */}
              {secondaryActions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {secondaryActions.map((action, index) => (
                      <div key={action.id}>
                        {index > 0 &&
                          action.variant === "destructive" && (
                            <DropdownMenuSeparator />
                          )}
                        <DropdownMenuItem
                          onClick={() => handleActionClick(action)}
                          disabled={action.disabled || loadingActionId === action.id}
                          className={
                            action.variant === "destructive"
                              ? "text-destructive focus:text-destructive"
                              : ""
                          }
                        >
                          {action.icon && (
                            <action.icon className="mr-2 h-4 w-4" />
                          )}
                          {loadingActionId === action.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          {action.label}
                        </DropdownMenuItem>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !open && setConfirmDialog({ open: false, action: null, inputValue: "" })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action?.confirmationTitle || "Confirmar accion"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action?.confirmationDescription ||
                "Esta accion no se puede deshacer."}
            </DialogDescription>
          </DialogHeader>

          {confirmDialog.action?.requiresInput && (
            <div className="py-4">
              <Label htmlFor="confirmation-input" className="text-sm font-medium">
                {confirmDialog.action.confirmationInputLabel || "Motivo"}
              </Label>
              <Textarea
                id="confirmation-input"
                placeholder={
                  confirmDialog.action.confirmationInputPlaceholder ||
                  "Ingrese el motivo..."
                }
                value={confirmDialog.inputValue}
                onChange={(e) =>
                  setConfirmDialog((prev) => ({
                    ...prev,
                    inputValue: e.target.value,
                  }))
                }
                className="mt-2"
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ open: false, action: null, inputValue: "" })
              }
            >
              Cancelar
            </Button>
            <Button
              variant={
                confirmDialog.action?.variant === "destructive"
                  ? "destructive"
                  : "default"
              }
              onClick={handleConfirm}
              disabled={
                confirmDialog.action?.requiresInput &&
                !confirmDialog.inputValue.trim()
              }
            >
              {loadingActionId === confirmDialog.action?.id && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
