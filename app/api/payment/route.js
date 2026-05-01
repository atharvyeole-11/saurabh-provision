import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';

// Verify UPI payment status and update order
export async function POST(request) {
  try {
    const { orderId, paymentId, status } = await request.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update payment status
    order.paymentStatus = status || 'paid';
    if (paymentId) order.paymentId = paymentId;
    await order.save();

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount
      }
    });
  } catch (error) {
    console.error('Payment update error:', error);
    return NextResponse.json({ error: 'Payment update failed' }, { status: 500 });
  }
}

// Get payment info for an order
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    await connectToDatabase();
    const order = await Order.findOne({ orderId }, 'orderId totalAmount paymentMethod paymentStatus paymentId');
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const merchantUpi = process.env.MERCHANT_UPI || 'vilas@upi';
    const upiUrl = `upi://pay?pa=${merchantUpi}&pn=Saurabh%20Provision&tr=${order.orderId}&am=${order.totalAmount}&cu=INR`;

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus
      },
      upiUrl,
      merchantUpi
    });
  } catch (error) {
    console.error('Payment info error:', error);
    return NextResponse.json({ error: 'Failed to get payment info' }, { status: 500 });
  }
}
