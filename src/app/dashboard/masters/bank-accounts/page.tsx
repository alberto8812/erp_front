import { BankAccountsTablePage } from "./presentation/components/BankAccountsTablePage";

export default function BankAccountPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cuentas Bancarias</h1>
        <p className="text-sm text-muted-foreground">Gestión de cuentas bancarias</p>
      </div>
      <BankAccountsTablePage />
    </div>
  );
}
