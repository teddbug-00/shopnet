import { motion } from 'framer-motion';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../features/cart/cartSlice';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.title}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`h-4 w-4 ${
                  index < (product.avgRating || 0)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {product.avgRating?.toFixed(1) || 'No ratings'}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center px-4 py-2 ${
              product.inventory > 0
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white rounded-lg transition-colors duration-300`}
            onClick={handleAddToCart}
            disabled={product.inventory === 0}
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>

        {product.inventory <= 5 && product.inventory > 0 && (
          <p className="mt-2 text-sm text-red-600">
            Only {product.inventory} left in stock!
          </p>
        )}
      </div>
    </motion.div>
  );
}
