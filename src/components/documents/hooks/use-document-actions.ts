"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import {
  generateInvoicePdf,
  generateShipmentPdf,
  sendInvoiceEmail,
  sendShipmentEmail,
  type SendEmailRequest,
} from "@/shared/application/use-cases/document.actions";

export type DocumentType = "invoice" | "shipment";

export function useDocumentActions(type: DocumentType, id: string) {
  const { toast } = useToast();

  const generatePdfMutation = useMutation({
    mutationFn: () =>
      type === "invoice" ? generateInvoicePdf(id) : generateShipmentPdf(id),
    onSuccess: (data) => {
      window.open(data.url, "_blank");
      toast({
        title: "PDF generado correctamente",
        description: `El documento ${data.filename} está listo para descargar`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al generar PDF",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: (data: SendEmailRequest) =>
      type === "invoice"
        ? sendInvoiceEmail(id, data)
        : sendShipmentEmail(id, data),
    onSuccess: (data) => {
      toast({
        title: "Email enviado correctamente",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al enviar email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDownloadPdf = async () => {
    await generatePdfMutation.mutateAsync();
  };

  const handlePrint = async () => {
    try {
      const { url } = await generatePdfMutation.mutateAsync();
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      // Error already handled in mutation
    }
  };

  const handleSendEmail = async (data: SendEmailRequest) => {
    await sendEmailMutation.mutateAsync(data);
  };

  return {
    generatePdfMutation,
    sendEmailMutation,
    handleDownloadPdf,
    handlePrint,
    handleSendEmail,
    isGeneratingPdf: generatePdfMutation.isPending,
    isSendingEmail: sendEmailMutation.isPending,
  };
}
