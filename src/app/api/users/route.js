import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select('-__v');
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    if (error.name === 'MongoServerError') {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();

    // Input validation
    const requiredFields = ['email', 'role'];
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { clerkId: body.clerkId },
        { email: body.email }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists', field: existingUser.clerkId === body.clerkId ? 'clerkId' : 'email' },
        { status: 409 }
      );
    }

    // Validate role
    if (!['vendor', 'distributor'].includes(body.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either "vendor" or "distributor"' },
        { status: 400 }
      );
    }

    const newUser = new User({
      ...body,
      role: body.role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    
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
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}