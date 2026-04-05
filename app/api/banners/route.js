import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const { db } = await connectToDatabase();
    
    let query = { isActive: true };
    
    if (type) {
      query.type = type;
    }

    const banners = await db.collection('banners')
      .find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Get banners error:', error);
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

    const { title, subtitle, image, link, displayOrder, type, startDate, endDate } = await request.json();

    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('banners').insertOne({
      title,
      subtitle,
      image,
      link,
      displayOrder: displayOrder || 0,
      type: type || 'hero',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { 
        message: 'Banner created successfully',
        banner: {
          id: result.insertedId.toString(),
          title,
          type: type || 'hero'
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create banner error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
