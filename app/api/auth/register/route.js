import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { generateToken, setAuthCookie } from '@/lib/auth';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await db.collection('users').insertOne({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = generateToken(result.insertedId.toString());
    setAuthCookie(token);

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: result.insertedId.toString(),
          name,
          email,
          phone,
          role: 'user'
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
