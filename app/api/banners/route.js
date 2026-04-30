import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    await connectToDatabase();
    
    let query = { isActive: true };
    if (type) {
      query.type = type;
    }

    const banners = await Banner.find(query)
      .sort({ displayOrder: 1, createdAt: -1 });

    return successResponse({ banners });
  } catch (error) {
    console.error('Get banners error:', error);
    
    // Fallback dummy data
    const dummyBanners = [
      {
        _id: 'banner1',
        title: '🪔 Navratri Special Offers!',
        subtitle: 'Fasting items available – Order now, pick up at your time!',
        image: 'https://images.unsplash.com/photo-1604823191457-2f2e4a0c7f67?auto=format&fit=crop&q=80',
        link: '/products?category=Fasting Items',
        type: 'hero'
      },
      {
        _id: 'banner2',
        title: 'Stationery Essentials',
        subtitle: 'Notebooks, pens, and school supplies at great prices',
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80',
        link: '/products?category=Stationery',
        type: 'hero'
      }
    ];

    return successResponse({ banners: dummyBanners });
  }
}

export async function POST(request) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return errorResponse('Unauthorized', 403);
    }

    const body = await request.json();

    if (!body.title || !body.image) {
      return errorResponse('Title and image are required', 400);
    }

    await connectToDatabase();
    
    const bannerData = {
      ...body,
      displayOrder: body.displayOrder || 0,
      type: body.type || 'hero',
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      isActive: true
    };

    const banner = await Banner.create(bannerData);

    return successResponse(
      { 
        message: 'Banner created successfully',
        banner
      },
      null,
      201
    );
  } catch (error) {
    console.error('Create banner error:', error);
    return errorResponse('Internal server error', 500, error.message);
  }
}
