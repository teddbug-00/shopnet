import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ShoppingCartIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { removeFromCart, updateQuantity } from "../../features/cart/cartSlice";
import { Button } from "../common/Button";
import { formatCurrency } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";

export const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  
  const handleRemoveItem = (productId: string, productName: string) => {
    dispatch(removeFromCart(productId));
    showSnackbar(`${productName} removed from cart`, "info");
  };
  
  const handleQuantityChange = (productId: string, quantity: number, currentQty: number) => {
    dispatch(updateQuantity({ productId, quantity }));
    
    if (quantity > currentQty) {
      showSnackbar("Quantity increased", "success");
    } else {
      showSnackbar("Quantity decreased", "info");
    }
  };
  
  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };
  
  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCartIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium">Shopping Cart ({totalItems})</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {items.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Your cart is empty
                </div>
              ) : (
                <>
                  <div className="max-h-96 overflow-auto p-2">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg mb-2"
                      >
                        <img
                          src={item.product.images[0] || "/placeholder.jpg"}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.product.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatCurrency(Number(item.product.price))}
                          </p>
                          <div className="flex items-center mt-1">
                            <button
                              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                              onClick={() => handleQuantityChange(item.product.id, Math.max(1, item.quantity - 1), item.quantity)}
                            >
                              -
                            </button>
                            <span className="mx-2 text-sm">{item.quantity}</span>
                            <button
                              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1, item.quantity)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product.id, item.product.title)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold">{formatCurrency(subtotal)}</span>
                    </div>
                    <Button onClick={handleCheckout} fullWidth>
                      Checkout
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
