import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    
    const categories = await db.collection('categories')
      .find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .toArray();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
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

    const { name, description, image, displayOrder } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const existingCategory = await db.collection('categories').findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists with this name' },
        { status: 409 }
      );
    }

    const result = await db.collection('categories').insertOne({
      name,
      description,
      image,
      displayOrder: displayOrder || 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { 
        message: 'Category created successfully',
        category: {
          id: result.insertedId.toString(),
          name,
          displayOrder: displayOrder || 0
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
