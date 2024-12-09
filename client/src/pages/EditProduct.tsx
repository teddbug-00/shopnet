import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { AddProductForm } from "../components/products/AddProductForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProduct } from "../features/products/productsSlice";
import { Loading } from "../components/common/Loading";
import { Alert } from "../components/common/Alert";

export const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading, error } = useAppSelector(
    (state) => state.products,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, id]);

  if (isLoading) return <Loading />;
  if (error) return <Alert variant="error">{error}</Alert>;
  if (!currentProduct) return <Alert variant="error">Product not found</Alert>;

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Product
          </h1>
          <div className="mt-8">
            <AddProductForm
              initialData={currentProduct}
              isEditing
              onSuccess={() => navigate("/dashboard")}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
