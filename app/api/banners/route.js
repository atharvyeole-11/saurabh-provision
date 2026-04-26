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
        title: 'Fresh Vegetables Daily',
        subtitle: 'Get 20% off on all organic vegetables',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80',
        link: '/products?category=Vegetables',
        type: 'hero'
      },
      {
        _id: 'banner2',
        title: 'Premium Dairy Products',
        subtitle: 'Fresh from the farm to your table',
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80',
        link: '/products?category=Dairy',
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
