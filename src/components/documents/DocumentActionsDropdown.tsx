"use client";

import { useState } from "react";
import { FileText, Download, Printer, Mail, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDocumentActions,
  type DocumentType,
} from "./hooks/use-document-actions";
import { SendDocumentEmailDialog } from "./SendDocumentEmailDialog";

interface DocumentActionsDropdownProps {
  documentType: DocumentType;
  documentId: string;
  documentNumber: string;
}

export function DocumentActionsDropdown({
  documentType,
  documentId,
  documentNumber,
}: DocumentActionsDropdownProps) {
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const {
    handleDownloadPdf,
    handlePrint,
    handleSendEmail,
    isGeneratingPdf,
    isSendingEmail,
  } = useDocumentActions(documentType, documentId);

  const documentLabel =
    documentType === "invoice" ? "factura" : "guía de despacho";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isGeneratingPdf}>
            {isGeneratingPdf ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileText className="mr-1.5 h-3.5 w-3.5" />
            )}
            Documentos
            <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint} disabled={isGeneratingPdf}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowEmailDialog(true)}
            disabled={isSendingEmail}
          >
            <Mail className="mr-2 h-4 w-4" />
            Enviar por Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SendDocumentEmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        documentType={documentType}
        documentNumber={documentNumber}
        onSend={handleSendEmail}
        isSending={isSendingEmail}
      />
    </>
  );
}
