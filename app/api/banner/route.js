import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    const db = await connectToDatabase();
    
    // Return only ONE active banner
    const banner = await Banner.findOne({ isActive: true }).sort({ displayOrder: 1 });
    
    if (!banner) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}
