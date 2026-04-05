import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    const { db } = await connectToDatabase();
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const products = await db.collection('products')
      .find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('products').countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, description, price, category, images, stock, unit, tags } = await request.json();

    if (!name || !price || !category || !unit) {
      return NextResponse.json(
        { error: 'Name, price, category, and unit are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('products').insertOne({
      name,
      description,
      price,
      category,
      images: images || [],
      stock: stock || 0,
      unit,
      tags: tags || [],
      isActive: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { 
        message: 'Product created successfully',
        product: {
          id: result.insertedId.toString(),
          name,
          price,
          category,
          unit
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
