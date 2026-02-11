import { VendorEvaluationsTablePage } from "./presentation/components/VendorEvaluationsTablePage";

export default function VendorEvaluationsPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Evaluación de Proveedores
        </h1>
        <p className="text-sm text-muted-foreground">
          Evalúa y califica el desempeño de los proveedores
        </p>
      </div>

      <VendorEvaluationsTablePage />
    </div>
  );
}
