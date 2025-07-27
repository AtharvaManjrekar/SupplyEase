import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET user by Clerk ID
export async function GET(request, { params }) {
  try {
    const { clerkId } = params;
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Clerk ID is required' },
        { status: 400 }
      );
    }

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
    if (error.name === 'MongoServerError') {
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT update user by Clerk ID
export async function PUT(request, { params }) {
  try {
    const { clerkId } = params;
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Clerk ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    await connectDB();
    
    // Prevent updating critical fields
    const { clerkId: _, email: __, ...updateData } = body;
    
    // Validate role if it's being updated
    if (updateData.role && !['vendor', 'distributor'].includes(updateData.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either "vendor" or "distributor"' },
        { status: 400 }
      );
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { ...updateData, updatedAt: Date.now() },
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
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `Duplicate ${field} found` },
        { status: 409 }
      );
    }

    if (error.name === 'MongoServerError') {
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user by Clerk ID
export async function DELETE(request, { params }) {
  try {
    const { clerkId } = params;
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Clerk ID is required' },
        { status: 400 }
      );
    }

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
    
    if (error.name === 'MongoServerError') {
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}