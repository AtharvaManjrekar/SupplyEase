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

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { clerkId: body.clerkId },
        { email: body.email }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const newUser = new User(body);
    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 