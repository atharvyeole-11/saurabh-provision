import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.warn('DB connection failed in GET /api/admin/banner, returning dummy data');
      const isAdmin = await requireAdmin();
      if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      
      // Return dummy banner list
      return NextResponse.json({ 
        banners: [
          {
            _id: 'demo-banner-1',
            title: '🪔 Navratri Special Offers!',
            subtitle: 'Fasting items available – Order now, pick up at your time!',
            festival: 'Navratri',
            bgColor: '#ea580c',
            isActive: true,
            products: [],
            buttonText: 'Order Now',
            buttonLink: '/products?category=fasting'
          }
        ],
        demoMode: true 
      });
    }

    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const banners = await Banner.find({}).sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    try {
      await connectToDatabase();
    } catch (dbError) {
      console.warn('DB connection failed in POST /api/admin/banner, returning mock success');
      const isAdmin = await requireAdmin();
      if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      return NextResponse.json({ 
        message: 'Running in Demo Mode. Your changes will not be saved permanently.',
        banner: { ...body, _id: `demo-${Date.now()}` },
        demoMode: true
      }, { status: 201 });
    }

    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If setting isActive: true, deactivate all others first
    if (body.isActive) {
      await Banner.updateMany({}, { isActive: false });
    }

    const banner = new Banner(body);
    await banner.save();
    
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
