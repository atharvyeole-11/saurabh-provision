'use client'
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function OrderBill({ order }) {
  const billRef = useRef();

  const printBill = () => {
    const content = billRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Order Bill - Saurabh Provision</title>
      <style>
        body { font-family: monospace; max-width: 400px; margin: 0 auto; padding: 20px; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .total { font-size: 18px; font-weight: bold; }
      </style></head>
      <body>${content}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPdf = async () => {
    if (!billRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(billRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Order_Bill_${order.orderId || order._id?.slice(-6)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!order) return null;

  const subtotal = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
  const discount = order.discountAmount || 0;
  const total = order.totalAmount || 0;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
      <div ref={billRef}>
        <div className="text-center mb-3">
          <h2 className="text-xl font-bold text-green-700">Saurabh Provision</h2>
          <p className="text-sm text-gray-500">Owner: Vilas Yeole</p>
          <p className="text-sm text-gray-500">📞 9766689821</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="border-t border-dashed border-gray-300 my-2" />

        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Order ID</span>
          <span className="font-mono font-bold">{order.orderId || order._id?.slice(-6).toUpperCase()}</span>
        </div>

        <div className="border-t border-dashed border-gray-300 my-2" />

        <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
          <span className="w-2/5">Item</span>
          <span className="w-1/5 text-center">Qty</span>
          <span className="w-1/5 text-center">Price</span>
          <span className="w-1/5 text-right">Total</span>
        </div>

        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-100">
            <span className="w-2/5 truncate">{item.name}</span>
            <span className="w-1/5 text-center">{item.quantity}</span>
            <span className="w-1/5 text-center">₹{item.price}</span>
            <span className="w-1/5 text-right">₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="border-t border-dashed border-gray-300 my-2" />

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-1">
            <span>TOTAL</span>
            <span className="text-green-700">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 my-2" />

        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Pickup Time</span>
            <span className="font-medium">{order.pickupTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-medium capitalize">{order.paymentMethod === 'cash' ? 'Cash on Pickup' : 'Online Paid'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="text-center mt-3 text-xs text-gray-400">
          Thank you for shopping at Saurabh Provision!
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={printBill}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition"
        >
          🖨️ Print
        </button>
        <button
          onClick={downloadPdf}
          disabled={isGenerating}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isGenerating ? '⏳ PDF...' : '📄 PDF'}
        </button>
      </div>
    </div>
  );
}
