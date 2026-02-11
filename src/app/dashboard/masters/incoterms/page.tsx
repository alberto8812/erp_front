import { IncotermsTablePage } from "./presentation/components/IncotermsTablePage";

export default function IncotermPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Incoterms</h1>
        <p className="text-sm text-muted-foreground">Gestión de incoterms</p>
      </div>
      <IncotermsTablePage />
    </div>
  );
}
