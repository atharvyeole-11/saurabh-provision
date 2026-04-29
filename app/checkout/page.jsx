'use client'
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, discountTotal, clearCart, pickupTime, paymentMode } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
    if (cart.length === 0 && !order) router.push('/cart');
  }, [user, cart]);

  const handleConfirm = async () => {
    if (!user) { toast.error('Please login'); return; }
    if (!pickupTime) { toast.error('Please select pickup time'); return; }
    setLoading(true);
    try {
      const orderId = 'SP' + Date.now().toString().slice(-6);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user.id,
          orderId,
          items: cart.map(i => ({
            product: i._id,
            name: i.name,
            qty: i.qty,
            price: i.price,
            discount: i.discount || 0
          })),
          subtotal: cartTotal + discountTotal,
          discountAmount: discountTotal,
          totalAmount: cartTotal,
          paymentMode,
          pickupTime,
          status: 'pending'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
        clearCart();
        toast.success('Order placed! 🎉');
      } else {
        toast.error(data.error || 'Failed');
      }
    } catch(e) {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  if (order) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full text-center shadow-2xl border border-green-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl">
              ✓
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-8 font-medium">Thank you for shopping at Saurabh Provision.</p>
          
          <div className="bg-gray-50 rounded-3xl p-6 text-left mb-8 space-y-4 border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-500 text-sm font-bold">ORDER ID</span>
              <span className="font-mono font-bold text-green-700">#{order.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-bold">PICKUP TIME</span>
              <span className="font-bold text-gray-900">{order.pickupTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-bold">PAYMENT</span>
              <span className="font-bold text-gray-900 uppercase text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md">
                {order.paymentMethod === 'cash' ? 'Cash on Pickup' : 'Online Paid'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-gray-900 font-extrabold">TOTAL AMOUNT</span>
              <span className="text-2xl font-black text-green-600">₹{order.totalAmount}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/orders" className="bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-900/20 transform active:scale-95">
              Track My Order
            </Link>
            <Link href="/" className="text-gray-500 hover:text-green-600 font-bold transition text-sm">
              Back to Home
            </Link>
          </div>
          
          <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Please show this order ID at the counter for quick pickup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                Order Summary
              </h2>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                    <p className="font-bold text-sm text-gray-900">₹{item.qty * item.price}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t-2 border-dashed border-gray-100">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>₹{cartTotal + discountTotal}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{discountTotal}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black text-gray-900 pt-2">
                  <span>Payable</span>
                  <span className="text-green-600">₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup & Payment */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                Pickup Details
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Selected Pickup Time</label>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-800 font-bold flex items-center justify-between">
                    <span>{pickupTime || 'No time selected'}</span>
                    <Link href="/cart" className="text-xs text-green-600 underline">Change</Link>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Payment Method</label>
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-800 font-bold flex items-center justify-between">
                    <span className="capitalize">{paymentMode === 'cash' ? 'Cash on Pickup' : 'Online Payment'}</span>
                    <Link href="/cart" className="text-xs text-orange-600 underline">Change</Link>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleConfirm}
                    disabled={loading || cart.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 text-white py-5 rounded-2xl font-black text-lg transition shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 active:scale-95 transform"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>CONFIRM ORDER (₹{cartTotal})</>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">
                    Secure transaction · Faster pickup
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
