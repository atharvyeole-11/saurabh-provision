import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Next.js 15+: cookies() is async and must be awaited
export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export async function requireAdmin() {
  const decoded = await getUserFromToken();
  if (!decoded || !decoded.userId) return false;

  try {
    const { connectToDatabase } = await import('./mongodb');
    await connectToDatabase();

    const mongoose = (await import('mongoose')).default;
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ role: String }, { strict: false }));

    const user = await User.findById(decoded.userId).select('role');
    return user && user.role === 'admin';
  } catch (error) {
    console.error('requireAdmin error:', error);
    return false;
  }
}

export async function requireManagerOrAdmin() {
  const decoded = await getUserFromToken();
  if (!decoded || !decoded.userId) return false;

  try {
    const { connectToDatabase } = await import('./mongodb');
    await connectToDatabase();

    const mongoose = (await import('mongoose')).default;
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ role: String }, { strict: false }));

    const user = await User.findById(decoded.userId).select('role');
    return user && (user.role === 'admin' || user.role === 'manager');
  } catch (error) {
    console.error('requireManagerOrAdmin error:', error);
    return false;
  }
}

