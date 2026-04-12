'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import BillPreview from './BillPreview';
import { CreditCard, Smartphone, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export default function PaymentSystem({ cart, selectedPickupTime, onOrderComplete }) {
  const { user } = useAuth();
  const { clearCart, getCartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBill, setShowBill] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = getCartTotal();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      setError('Payment system is loading. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create Razorpay order
      const response = await fetch('/api/payment/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const { success, order, key_id } = await response.json();

      if (!success) {
        throw new Error('Failed to create payment order');
      }

      // Open Razorpay checkout
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Saurabh Provision',
        description: 'Order Payment',
        order_id: order.id,
        handler: async (response) => {
          await handlePaymentSuccess(response.razorpay_payment_id);
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#22c55e',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentId) => {
    try {
      // Verify payment
      const response = await fetch('/api/payment/razorpay', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: paymentId,
          paymentId: paymentId,
        }),
      });

      const { success } = await response.json();

      if (success) {
        await placeOrder('online', paymentId);
      } else {
        setError('Payment verification failed. Please contact support.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Payment verification failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const placeOrder = async (method, paymentId = null) => {
    try {
      const orderData = {
        customerId: user?.id,
        items: cart,
        totalAmount,
        pickupTime: selectedPickupTime,
        paymentMethod: method,
        paymentId,
        customerDetails: {
          name: user?.name || 'Guest',
          phone: user?.phone || '',
          email: user?.email || ''
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const { success, order } = await response.json();

      if (success) {
        clearCart();
        onOrderComplete(order);
      } else {
        setError('Failed to place order. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      setError('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCashPayment = () => {
    setIsProcessing(true);
    setError('');
    placeOrder('cash');
  };

  const handleUPIPayment = () => {
    // UPI payment via Razorpay
    handleRazorpayPayment();
  };

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash on Pickup',
      description: 'Pay when you collect your order',
      icon: DollarSign,
      color: 'green',
      action: handleCashPayment,
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'Pay via UPI (GPay, PhonePe, etc.)',
      icon: Smartphone,
      color: 'blue',
      action: handleUPIPayment,
    },
    {
      id: 'card',
      name: 'Card Payment',
      description: 'Pay via Credit/Debit Card',
      icon: CreditCard,
      color: 'purple',
      action: handleRazorpayPayment,
    },
  ];

  if (showBill) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <BillPreview
            cart={cart}
            selectedPickupTime={selectedPickupTime}
            onProceedToPayment={() => setShowBill(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Payment Method</h1>
          <p className="text-gray-600">Select how you'd like to pay for your order</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items ({cart.length})</span>
              <span className="font-medium">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pickup Time</span>
              <span className="font-medium">{selectedPickupTime}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={method.action}
                disabled={isProcessing}
                className={`w-full bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${
                  paymentMethod === method.id ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${method.color}-100 rounded-full flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${method.color}-600`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    {paymentMethod === method.id && (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-green-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
              <span>Processing...</span>
            </div>
          </div>
        )}

        {/* Trust Message */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">
              Your order will be ready before you arrive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
