import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    let query = {};
    if (userId) query.customerId = userId;
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('customerId', 'name phone email');
    
    const total = await Order.countDocuments(query);
    
    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    // Demo fallback for orders
    return NextResponse.json({
      orders: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      message: 'No orders found (Demo Mode)'
    });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const {
      user, // Alternative to customerId
      customerId,
      items,
      totalAmount,
      subtotal,
      discountAmount,
      pickupTime,
      paymentMethod,
      paymentMode, // Alternative to paymentMethod
      paymentId,
      customerDetails
    } = body;
    
    const finalCustomerId = customerId || user;
    const finalPaymentMethod = paymentMethod || paymentMode || 'cash';
    
    // Validate required fields
    if (!finalCustomerId || !items || !totalAmount || !pickupTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate unique Order ID
    const generateOrderId = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 100);
      return `SP${timestamp}${random}`;
    };
    
    const orderId = generateOrderId();
    
    // Create order
    const order = await Order.create({
      orderId,
      customerId: finalCustomerId,
      items: items.map(item => ({
        productId: item.productId || item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity || item.qty,
        discount: item.discount || 0,
        subtotal: item.subtotal || (item.price * (item.quantity || item.qty)),
        total: item.total || ((item.price * (item.quantity || item.qty)) - ((item.discount || 0) * item.price * (item.quantity || item.qty) / 100))
      })),
      totalAmount,
      pickupTime,
      paymentMethod: finalPaymentMethod,
      paymentId: paymentId || null,
      status: 'pending',
      customerDetails: {
        name: customerDetails?.name || 'Customer',
        phone: customerDetails?.phone || '',
        email: customerDetails?.email || ''
      }
    });
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
