import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { getUserFromToken } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const db = await connectToDatabase();
    const user = await getUserFromToken();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = params;
    
    // If setting isActive: true, deactivate all others first
    if (body.isActive) {
      await Banner.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const banner = await Banner.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const db = await connectToDatabase();
    const user = await getUserFromToken();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = params;
    
    // If toggling isActive, deactivate all others when activating one
    if (body.isActive === true) {
      await Banner.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const banner = await Banner.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Error toggling banner:', error);
    return NextResponse.json(
      { error: 'Failed to toggle banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await connectToDatabase();
    const user = await getUserFromToken();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
