'use client'
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const TIME_SLOTS = [
  '7:00 AM - 8:00 AM','8:00 AM - 9:00 AM','9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM','11:00 AM - 12:00 PM','12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM','2:00 PM - 3:00 PM','3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM','5:00 PM - 6:00 PM','6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM','8:00 PM - 9:00 PM','9:00 PM - 10:00 PM',
  '10:00 PM - 11:00 PM'
];

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, discountTotal, pickupTime, setPickupTime, paymentMode, setPaymentMode } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login first!');
      router.push('/login');
      return;
    }
    if (!pickupTime) {
      toast.error('Please select a pickup time!');
      return;
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setPlacing(true);
    try {
      const orderId = 'SP' + Date.now().toString().slice(-6);
      const orderData = {
        user: user.id,
        orderId,
        items: cart.map(i => ({
          product: i._id,
          name: i.name,
          qty: i.qty,
          price: i.price,
          discount: i.discount || 0
        })),
        subtotal,
        discountAmount: discountTotal,
        totalAmount: cartTotal,
        paymentMode,
        pickupTime,
        status: 'pending'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        toast.success('Order placed successfully! 🎉');
        router.push('/orders');
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl mb-2">🛒</p>
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <Link href="/products" className="bg-green-600 text-white px-6 py-2 rounded-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item._id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                🛒
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-green-600 font-bold">₹{item.price}</p>
                {item.discount > 0 && (
                  <p className="text-xs text-orange-500">{item.discount}% OFF applied</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item._id, item.qty - 1)}
                  className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100">-</button>
                <span className="w-8 text-center font-bold">{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)}
                  className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100">+</button>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{(item.price * item.qty).toFixed(0)}</p>
                <button onClick={() => removeFromCart(item._id)}
                  className="text-red-500 text-xs mt-1 hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-bold mb-3">Select Pickup Time *</h3>
            <select
              value={pickupTime}
              onChange={e => setPickupTime(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Select Time Slot --</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-bold mb-3">Payment Method</h3>
            <label className="flex items-center gap-3 p-2 border rounded-lg mb-2 cursor-pointer hover:bg-green-50">
              <input type="radio" name="payment" value="cash"
                checked={paymentMode === 'cash'}
                onChange={() => setPaymentMode('cash')} />
              <div>
                <p className="font-medium">💵 Cash on Pickup</p>
                <p className="text-xs text-gray-500">Pay when you collect</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-blue-50">
              <input type="radio" name="payment" value="online"
                checked={paymentMode === 'online'}
                onChange={() => setPaymentMode('online')} />
              <div>
                <p className="font-medium">💳 Pay Online</p>
                <p className="text-xs text-gray-500">Contact: 9766689821</p>
              </div>
            </label>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-bold mb-3">Bill Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span><span>-₹{discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-green-700">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {placing ? 'Placing Order...' : '🛒 Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
