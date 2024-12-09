import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ProductList } from "../components/products/ProductList";

export const Products = () => {
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductList />
        </div>
      </div>
    </DashboardLayout>
  );
};
