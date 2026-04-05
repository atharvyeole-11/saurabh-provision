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
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-4">Order #{order.orderId}</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-4">
            <p className="text-sm"><span className="font-medium">Pickup Time:</span> {order.pickupTime}</p>
            <p className="text-sm"><span className="font-medium">Payment:</span> {order.paymentMode === 'cash' ? 'Cash on Pickup' : 'Online'}</p>
            <p className="text-sm"><span className="font-medium">Total:</span> ₹{order.totalAmount}</p>
          </div>
          <Link href="/orders" className="block w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl mb-4">Loading checkout...</p>
        <Link href="/cart" className="text-green-600 underline">Back to Cart</Link>
      </div>
    </div>
  );
}
