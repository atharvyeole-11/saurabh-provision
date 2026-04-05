'use client';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, Clock } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [selectedPickupTime, setSelectedPickupTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const pickupTimeSlots = [
    '7:00AM-8:00AM', '8:00AM-9:00AM', '9:00AM-10:00AM', '10:00AM-11:00AM',
    '11:00AM-12:00PM', '12:00PM-1:00PM', '1:00PM-2:00PM', '2:00PM-3:00PM',
    '3:00PM-4:00PM', '4:00PM-5:00PM', '5:00PM-6:00PM', '6:00PM-7:00PM',
    '7:00PM-8:00PM', '8:00PM-9:00PM', '9:00PM-10:00PM', '10:00PM-11:00PM'
  ];

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to continue with checkout');
      return;
    }
    if (!selectedPickupTime) {
      alert('Please select a pickup time');
      return;
    }
    localStorage.setItem('selectedPickupTime', selectedPickupTime);
    localStorage.setItem('paymentMethod', paymentMethod);
    window.location.href = '/checkout';
  };

  const calculateItemTotal = (item) => {
    const hasDiscount = item.discount && item.discount > 0;
    const price = hasDiscount ? item.price * (1 - item.discount / 100) : item.price;
    return price * item.quantity;
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const calculateDiscount = () => {
    return cart.reduce((total, item) => {
      if (item.discount && item.discount > 0) {
        return total + (item.price * item.discount / 100) * item.quantity;
      }
      return total;
    }, 0);
  };

  const calculateFinalTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shopping Cart ({cart.length} items)</h2>
              
              <div className="space-y-4">
                {cart.map((item) => {
                  const hasDiscount = item.discount && item.discount > 0;
                  const price = hasDiscount ? item.price * (1 - item.discount / 100) : item.price;
                  const itemTotal = price * item.quantity;
                  
                  return (
                    <div key={item._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No Img</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          {hasDiscount && (
                            <span className="text-gray-500 line-through text-sm">₹{item.price}</span>
                          )}
                          <span className="text-green-600 font-bold">₹{price.toFixed(2)}</span>
                          <span className="text-gray-500 text-sm">/{item.unit}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-green-600">₹{itemTotal.toFixed(2)}</div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="mt-2 p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Pickup Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Pickup Time
                </label>
                <select
                  value={selectedPickupTime}
                  onChange={(e) => setSelectedPickupTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select pickup time</option>
                  {pickupTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span>Cash on Pickup</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span>Pay Online</span>
                  </label>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{calculateDiscount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total</span>
                    <span>₹{calculateFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Place Order
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
