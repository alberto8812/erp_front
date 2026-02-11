import { PaymentTermsTablePage } from "./presentation/components/PaymentTermsTablePage";

export default function PaymentTermPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Condiciones de Pago</h1>
        <p className="text-sm text-muted-foreground">Gestión de condiciones de pago</p>
      </div>
      <PaymentTermsTablePage />
    </div>
  );
}
