'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import OrderBill from '@/components/OrderBill';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetch(`/api/orders`)
        .then(r => r.json())
        .then(data => {
          setOrders(Array.isArray(data.orders) ? data.orders : Array.isArray(data) ? data : []);
          setFetching(false);
        })
        .catch(() => setFetching(false));
    }
  }, [user, loading]);

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading orders...</p>
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-4xl mb-4">📦</p>
      <h2 className="text-xl font-bold mb-2">No orders yet</h2>
      <Link href="/products" className="bg-green-600 text-white px-6 py-2 rounded-lg">
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="flex items-center bg-green-50 px-3 py-1 rounded-full border border-green-200">
          <MapPin className="w-4 h-4 mr-1 text-green-600" />
          <span className="text-sm text-green-700 font-medium">Malegaon</span>
        </div>
      </div>
      <p className="text-gray-600 mb-6">Your order history for pickup in Malegaon</p>
      <div className="space-y-6">
        {orders.map(order => (
          <OrderBill key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
