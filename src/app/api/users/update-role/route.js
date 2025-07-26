import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req) {
  try {
    await dbConnect();
    
    const { clerkId, role } = await req.json();
    
    if (!clerkId || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['vendor', 'distributor'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be vendor or distributor' }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Update role error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected server error occurred. Please try again.' }, { status: 500 });
  }
} 