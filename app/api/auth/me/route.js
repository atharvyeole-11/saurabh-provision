import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    const decoded = await getUserFromToken();
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const userData = await User.findById(decoded.userId).select('-password');

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: userData._id.toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        addresses: userData.addresses || []
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    
    // Fallback: If DB is not connected or any other error, and we have a decoded token, return dummy user
    const decoded = await getUserFromToken().catch(() => null);
    if (decoded && decoded.userId === 'demo-user-id') {
      return NextResponse.json({
        user: {
          id: 'demo-user-id',
          name: 'Demo User',
          email: decoded.email || 'demo@example.com',
          role: 'admin',
          addresses: []
        }
      });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
