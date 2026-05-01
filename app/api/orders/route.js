import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getUserFromToken, requireManagerOrAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    const user = await getUserFromToken();
    const isAdminOrManager = await requireManagerOrAdmin();
    
    if (!user && !isAdminOrManager) {
      return errorResponse('Unauthorized', 401);
    }
    
    let query = {};
    if (!isAdminOrManager) {
      query.customerId = user.userId;
    } else if (requestedUserId) {
      query.customerId = requestedUserId;
    }
    
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('customerId', 'name phone email');
    
    const total = await Order.countDocuments(query);
    
    return successResponse({ orders }, {
      page, limit, total, pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return errorResponse('Failed to fetch orders: ' + error.message, 500);
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const {
      user,
      customerId,
      items,
      totalAmount,
      subtotal,
      discountAmount,
      pickupTime,
      paymentMethod,
      paymentMode,
      paymentId,
      customerDetails
    } = body;
    
    const finalCustomerId = customerId || user;
    const finalPaymentMethod = paymentMethod || paymentMode || 'cash';
    
    if (!finalCustomerId || !items || !totalAmount || !pickupTime) {
      return errorResponse('Missing required fields', 400);
    }
    
    const orderId = `SP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;
    
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
      paymentStatus: finalPaymentMethod === 'upi' ? 'pending' : (finalPaymentMethod === 'cash' ? 'pending' : 'pending'),
      status: 'pending',
      customerDetails: {
        name: customerDetails?.name || 'Customer',
        phone: customerDetails?.phone || '',
        email: customerDetails?.email || ''
      }
    });
    
    return successResponse({ order }, null, 201);
  } catch (error) {
    console.error('Error creating order:', error);
    return errorResponse('Failed to create order: ' + error.message, 500);
  }
}
