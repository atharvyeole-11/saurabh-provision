import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay with placeholders if env vars are missing to avoid build errors
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

export async function POST(request) {
  try {
    const { amount, currency = 'INR', receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { orderId, paymentId } = await request.json();

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { error: 'Missing order ID or payment ID' },
        { status: 400 }
      );
    }

    // Verify payment
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status !== 'captured') {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      payment,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
