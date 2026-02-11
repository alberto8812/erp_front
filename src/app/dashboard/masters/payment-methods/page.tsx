import { PaymentMethodsTablePage } from "./presentation/components/PaymentMethodsTablePage";

export default function PaymentMethodPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Métodos de Pago</h1>
        <p className="text-sm text-muted-foreground">Gestión de métodos de pago</p>
      </div>
      <PaymentMethodsTablePage />
    </div>
  );
}
