import { TaxResponsibilitiesTablePage } from "./presentation/components/TaxResponsibilitiesTablePage";

export default function TaxResponsibilityPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Responsabilidades Tributarias</h1>
        <p className="text-sm text-muted-foreground">Gestión de responsabilidades tributarias</p>
      </div>
      <TaxResponsibilitiesTablePage />
    </div>
  );
}
