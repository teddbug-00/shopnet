import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Product } from "../../types/product";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../features/cart/cartSlice";
import { Button } from "../common/Button";
import { formatCurrency } from "../../utils/formatters";

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl overflow-hidden group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square w-full">
          <img
            src={product.images[0] || "/placeholder-product.jpg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          {/* Product Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <h3 className="text-sm sm:text-base font-medium line-clamp-2 mb-1">
              {product.title}
            </h3>
            <p className="text-sm sm:text-base font-semibold">
              {formatCurrency(Number(product.price))}
            </p>

            {/* Add to Cart Button - Only visible on hover/tap */}
            <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 mt-2">
              <Button
                size="sm"
                fullWidth
                icon={<ShoppingCartIcon className="w-4 h-4" />}
                disabled={product.inventory === 0}
                onClick={handleAddToCart}
              >
                {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>

          {/* Out of Stock Overlay */}
          {product.inventory === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-sm sm:text-base font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
