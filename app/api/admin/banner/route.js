import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { getUserFromToken } from '@/lib/auth';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const user = await getUserFromToken();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const banners = await Banner.find({}).sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
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
    
    // If setting isActive: true, deactivate all others first
    if (body.isActive) {
      await Banner.updateMany({}, { isActive: false });
    }

    const banner = new Banner(body);
    await banner.save();
    
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}
