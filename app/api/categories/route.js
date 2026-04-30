import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({});
    return successResponse({ categories });
  } catch (error) {
    console.error('GET categories error:', error);
    
    // Fallback dummy data
    const dummyCategories = [
      { _id: 'cat1', name: 'Grocery', icon: '🛒', slug: 'grocery' },
      { _id: 'cat2', name: 'Stationery', icon: '✏️', slug: 'stationary' },
      { _id: 'cat3', name: 'Fasting Items', icon: '🪔', slug: 'fasting' },
      { _id: 'cat4', name: 'Snacks', icon: '🍿', slug: 'snacks' },
      { _id: 'cat5', name: 'Daily Essentials', icon: '🧴', slug: 'daily' },
      { _id: 'cat6', name: 'Beverages', icon: '🥤', slug: 'beverages' }
    ];
    
    return successResponse({ categories: dummyCategories });
  }
}

export async function POST(req) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return errorResponse('Unauthorized', 403);
    }

    await connectToDatabase();
    const body = await req.json();
    
    if (!body.name) {
      return errorResponse('Category name is required', 400);
    }
    
    const category = await Category.create(body);
    return successResponse({ category }, null, 201);
  } catch (error) {
    console.error('POST categories error:', error);
    return errorResponse('Failed to create category', 500, error.message);
  }
}
