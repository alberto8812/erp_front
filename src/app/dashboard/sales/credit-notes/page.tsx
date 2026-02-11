import { CreditNotesTablePage } from "./presentation/components/CreditNotesTablePage";

export default function CreditNotesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Notas de Crédito
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las notas de crédito y aplícalas a facturas pendientes
        </p>
      </div>

      <CreditNotesTablePage />
    </div>
  );
}
