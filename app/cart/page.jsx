'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to continue with checkout');
      return;
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.productId} className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Img</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">₹{item.price} / {item.unit}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-600 hover:text-red-700 text-sm mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
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
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">₹{getCartTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  onClick={handleCheckout}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg text-center transition-colors"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  href="/products"
                  className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg text-center transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Store Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Store: Saurabh Provision</p>
                  <p>Phone: 9766689821</p>
                  <p>Hours: 7AM - 11PM</p>
                  <p>Owner: Vilas Yeole</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
