import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    const userData = await db.collection('users').findOne(
      { _id: user.userId },
      { projection: { password: 0 } }
    );

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
