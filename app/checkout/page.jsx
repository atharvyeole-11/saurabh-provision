'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, MapPin, Phone, Clock, CreditCard, Truck } from 'lucide-react';

export default function Checkout() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState({
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    },
    paymentMethod: 'cash',
    deliveryTime: '',
    notes: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    if (user.addresses && user.addresses.length > 0) {
      setOrderData(prev => ({
        ...prev,
        deliveryAddress: user.addresses[0]
      }));
    }
  }, [user, cart, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setOrderData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: orderData.paymentMethod,
        deliveryTime: orderData.deliveryTime,
        notes: orderData.notes
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const orderResult = await response.json();
      clearCart();
      router.push(`/orders?success=${orderResult.order.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Delivery Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress.street"
                      value={orderData.deliveryAddress.street}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress.city"
                      value={orderData.deliveryAddress.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress.state"
                      value={orderData.deliveryAddress.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="State"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress.pincode"
                      value={orderData.deliveryAddress.pincode}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Pincode"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress.landmark"
                      value={orderData.deliveryAddress.landmark}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Nearby landmark"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-green-600" />
                  Delivery Options
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Delivery Time
                    </label>
                    <select
                      name="deliveryTime"
                      value={orderData.deliveryTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select delivery time</option>
                      <option value="9AM - 12PM">9AM - 12PM</option>
                      <option value="12PM - 3PM">12PM - 3PM</option>
                      <option value="3PM - 6PM">3PM - 6PM</option>
                      <option value="6PM - 9PM">6PM - 9PM</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Standard delivery: 30-45 minutes</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={orderData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="mr-3 text-green-600"
                    />
                    <span className="text-gray-700">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={orderData.paymentMethod === 'online'}
                      onChange={handleChange}
                      className="mr-3 text-green-600"
                    />
                    <span className="text-gray-700">Online Payment</span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>
                <textarea
                  name="notes"
                  value={orderData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Any special instructions for your order..."
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">₹{getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span className="font-medium">₹0</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span className="font-medium">₹0</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-green-600">₹{getCartTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-green-600" />
                    Need Help?
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Call: 9766689821</p>
                    <p>Hours: 7AM - 11PM</p>
                    <p>Owner: Vilas Yeole</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
