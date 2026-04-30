import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin, requireManagerOrAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

function getDummyProducts() {
  return [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Tata Salt 1kg',
      price: 22,
      mrp: 25,
      discount: 12,
      image: 'https://images.unsplash.com/photo-1518110925495-5fe2c8dcffc2?auto=format&fit=crop&q=80',
      category: 'Grocery',
      description: 'Pure iodized salt for daily cooking.',
      inStock: true,
      stockQuantity: 50
    },
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'Aashirvaad Atta 5kg',
      price: 280,
      mrp: 310,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80',
      category: 'Grocery',
      description: 'Premium whole wheat flour.',
      inStock: true,
      stockQuantity: 30
    },
    {
      _id: '507f1f77bcf86cd799439013',
      name: 'Classmate Notebook 200pg',
      price: 45,
      mrp: 55,
      discount: 18,
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80',
      category: 'Stationery',
      description: 'Long notebook for school and office.',
      inStock: true,
      stockQuantity: 100
    },
    {
      _id: '507f1f77bcf86cd799439014',
      name: 'Reynolds Pen Pack (10)',
      price: 30,
      mrp: 35,
      discount: 14,
      image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80',
      category: 'Stationery',
      description: 'Ball point pens for everyday writing.',
      inStock: true,
      stockQuantity: 80
    }
  ];
}

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
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortParam = searchParams.get('sort');
    let sort = {};
    if (sortParam === 'price-low') sort.price = 1;
    else if (sortParam === 'price-high') sort.price = -1;
    else if (sortParam === 'newest') sort.createdAt = -1;
    else sort.name = 1; // Default sorting by name
    
    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query)
    ]);
    
    // If database is connected but empty, still show dummy products for demonstration
    if (products.length === 0 && !searchParams.get('category') && !searchParams.get('search')) {
      return successResponse({ products: getDummyProducts() }, { page: 1, pages: 1, total: 4 });
    }
    
    return successResponse(
      { products }, 
      { page, pages: Math.ceil(total / limit), total }
    );
  } catch (error) {
    console.error('GET /api/products error:', error);
    return successResponse({ products: getDummyProducts() }, { page: 1, pages: 1, total: 4 });
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
    
    if (!body.name || !body.price) {
      return errorResponse('Name and price are required fields', 400);
    }
    
    const product = await Product.create(body);
    return successResponse(product, null, 201);
  } catch (error) {
    console.error('POST /api/products error:', error);
    return errorResponse('Failed to create product', 500, error.message);
  }
}
