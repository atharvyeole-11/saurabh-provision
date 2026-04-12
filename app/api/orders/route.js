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
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const {
      customerId,
      items,
      totalAmount,
      pickupTime,
      paymentMethod,
      paymentId,
      customerDetails
    } = body;
    
    // Validate required fields
    if (!customerId || !items || !totalAmount || !pickupTime || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate unique Order ID
    const generateOrderId = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `ORD${timestamp}${random}`;
    };
    
    const orderId = generateOrderId();
    
    // Create order
    const order = await Order.create({
      orderId,
      customerId,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount || 0,
        subtotal: item.price * item.quantity,
        total: (item.price * item.quantity) - ((item.discount || 0) * item.price * item.quantity / 100)
      })),
      totalAmount,
      pickupTime,
      paymentMethod,
      paymentId: paymentId || null,
      status: 'pending',
      customerDetails: {
        name: customerDetails?.name || 'Guest',
        phone: customerDetails?.phone || '',
        email: customerDetails?.email || ''
      }
    });
    
    // Populate customer details
    await order.populate('customerId', 'name phone email');
    
    return NextResponse.json({
      success: true,
      order,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
