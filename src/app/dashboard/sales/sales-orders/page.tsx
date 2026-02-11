import { SalesOrdersTablePage } from "./presentation/components/SalesOrdersTablePage";

export default function SalesOrdersPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Órdenes de Venta
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las órdenes de venta, desde borradores hasta confirmación y
          despacho
        </p>
      </div>

      <SalesOrdersTablePage />
    </div>
  );
}
