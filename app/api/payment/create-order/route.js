import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { amount } = await req.json();
    return NextResponse.json({ 
      error: 'Online payment coming soon. Use Cash on Pickup.',
      amount 
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}