import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const banner = await Banner.findOne({ isActive: true });
    return NextResponse.json(banner || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
