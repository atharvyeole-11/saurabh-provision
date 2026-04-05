'use client';
import { Phone, MapPin, Clock, IndianRupee, Package, User } from 'lucide-react';

export default function OrderBill({ order, showHeader = true }) {
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

  const formatOrderDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Order data not available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {showHeader && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Order Receipt</h2>
              <p className="text-green-100 mt-1">Order #{order._id.slice(-8)}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2 text-green-600" />
              Customer Details
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {order.user?.name || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {order.user?.phone || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {order.user?.email || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              Delivery Address
            </h3>
            <div className="space-y-1 text-sm">
              {order.deliveryAddress ? (
                <>
                  <p>{order.deliveryAddress.street}</p>
                  {order.deliveryAddress.landmark && <p>{order.deliveryAddress.landmark}</p>}
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                </>
              ) : (
                <p className="text-gray-500">No delivery address provided</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Package className="w-4 h-4 mr-2 text-green-600" />
            Order Items
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} {item.unit} × ₹{item.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">₹0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">₹0</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total Amount</span>
              <span className="text-green-600">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-green-600" />
              <div>
                <p className="font-medium">Order Time</p>
                <p>{formatOrderDate(order.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600">
              <IndianRupee className="w-4 h-4 mr-2 text-green-600" />
              <div>
                <p className="font-medium">Payment</p>
                <p>{order.paymentMethod?.charAt(0).toUpperCase() + order.paymentMethod?.slice(1) || 'Cash'}</p>
              </div>
            </div>
            
            {order.deliveryTime && (
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-green-600" />
                <div>
                  <p className="font-medium">Delivery Time</p>
                  <p>{order.deliveryTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {order.notes && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Order Notes</h3>
            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{order.notes}</p>
          </div>
        )}

        <div className="border-t pt-4 text-center">
          <p className="text-sm text-gray-500 mb-2">Thank you for shopping with us!</p>
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>9766689821</span>
          </div>
        </div>
      </div>
    </div>
  );
}
