import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getUserFromToken, requireAdmin, requireManagerOrAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const db = await connectToDatabase();
    const user = await getUserFromToken();
    const isAdminOrManager = await requireManagerOrAdmin();
    
    if (!user && !isAdminOrManager) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    let query = { _id: id };
    if (!isAdminOrManager) {
      query.customerId = user.userId;
    }

    const order = await Order.findOne(query)
      .populate('items.productId');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const db = await connectToDatabase();
    const isAdminOrManager = await requireManagerOrAdmin();
    
    if (!isAdminOrManager) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const updateData = await request.json();

    const order = await Order.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await connectToDatabase();
    const isAdmin = await requireAdmin();
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const order = await Order.findOneAndDelete({ _id: id });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
