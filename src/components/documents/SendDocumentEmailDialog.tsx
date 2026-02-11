"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { DocumentType } from "./hooks/use-document-actions";
import type { SendEmailRequest } from "@/shared/application/use-cases/document.actions";

const formSchema = z.object({
  recipients: z.string().min(1, "Debe ingresar al menos un destinatario"),
  cc: z.string().optional(),
  message: z.string().optional(),
  attachPdf: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface SendDocumentEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: DocumentType;
  documentNumber: string;
  onSend: (data: SendEmailRequest) => Promise<void>;
  isSending: boolean;
}

export function SendDocumentEmailDialog({
  open,
  onOpenChange,
  documentType,
  documentNumber,
  onSend,
  isSending,
}: SendDocumentEmailDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipients: "",
      cc: "",
      message: "",
      attachPdf: true,
    },
  });

  const documentLabel =
    documentType === "invoice" ? "Factura" : "Guía de Despacho";

  const parseEmails = (emailString: string): string[] => {
    return emailString
      .split(/[,;]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
  };

  const handleSubmit = async (values: FormValues) => {
    const emailData: SendEmailRequest = {
      recipients: parseEmails(values.recipients),
      cc: values.cc ? parseEmails(values.cc) : undefined,
      message: values.message || undefined,
      attachPdf: values.attachPdf,
    };

    try {
      await onSend(emailData);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar {documentLabel}</DialogTitle>
          <DialogDescription>
            Se enviará el documento {documentNumber} a los destinatarios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="recipients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinatarios *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@ejemplo.com, otro@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separar múltiples emails con coma
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CC (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="copia@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mensaje adicional para el correo..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachPdf"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Adjuntar PDF</FormLabel>
                    <FormDescription>
                      Incluir el documento en PDF como adjunto
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSending}>
                {isSending ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                )}
                Enviar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
