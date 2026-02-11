import { InvoicesTablePage } from "./presentation/components/InvoicesTablePage";

export default function InvoicesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Facturas de Venta
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las facturas de clientes, facturación electrónica y reportes DIAN
        </p>
      </div>

      <InvoicesTablePage />
    </div>
  );
}
