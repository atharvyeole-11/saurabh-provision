import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');

    const { db } = await connectToDatabase();
    
    let query = { user: user.userId };
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await db.collection('orders')
      .find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('orders').countDocuments(query);

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
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items, deliveryAddress, paymentMethod, notes, deliveryTime } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await db.collection('products').findOne({ 
        _id: item.productId, 
        isActive: true 
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
      });
    }

    const result = await db.collection('orders').insertOne({
      user: user.userId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'pending',
      deliveryTime,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (const item of items) {
      await db.collection('products').updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    return NextResponse.json(
      { 
        message: 'Order placed successfully',
        order: {
          id: result.insertedId.toString(),
          totalAmount,
          status: 'pending'
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
