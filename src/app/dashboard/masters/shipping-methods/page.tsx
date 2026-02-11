import { ShippingMethodsTablePage } from "./presentation/components/ShippingMethodsTablePage";

export default function ShippingMethodPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Métodos de Envío</h1>
        <p className="text-sm text-muted-foreground">Gestión de métodos de envío</p>
      </div>
      <ShippingMethodsTablePage />
    </div>
  );
}
