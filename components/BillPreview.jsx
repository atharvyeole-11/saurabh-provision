'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Clock, MapPin, Phone, Calendar, Download, Share2 } from 'lucide-react';

export default function BillPreview({ cart, selectedPickupTime, onProceedToPayment }) {
  const { user } = useAuth();
  const { getCartTotal } = useCart();
  
  // Generate unique Order ID
  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD${timestamp}${random}`;
  };

  const orderId = generateOrderId();
  const currentDate = new Date().toLocaleDateString('en-IN');
  const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountTotal = cart.reduce((sum, item) => {
    if (item.discount && item.discount > 0) {
      return sum + ((item.price * item.discount / 100) * item.quantity);
    }
    return sum;
  }, 0);
  const total = subtotal - discountTotal;

  const handleWhatsAppShare = () => {
    const message = `*Order Confirmation*\n\n` +
      `*Order ID:* ${orderId}\n` +
      `*Store:* Saurabh Provision\n` +
      `*Location:* Malegaon, Maharashtra\n\n` +
      `*Customer:* ${user?.name || 'Guest'}\n` +
      `*Phone:* ${user?.phone || 'N/A'}\n\n` +
      `*Items:*\n` +
      cart.map(item => 
        `  ${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
      ).join('\n') +
      `\n\n` +
      `*Subtotal:* $${subtotal.toFixed(2)}\n` +
      `*Discount:* -$${discountTotal.toFixed(2)}\n` +
      `*Total:* $${total.toFixed(2)}\n\n` +
      `*Pickup Time:* ${selectedPickupTime}\n` +
      `*Date:* ${currentDate}\n` +
      `*Time:* ${currentTime}\n\n` +
      `Your order will be ready before you arrive!`;

    window.open(`https://wa.me/919766689821?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    console.log('PDF download to be implemented');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Bill Header */}
      <div className="bg-green-600 text-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Saurabh Provision</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-green-100">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Malegaon, Maharashtra</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>9766689821</span>
          </div>
        </div>
      </div>

      {/* Bill Content */}
      <div className="p-6">
        {/* Order Details */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-600">Order ID: {orderId}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{currentDate}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{currentTime}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-medium">{user?.name || 'Guest Customer'}</p>
              <p className="text-sm text-gray-600">{user?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pickup Time</p>
              <p className="font-medium">{selectedPickupTime || 'Not selected'}</p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Items</h3>
          <div className="space-y-2">
            {cart.map((item, index) => {
              const itemTotal = item.price * item.quantity;
              const itemDiscount = item.discount ? (item.price * item.discount / 100) * item.quantity : 0;
              const finalItemTotal = itemTotal - itemDiscount;
              
              return (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} × {item.quantity}
                      {item.discount && (
                        <span className="text-green-600 ml-2">
                          ({item.discount}% off)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    {item.discount && (
                      <p className="text-sm text-gray-400 line-through">
                        ${itemTotal.toFixed(2)}
                      </p>
                    )}
                    <p className="font-medium text-gray-900">
                      ${finalItemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {discountTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">-${discountTotal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total Amount</span>
            <span className="text-green-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Trust Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800 text-center">
            Your order will be ready before you arrive
          </p>
          <p className="text-xs text-green-600 text-center mt-1">
            Serving Malegaon | Open 7 AM - 11 PM
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onProceedToPayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            Proceed to Payment
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
