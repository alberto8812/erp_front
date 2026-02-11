import { QuotationsTablePage } from "./presentation/components/QuotationsTablePage";

export default function QuotationsPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cotizaciones</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las cotizaciones de clientes y convierte en órdenes de venta
        </p>
      </div>

      <QuotationsTablePage />
    </div>
  );
}
