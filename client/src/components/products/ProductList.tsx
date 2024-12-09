import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../features/products/productsSlice";
import { ProductCard } from "./ProductCard";
import { Button } from "../common/Button";
import { SearchBar } from "../common/SearchBar";
import { ProductFilters } from "./ProductFilters";
import {
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Alert } from "../common/Alert";

export const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items, isLoading, error } = useAppSelector((state) => state.products);
  const [filteredItems, setFilteredItems] = useState(items);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const isSeller = user?.accountType === "seller";

  useEffect(() => {
    dispatch(fetchProducts(isSeller ? { view: "seller" } : undefined));
  }, [dispatch, isSeller]);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const handleSearch = (query: string) => {
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredItems(filtered);
  };

  const handleRefresh = () => {
    dispatch(fetchProducts(isSeller ? { view: "seller" } : undefined));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isSeller ? "Your Products" : "Available Products"}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {isSeller
              ? "Manage your product listings"
              : "Browse available products"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search and Filters for Mobile */}
          <div className="flex gap-2 sm:hidden">
            <SearchBar
              onSearch={handleSearch}
              className="flex-1"
              placeholder="Search products..."
            />
            <Button
              variant="secondary"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              icon={<FunnelIcon className="w-5 h-5" />}
              aria-label="Toggle filters"
            />
          </div>

          {/* Desktop Search and Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search products..."
            />
            <ProductFilters
              onFilterChange={(filters) => console.log(filters)}
            />
            <Button
              variant="secondary"
              onClick={handleRefresh}
              icon={<ArrowPathIcon className="w-5 h-5" />}
              aria-label="Refresh products"
            />
            {isSeller && (
              <Button
                onClick={() => navigate("/dashboard/products/new")}
                icon={<PlusIcon className="w-5 h-5" />}
              >
                Add Product
              </Button>
            )}
          </div>

          {/* Mobile Add Button for Sellers */}
          {isSeller && (
            <div className="sm:hidden">
              <Button
                fullWidth
                onClick={() => navigate("/dashboard/products/new")}
                icon={<PlusIcon className="w-5 h-5" />}
              >
                Add Product
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <ProductFilters
                onFilterChange={(filters) => console.log(filters)}
                isMobile
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <Alert variant="error" show={!!error}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl h-72"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-gray-400 dark:text-gray-500">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isSeller
                ? "Start by adding your first product"
                : "Try adjusting your search or filters"}
            </p>
            {isSeller && (
              <Button
                onClick={() => navigate("/dashboard/products/new")}
                className="mt-4"
              >
                Add Your First Product
              </Button>
            )}
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {filteredItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSellerView={isSeller}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};
