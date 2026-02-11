import { ProductsTablePage } from "./presentation/components/ProductsTablePage";

export default function ProductsPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
        <p className="text-sm text-muted-foreground">
          Maestro de productos, SKUs y características
        </p>
      </div>
      <ProductsTablePage />
    </div>
  );
}
