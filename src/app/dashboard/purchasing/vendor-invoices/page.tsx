import { VendorInvoicesTablePage } from "./presentation/components/VendorInvoicesTablePage";

export default function VendorInvoicesPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Facturas de Proveedor
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las facturas de proveedores y el proceso de conciliación
        </p>
      </div>

      <VendorInvoicesTablePage />
    </div>
  );
}
