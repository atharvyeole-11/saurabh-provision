'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderBill from '@/components/OrderBill';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit
} from 'lucide-react';

export default function AdminOrders() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchOrders();
  }, [user, router, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/orders?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'ready':
        return <Package className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchLower)) ||
      (order.user?.phone && order.user.phone.includes(searchTerm)) ||
      (order.items && order.items.some(item => 
        item.name.toLowerCase().includes(searchLower)
      ))
    );
  });

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (loading) {
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
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders by ID, customer, or product..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        ₹{order.totalAmount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                            className="text-blue-600 hover:text-blue-900"
                            title="Confirm Order"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'preparing')}
                            className="text-purple-600 hover:text-purple-900"
                            title="Start Preparing"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                        
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'ready')}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Mark as Ready"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {order.status === 'ready' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'delivered')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Delivered"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-600">
              {searchTerm || statusFilter ? 'Try adjusting your search or filters' : 'No orders have been placed yet'}
            </p>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <OrderBill order={selectedOrder} showHeader={false} />
                
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'confirmed')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Confirm Order
                      </button>
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'preparing')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                      >
                        Start Preparing
                      </button>
                    )}
                    {selectedOrder.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'ready')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                      >
                        Mark as Ready
                      </button>
                    )}
                    {selectedOrder.status === 'ready' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'delivered')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
