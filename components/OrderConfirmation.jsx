'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Share2, 
  Download, 
  Calendar,
  Copy,
  Check,
  MessageCircle
} from 'lucide-react';

export default function OrderConfirmation({ order }) {
  const [copied, setCopied] = useState(false);
  const [autoRedirected, setAutoRedirected] = useState(false);

  const handleWhatsAppShare = () => {
    const message = `*SAURABH PROVISION - ORDER PREVIEW*\n` +
      `--------------------------------\n` +
      `*Order ID:* ${order.orderId}\n` +
      `--------------------------------\n` +
      `*Customer:* ${order.customerDetails.name || 'Guest'}\n` +
      `*Phone:* ${order.customerDetails.phone || 'N/A'}\n` +
      `*Pickup:* ${order.pickupTime}\n` +
      `--------------------------------\n` +
      `*Items:*\n` +
      order.items.map(item => 
        `• ${item.name} x${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`
      ).join('\n') +
      `\n--------------------------------\n` +
      `*TOTAL AMOUNT: ₹${order.totalAmount.toFixed(2)}*\n` +
      `--------------------------------\n` +
      `_Pre-order generated from Saurabh Store Website_`;

    window.open(`https://wa.me/919766689821?text=${encodeURIComponent(message)}`, '_blank');
  };

  useEffect(() => {
    // Automatically trigger WhatsApp share after 2 seconds for a seamless experience
    const timer = setTimeout(() => {
      if (!autoRedirected) {
        handleWhatsAppShare();
        setAutoRedirected(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBill = () => {
    // Create a printable version of the bill
    const printWindow = window.open('', '_blank');
    const billContent = generatePrintableBill();
    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
  };

  const generatePrintableBill = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Bill - ${order.orderId}</title>
        <style>
          body { font-family: monospace; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SAURABH PROVISION</h1>
          <p>Malegaon, Maharashtra | 9766689821</p>
          <p>================================</p>
        </div>
        
        <div class="section">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Date:</strong> ${order.formattedDate || new Date().toLocaleDateString('en-IN')}</p>
          <p><strong>Time:</strong> ${order.formattedTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Customer:</strong> ${order.customerDetails.name}</p>
          <p><strong>Phone:</strong> ${order.customerDetails.phone}</p>
          <p><strong>Pickup Time:</strong> ${order.pickupTime}</p>
        </div>
        
        <div class="section">
          <p><strong>ITEMS:</strong></p>
          <p>--------------------------------</p>
          ${order.items.map(item => `
            <div class="item">
              <span>${item.name} x${item.quantity}</span>
              <span>₹${item.total.toFixed(2)}</span>
            </div>
          `).join('')}
          <p>--------------------------------</p>
        </div>
        
        <div class="section total">
          <div class="item">
            <span><strong>TOTAL AMOUNT:</strong></span>
            <span>₹${order.totalAmount.toFixed(2)}</span>
          </div>
          <div class="item">
            <span><strong>PAYMENT:</strong></span>
            <span>${order.paymentMethod.toUpperCase()}</span>
          </div>
          <div class="item">
            <span><strong>STATUS:</strong></span>
            <span>${order.status.toUpperCase()}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for your order!</p>
          <p>Your order will be ready before you arrive.</p>
          <p>Serving Malegaon | Open 7 AM - 11 PM</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Order Header */}
          <div className="bg-green-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-1">Saurabh Provision</h2>
                <div className="flex items-center gap-4 text-green-100 text-sm">
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
              <div className="text-right">
                <p className="text-sm text-green-100">Order ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold">{order.orderId}</p>
                  <button
                    onClick={handleCopyOrderId}
                    className="p-1 hover:bg-green-500 rounded transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Customer</p>
                <p className="font-medium">{order.customerDetails.name}</p>
                <p className="text-sm text-gray-600">{order.customerDetails.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pickup Time</p>
                <p className="font-medium">{order.pickupTime}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                        {item.discount > 0 && (
                          <span className="text-green-600 ml-2">
                            ({item.discount}% off)
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ₹{item.total.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Order Status</span>
                <span className="font-medium capitalize text-green-600">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share on WhatsApp
            </button>
            <button
              onClick={handleDownloadBill}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Bill
            </button>
          </div>
          
          <Link
            href="/orders"
            className="block w-full bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-lg font-semibold transition-colors text-center"
          >
            View My Orders
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Trust Message */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">
              Your order will be ready before you arrive
            </p>
          </div>
          <p className="text-xs text-green-600 mt-1 text-center">
            Serving Malegaon | Open 7 AM - 11 PM
          </p>
        </div>
      </div>
    </div>
  );
}
