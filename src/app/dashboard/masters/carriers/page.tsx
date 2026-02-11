import { CarriersTablePage } from "./presentation/components/CarriersTablePage";

export default function CarrierPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transportistas</h1>
        <p className="text-sm text-muted-foreground">Gestión de transportistas</p>
      </div>
      <CarriersTablePage />
    </div>
  );
}
