'use client'
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import PaymentSystem from '@/components/PaymentSystem';
import OrderConfirmation from '@/components/OrderConfirmation';
import { ShoppingCart, Trash2, Plus, Minus, Clock, AlertCircle, MapPin } from 'lucide-react';

const TIME_SLOTS = [
  '7:00 AM - 8:00 AM','8:00 AM - 9:00 AM','9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM','11:00 AM - 12:00 PM','12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM','2:00 PM - 3:00 PM','3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM','5:00 PM - 6:00 PM','6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM','8:00 PM - 9:00 PM','9:00 PM - 10:00 PM',
  '10:00 PM - 11:00 PM'
];

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, getCartTotal, getCartCount, selectedPickupTime, setPickupTime } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountTotal = cart.reduce((s, i) => {
    if (i.discount && i.discount > 0) {
      return s + (i.price * i.discount / 100) * i.quantity;
    }
    return s;
  }, 0);
  const cartTotal = subtotal - discountTotal;

  const handleProceedToPayment = () => {
    if (!user) {
      toast.error('Please login first!');
      router.push('/login');
      return;
    }
    if (!selectedPickupTime) {
      toast.error('Please select a pickup time!');
      return;
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setShowPayment(true);
  };

  const handleOrderComplete = (order) => {
    setConfirmedOrder(order);
    setShowPayment(false);
  };

  if (confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} />;
  }

  if (showPayment) {
    return (
      <PaymentSystem
        cart={cart}
        selectedPickupTime={selectedPickupTime}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <ShoppingCart className="w-24 h-24 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some items to get started</p>
        <Link
          href="/products"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemPrice = item.price * (1 - (item.discount || 0) / 100);
              const itemTotal = itemPrice * item.quantity;
              
              return (
                <div key={item.productId} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">No Image</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-600 font-bold">₹{itemPrice.toFixed(2)}</span>
                        {item.discount && item.discount > 0 && (
                          <>
                            <span className="text-gray-400 line-through text-sm">
                              ₹{item.price.toFixed(2)}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {item.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.productId, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-green-600">₹{itemTotal.toFixed(2)}</span>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Pickup Time */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Pickup Time *
                </label>
                <select
                  value={selectedPickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select pickup time</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {!selectedPickupTime && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Please select a pickup time
                  </p>
                )}
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-xs text-orange-700 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <strong>Pickup available in Malegaon only</strong>
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Orders prepared within selected time slot
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-₹{discountTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-green-600">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Proceed to Payment
              </button>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="block w-full text-center text-green-600 hover:text-green-700 py-2 px-4 rounded-lg font-medium transition-colors mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
