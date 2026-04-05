'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/login');
    if (isAdmin) fetchOrders();
  }, [isAdmin, loading]);

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setFetching(false);
  };

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      toast.success('Order updated!');
      fetchOrders();
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all','pending','ready','completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              filter === f ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
            {f} {f === 'all' ? `(${orders.length})` : `(${orders.filter(o=>o.status===f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(order => (
          <div key={order._id} className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
              <div>
                <p className="font-bold text-lg">#{order.orderId || order._id?.slice(-6)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString('en-IN')}
                </p>
                <p className="text-sm font-medium mt-1">
                  Customer: {order.user?.name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">
                  📞 {order.user?.phone || order.user?.email || '-'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-700">₹{order.totalAmount}</p>
                <p className="text-sm text-gray-500">{order.paymentMode === 'cash' ? '💵 Cash' : '💳 Online'}</p>
                <p className="text-sm text-gray-500">🕐 {order.pickupTime}</p>
              </div>
            </div>

            <div className="border-t pt-3 mb-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{item.name} × {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status?.toUpperCase()}
              </span>
              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <button onClick={() => updateStatus(order._id, 'ready')}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700">
                    Mark Ready ✓
                  </button>
                )}
                {order.status === 'ready' && (
                  <button onClick={() => updateStatus(order._id, 'completed')}
                    className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700">
                    Mark Completed ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
