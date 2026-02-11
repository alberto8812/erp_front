import { ProductCategoriesTablePage } from "./presentation/components/ProductCategoriesTablePage";

export default function ProductCategoriesPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Categorías de Productos</h1>
        <p className="text-sm text-muted-foreground">
          Clasificación jerárquica de productos
        </p>
      </div>
      <ProductCategoriesTablePage />
    </div>
  );
}
