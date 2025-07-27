import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// POST /api/products - create product
export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    // Convert image array to Buffer if present
    if (body.image && Array.isArray(body.image)) {
      body.image = Buffer.from(body.image);
    } else {
      delete body.image;
    }
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// GET /api/products?seller=... - list products by seller
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const seller = searchParams.get('seller');
    await connectDB();
    let query = {};
    if (seller) query.seller = seller;
    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
} 