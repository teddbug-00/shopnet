import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { AddProductForm } from "../components/products/AddProductForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProduct } from "../features/products/productsSlice";
import { Loading } from "../components/common/Loading";
import { useSnackbar } from "../context/SnackbarContext";

export const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading, error } = useAppSelector(
    (state) => state.products,
  );
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error, showSnackbar]);

  if (isLoading) return <Loading />;
  if (!currentProduct && !isLoading) {
    showSnackbar("Product not found", "error");
    return <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Product Not Found
          </h1>
          <div className="mt-4">
            <p className="text-gray-500">The product you're looking for doesn't exist or you don't have permission to edit it.</p>
            <button 
              onClick={() => navigate("/dashboard/products")}
              className="mt-4 text-primary hover:text-primary-dark"
            >
              Go back to products
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>;
  }

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
              onSuccess={() => {
                showSnackbar("Product updated successfully", "success");
                navigate("/dashboard/products");
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};