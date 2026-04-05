import { NextResponse } from 'next/server';
export async function POST(req) {
  try {
    const { amount } = await req.json();
    if (!process.env.RAZORPAY_KEY_ID) {
      return NextResponse.json({ 
        error: 'Razorpay not configured. Use Cash on Pickup.' 
      }, { status: 400 });
    }
    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: 'SP' + Date.now()
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
