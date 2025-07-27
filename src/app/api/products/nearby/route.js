import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';

// GET /api/products/nearby?lat=...&lng=...&maxDistance=...
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));
    const maxDistance = parseInt(searchParams.get('maxDistance') || '5000', 10); // default 5km

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'lat and lng are required and must be numbers' }, { status: 400 });
    }

    await connectDB();

    const products = await Product.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          maxDistance,
          spherical: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'sellerInfo',
        },
      },
      { $unwind: '$sellerInfo' },
      { $sort: { distance: 1 } },
    ]);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching nearby products:', error);
    return NextResponse.json({ error: 'Failed to fetch nearby products' }, { status: 500 });
  }
} 