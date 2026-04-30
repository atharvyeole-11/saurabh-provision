import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const isAdmin = await requireAdmin();
    
    if (!isAdmin) {
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
    const isAdmin = await requireAdmin();
    
    if (!isAdmin) {
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
