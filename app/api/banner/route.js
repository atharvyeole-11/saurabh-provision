import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    await connectToDatabase();
    const banner = await Banner.findOne({ isActive: true });
    
    return successResponse(banner ? banner.toObject() : {});
  } catch (error) {
    console.error('GET banner error:', error);
    
    // Fallback dummy data
    const dummyBanner = {
      _id: 'top-banner-1',
      title: 'Grand Summer Sale!',
      subtitle: 'Stay cool with up to 40% off on all items',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80',
      buttonLink: '/products',
      buttonText: 'Explore Now',
      type: 'festival',
      festival: 'Summer Sale',
      isActive: true
    };
    
    return successResponse(dummyBanner);
  }
}
