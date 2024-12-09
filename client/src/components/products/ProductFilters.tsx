import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { CATEGORIES, CONDITION_OPTIONS } from "../../constants/productData";

interface ProductFilters {
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: ProductFilters) => void;
  isMobile?: boolean;
}

export const ProductFilters = ({
  onFilterChange,
  isMobile,
}: ProductFiltersProps) => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof ProductFilters,
    value: string | number,
  ) => {
    const newFilters = { ...filters, [key]: value || undefined };
    Object.keys(newFilters).forEach((key) => {
      if (!newFilters[key as keyof ProductFilters]) {
        delete newFilters[key as keyof ProductFilters];
      }
    });
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
    setIsOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          value={filters.category || ""}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                   bg-white/80 dark:bg-gray-800/80 text-sm focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Condition
        </label>
        <select
          value={filters.condition || ""}
          onChange={(e) => handleFilterChange("condition", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                   bg-white/80 dark:bg-gray-800/80 text-sm focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Any Condition</option>
          {CONDITION_OPTIONS.map((condition) => (
            <option key={condition.value} value={condition.value}>
              {condition.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location
        </label>
        <Input
          placeholder="Enter location"
          value={filters.location || ""}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button variant="secondary" onClick={clearFilters} fullWidth>
          Clear All
        </Button>
        {isMobile && (
          <Button
            variant="primary"
            onClick={() => setIsOpen(false)}
            className="text-sm flex-1"
          >
            Apply
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative inline-block">
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <FunnelIcon className="w-5 h-5" />
        <span>Filters</span>
        {Object.keys(filters).length > 0 && (
          <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
            {Object.keys(filters).length}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {isMobile ? (
              // Mobile Full Screen
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <FilterContent />
                  </div>
                </div>
              </motion.div>
            ) : (
              // Desktop Dropdown
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800
                           rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50
                           backdrop-blur-sm p-4 z-50"
                >
                  <FilterContent />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                />
              </>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
