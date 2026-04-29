import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

function getDummyProducts() {
  return [
    {
      _id: 'dummy1',
      name: 'Fresh Organic Tomatoes',
      price: 45,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80',
      category: 'Vegetables',
      description: 'Fresh organic tomatoes from local farms.',
      inStock: true,
      stockQuantity: 50
    },
    {
      _id: 'dummy2',
      name: 'Whole Wheat Bread',
      price: 35,
      discount: 0,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80',
      category: 'Bakery',
      description: 'Freshly baked whole wheat bread.',
      inStock: true,
      stockQuantity: 20
    },
    {
      _id: 'dummy3',
      name: 'Farm Fresh Eggs (1 Dozen)',
      price: 80,
      discount: 5,
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80',
      category: 'Dairy',
      description: 'Free range brown eggs.',
      inStock: true,
      stockQuantity: 100
    },
    {
      _id: 'dummy4',
      name: 'Premium Basmati Rice',
      price: 150,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80',
      category: 'Grains',
      description: 'Long grain premium basmati rice.',
      inStock: true,
      stockQuantity: 10
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
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return errorResponse('Unauthorized: Admin access required', 403);
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
