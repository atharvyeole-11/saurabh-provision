import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    await connectToDatabase();
    const banner = await Banner.findOne({ isActive: true });
    
    // In our api-response wrapper, we just send the raw JSON data that the frontend expects
    // Frontend expects: bannerRes.json() directly. 
    // Wait, the frontend code in app/page.jsx is: 
    // const bannerData = await bannerRes.json(); setBanner(bannerData);
    // So if we use successResponse({ banner }), bannerData would be { success: true, banner: {...} }.
    // BUT frontend does setBanner(bannerData) and then checks {banner?.isActive} which would mean {banner.success.isActive} - no!
    // If it does setBanner(bannerData), it expects the top-level object to be the banner itself!
    // So if we return successResponse(banner), since it's an object, it gets spread.
    // Let's return successResponse(banner)
    
    return successResponse(banner ? banner.toObject() : {});
  } catch (error) {
    console.error('GET banner error:', error);
    
    // Fallback dummy data
    const dummyBanner = {
      _id: 'top-banner-1',
      title: 'Grand Navratri Sale!',
      subtitle: 'Up to 50% off on all festive items',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80',
      buttonLink: '/products?category=Festive',
      buttonText: 'Shop Now',
      type: 'festival',
      festival: 'Navratri',
      isActive: true
    };
    
    return successResponse(dummyBanner);
  }
}
