import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { clearCart } from "../features/cart/cartSlice";
import { formatCurrency } from "../utils/formatters";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [billingInfo, setBillingInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.profile?.address || "",
    city: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const shipping = 5.99;
  const tax = subtotal * 0.1; // Assume 10% tax
  const total = subtotal + shipping + tax;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would connect to your payment processor
      // For now, we'll just simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful checkout
      dispatch(clearCart());
      
      // Navigate to order confirmation
      navigate("/order-confirmation", {
        state: { 
          orderNumber: `ORD-${Date.now()}`,
          orderTotal: total
        }
      });
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <DashboardLayout>
        <div className="py-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="mb-6">You don't have any items in your cart.</p>
          <Button onClick={() => navigate("/dashboard")}>
            Browse Products
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Your Items</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex border-b pb-4">
                    <img
                      src={item.product.images[0] || "/placeholder.jpg"}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{item.product.title}</h3>
                      <p className="text-gray-500 text-sm">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-medium mt-1">
                        {formatCurrency(Number(item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={billingInfo.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={billingInfo.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Address"
                  name="address"
                  value={billingInfo.address}
                  onChange={handleChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={billingInfo.city}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Zip/Postal Code"
                    name="zipCode"
                    value={billingInfo.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Input
                  label="Country"
                  name="country"
                  value={billingInfo.country}
                  onChange={handleChange}
                  required
                />
                
                <h2 className="text-lg font-semibold mb-4 mt-6">Payment Information</h2>
                <Input
                  label="Card Number"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={billingInfo.cardNumber}
                  onChange={handleChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    name="cardExpiry"
                    placeholder="MM/YY"
                    value={billingInfo.cardExpiry}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="CVC"
                    name="cardCvc"
                    placeholder="123"
                    value={billingInfo.cardCvc}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  className="mt-6"
                >
                  {isSubmitting ? "Processing..." : `Pay ${formatCurrency(total)}`}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutPage;