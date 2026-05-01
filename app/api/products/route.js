import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireManagerOrAdmin, requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    // Build query
    const query = {};
    if (searchParams.get('category')) query.category = searchParams.get('category');
    if (searchParams.get('search')) {
      query.name = { $regex: searchParams.get('search'), $options: 'i' };
    }
    if (searchParams.get('featured') === 'true') {
      query.featured = true;
    }
    // By default, only show in-stock products to customers unless admin requests all
    if (searchParams.get('all') !== 'true') {
      query.inStock = true;
    }

    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;

    // Sorting
    const sortParam = searchParams.get('sort');
    let sort = {};
    if (sortParam === 'price-low') sort.price = 1;
    else if (sortParam === 'price-high') sort.price = -1;
    else if (sortParam === 'newest') sort.createdAt = -1;
    else sort.name = 1; // Default: alphabetical

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return successResponse(
      { products },
      { page, pages: Math.ceil(total / limit), total }
    );
  } catch (error) {
    console.error('GET /api/products error:', error);
    return errorResponse('Failed to fetch products: ' + error.message, 500);
  }
}

export async function POST(req) {
  try {
    const isAuthorized = await requireManagerOrAdmin();
    if (!isAuthorized) {
      return errorResponse('Unauthorized: Admin or Manager access required', 403);
    }

    await connectToDatabase();
    const body = await req.json();

    if (!body.name || body.price === undefined) {
      return errorResponse('Name and price are required fields', 400);
    }

    const product = await Product.create(body);
    return successResponse({ product }, null, 201);
  } catch (error) {
    console.error('POST /api/products error:', error);
    return errorResponse('Failed to create product: ' + error.message, 500);
  }
}
