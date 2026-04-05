import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { setAuthCookie } from '@/lib/auth';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const { name, email, phone, address, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const result = await db.collection('users').insertOne({
      name,
      email,
      phone,
      address,
      password,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const token = generateToken(result.insertedId.toString());
    setAuthCookie(token);

    return NextResponse.json({
      user: {
        _id: result.insertedId,
        name,
        email,
        phone,
        address,
        role: 'user'
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
