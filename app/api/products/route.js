import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const user = await getUserFromToken();

    let query = {};
    let sort = { createdAt: -1 };

    // Handle search
    if (searchParams.get('search')) {
      query.name = { $regex: searchParams.get('search'), $options: 'i' };
    }

    // Handle category filter
    if (searchParams.get('category')) {
      query.category = searchParams.get('category');
    }

    // Handle featured filter
    if (searchParams.get('featured') === 'true') {
      query.featured = true;
    }

    // Handle limit
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 50;

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .populate('category');

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const db = await connectToDatabase();
    const user = await getUserFromToken();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const product = new Product(body);
    await product.save();

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
