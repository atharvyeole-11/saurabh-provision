'use client';
import { useState, useEffect } from 'react';
import { QrCode, Smartphone, CheckCircle2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentQR({ amount, orderId, merchantUpi = "vilas@upi" }) {
  const [upiUrl, setUpiUrl] = useState('');
  
  useEffect(() => {
    // Standard UPI intent URL
    const url = `upi://pay?pa=${merchantUpi}&pn=Saurabh%20Provision&tr=${orderId}&am=${amount}&cu=INR&tn=Order%20${orderId}`;
    setUpiUrl(url);
  }, [amount, orderId, merchantUpi]);

  const copyUpi = () => {
    navigator.clipboard.writeText(merchantUpi);
    toast.success("UPI ID Copied!");
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-green-100 p-8 shadow-xl max-w-md mx-auto text-center animate-in zoom-in duration-300">
      <div className="flex items-center justify-center gap-2 mb-6 text-green-600 font-black uppercase tracking-widest text-xs">
        <Smartphone className="w-4 h-4" />
        Scan & Pay
      </div>
      
      <h2 className="text-3xl font-black text-gray-900 mb-2">₹{amount}</h2>
      <p className="text-gray-500 font-medium mb-8">Pay securely using any UPI app</p>

      {/* QR Code Placeholder (Using a generated image service for simplicity) */}
      <div className="relative inline-block p-4 bg-gray-50 rounded-3xl border-4 border-white shadow-inner mb-8">
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`}
          alt="Payment QR"
          className="w-48 h-48 rounded-xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100">
          <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center text-[10px] text-white font-black">SP</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100 group">
          <div className="text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Merchant UPI ID</p>
            <p className="font-bold text-gray-900">{merchantUpi}</p>
          </div>
          <button onClick={copyUpi} className="p-2 hover:bg-white rounded-xl transition shadow-sm">
            <Copy className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 opacity-50 grayscale">
          {['PhonePe', 'GPay', 'Paytm', 'AmazonPay'].map(app => (
            <div key={app} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <span className="text-[8px] font-bold uppercase">{app}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-2 text-green-600 font-bold text-sm">
        <CheckCircle2 className="w-4 h-4" />
        Safe & Secure Payment
      </div>
    </div>
  );
}
