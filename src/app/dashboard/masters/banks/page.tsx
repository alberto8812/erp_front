import { BanksTablePage } from "./presentation/components/BanksTablePage";

export default function BankPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bancos</h1>
        <p className="text-sm text-muted-foreground">Gestión de bancos</p>
      </div>
      <BanksTablePage />
    </div>
  );
}
