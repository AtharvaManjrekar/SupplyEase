import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET user by Clerk ID
export async function GET(request, { params }) {
  try {
    const { clerkId } = await params;
    await connectDB();
    
    const user = await User.findOne({ clerkId }).select('-__v');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT update user by Clerk ID
export async function PUT(request, { params }) {
  try {
    const { clerkId } = await params;
    const body = await request.json();
    await connectDB();
    
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user by Clerk ID
export async function DELETE(request, { params }) {
  try {
    const { clerkId } = await params;
    await connectDB();
    
    const deletedUser = await User.findOneAndDelete({ clerkId });
    
    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 