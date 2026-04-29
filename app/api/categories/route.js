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
      { _id: 'cat1', name: 'Vegetables', icon: '🥦' },
      { _id: 'cat2', name: 'Fruits', icon: '🍎' },
      { _id: 'cat3', name: 'Dairy', icon: '🥛' },
      { _id: 'cat4', name: 'Bakery', icon: '🍞' },
      { _id: 'cat5', name: 'Stationery', icon: '✏️' },
      { _id: 'cat6', name: 'Household', icon: '🧹' },
      { _id: 'cat7', name: 'Snacks', icon: '🥨' }
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
