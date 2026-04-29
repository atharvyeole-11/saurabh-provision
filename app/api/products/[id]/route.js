import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    const product = await Product.findById(id).populate('category');
    if (!product) {
      return errorResponse('Product not found', 404);
    }
    
    return successResponse(product);
  } catch (error) {
    console.error('GET product error:', error);
    return errorResponse('Internal server error', 500, error.message);
  }
}

export async function PUT(req, { params }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return errorResponse('Unauthorized', 403);
    }

    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    
    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!product) {
      return errorResponse('Product not found', 404);
    }

    return successResponse(product);
  } catch (error) {
    console.error('PUT product error:', error);
    return errorResponse('Failed to update product', 500, error.message);
  }
}

export async function DELETE(req, { params }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return errorResponse('Unauthorized', 403);
    }

    const { id } = await params;
    await connectToDatabase();
    
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      return errorResponse('Product not found', 404);
    }

    return successResponse({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE product error:', error);
    return errorResponse('Failed to delete product', 500, error.message);
  }
}
