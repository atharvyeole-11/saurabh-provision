import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import { getUserFromToken } from '@/lib/auth';

export async function GET() {
  try {
    const db = await connectToDatabase();
    
    const categories = await db.collection('categories')
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
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

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const existingCategory = await db.collection('categories').findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    const result = await db.collection('categories').insertOne({
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      category: {
        _id: result.insertedId,
        name
      }
    }, { status: 201 });
    );
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
