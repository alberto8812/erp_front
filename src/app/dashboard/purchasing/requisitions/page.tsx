import { RequisitionsTablePage } from "./presentation/components/RequisitionsTablePage";

export default function RequisitionsPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Requisiciones</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las solicitudes de compra internas
        </p>
      </div>

      <RequisitionsTablePage />
    </div>
  );
}
