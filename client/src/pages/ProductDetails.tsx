import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ImageGallery } from "../components/products/ImageGallery";
import { Loading } from "../components/common/Loading";
import { Alert } from "../components/common/Alert";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import {
  fetchProduct,
  deleteProduct,
} from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";
import { formatCurrency } from "../utils/formatters";
import {
  ShoppingCartIcon,
  HeartIcon,
  MapPinIcon,
  TruckIcon,
  ShieldCheckIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    currentProduct: product,
    isLoading,
    error,
  } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity: 1 }));
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/products/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(id!)).unwrap();
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Alert variant="error">{error}</Alert>;
  if (!product) return <Alert variant="error">Product not found</Alert>;

  const isOwner = user?.id === product.sellerId;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-6 lg:gap-12"
        >
          {/* Left Column - Images */}
          <div className="w-full lg:w-1/2">
            <ImageGallery images={product.images} />
          </div>

          {/* Right Column - Product Info */}
          <div className="w-full lg:w-1/2 space-y-6 px-4 sm:px-0">
            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {product.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{product.condition}</Badge>
                <Badge variant="secondary">{product.category}</Badge>
                {product.negotiable && (
                  <Badge variant="success">Negotiable</Badge>
                )}
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-light">
                  {formatCurrency(product.price)}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {product.location}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isOwner ? (
                <>
                  <Button
                    variant="primary"
                    onClick={handleEdit}
                    icon={<PencilSquareIcon className="w-5 h-5" />}
                    fullWidth
                  >
                    Edit Product
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    icon={<TrashIcon className="w-5 h-5" />}
                    fullWidth
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0}
                    icon={<ShoppingCartIcon className="w-5 h-5" />}
                    fullWidth
                  >
                    {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Button
                    variant="secondary"
                    icon={<HeartIcon className="w-5 h-5" />}
                    fullWidth
                  >
                    Save
                  </Button>
                </>
              )}
            </div>

            {/* Features */}
            {(product.shipping || product.warranty) && (
              <div className="flex flex-wrap gap-4 text-sm">
                {product.shipping && (
                  <div className="flex items-center text-green-600">
                    <TruckIcon className="w-5 h-5 mr-2" />
                    Shipping Available
                  </div>
                )}
                {product.warranty && (
                  <div className="flex items-center text-green-600">
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    {product.warrantyDuration || "Warranty Available"}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {Object.keys(product.specifications).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Seller Info */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {product.seller.profile?.businessName ||
                      product.seller.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Member since{" "}
                    {new Date(product.seller.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!isOwner && (
                  <Button variant="secondary" size="sm">
                    Contact Seller
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
