'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderBill from '@/components/OrderBill';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, CheckCircle, Clock, CreditCard, Cash, Truck } from 'lucide-react';

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart, getCartTotal, getCartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [selectedPickupTime, setSelectedPickupTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const pickupTimeSlots = [
    '7:00AM-8:00AM', '8:00AM-9:00AM', '9:00AM-10:00AM', '10:00AM-11:00AM',
    '11:00AM-12:00PM', '12:00PM-1:00PM', '1:00PM-2:00PM', '2:00PM-3:00PM',
    '3:00PM-4:00PM', '4:00PM-5:00PM', '5:00PM-6:00PM', '6:00PM-7:00PM',
    '7:00PM-8:00PM', '8:00PM-9:00PM', '9:00PM-10:00PM', '10:00PM-11:00PM'
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load saved pickup time and payment method
    const savedPickupTime = localStorage.getItem('selectedPickupTime');
    const savedPaymentMethod = localStorage.getItem('paymentMethod');
    
    if (savedPickupTime) {
      setSelectedPickupTime(savedPickupTime);
    }
    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod);
    }
  }, [user, router]);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const hasDiscount = item.discount && item.discount > 0;
      const price = hasDiscount ? item.price * (1 - item.discount / 100) : item.price;
      return total + (price * item.quantity);
    }, 0);
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

  const handlePlaceOrder = async () => {
    if (!selectedPickupTime) {
      alert('Please select a pickup time');
      return;
    }

    setLoading(true);
    
    try {
      const orderPayload = {
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          discount: item.discount,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        total: calculateFinalTotal(),
        pickupTime: selectedPickupTime,
        paymentMethod: paymentMethod,
        status: 'pending'
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderData(data.order);
        setOrderPlaced(true);
        clearCart();
        localStorage.removeItem('selectedPickupTime');
        localStorage.removeItem('paymentMethod');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Please add items to your cart before checkout.
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

  if (orderPlaced && orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-lg text-gray-600 mb-4">
                Thank you for your order. We&apos;ll prepare it for pickup.
              </p>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                <p className="text-lg font-semibold text-green-800">
                  Order Number: #{orderData._id.slice(-8)}
                </p>
              </div>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    Pickup Time: <strong>{selectedPickupTime}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {paymentMethod === 'cash' ? (
                    <Cash className="w-5 h-5 text-gray-500" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-gray-700">
                    Payment: <strong>{paymentMethod === 'cash' ? 'Cash on Pickup' : 'Pay Online'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    Status: <strong className="text-yellow-600">Pending</strong>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href="/orders"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View Orders
              </Link>
              <Link
                href="/products"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
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
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Customer Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Name</span>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email</span>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone</span>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Address</span>
                      <p className="font-medium">{user.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Items ({getCartCount()} items)</h3>
                <div className="space-y-3">
                  {cart.map((item) => {
                    const hasDiscount = item.discount && item.discount > 0;
                    const price = hasDiscount ? item.price * (1 - item.discount / 100) : item.price;
                    const itemTotal = price * item.quantity;
                    
                    return (
                      <div key={item.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">No Img</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="flex items-center gap-2">
                            {hasDiscount && (
                              <span className="text-gray-500 line-through text-sm">₹{item.price}</span>
                            )}
                            <span className="text-green-600 font-semibold">₹{price.toFixed(2)}</span>
                            <span className="text-gray-500 text-sm">/{item.unit}</span>
                            <span className="text-gray-500 text-sm">× {item.quantity}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-green-600">₹{itemTotal.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Checkout Details</h2>
              
              {/* Pickup Time */}
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
                    <Cash className="w-4 h-4 mr-2" />
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
                    <CreditCard className="w-4 h-4 mr-2" />
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
                  <span>Pickup Fee</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total</span>
                    <span>₹{calculateFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedPickupTime}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Placing Order...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
