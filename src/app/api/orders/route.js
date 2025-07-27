import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

// POST /api/orders - place order
export async function POST(request) {
  try {
    const { productId, buyerId } = await request.json();
    if (!productId || !buyerId) return NextResponse.json({ error: 'Product ID and buyer ID required' }, { status: 400 });
    await connectDB();
    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    const order = await Order.create({
      product: product._id,
      buyer: buyerId,
      seller: product.seller,
    });
    // Emit Socket.io event for new order
    if (global._io) {
      global._io.emit('order:new', { order, seller: product.seller.toString() });
    }
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

// GET /api/orders?buyer=... - list orders by buyer
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyer = searchParams.get('buyer');
    const seller = searchParams.get('seller');
    await connectDB();
    let query = {};
    if (buyer) query.buyer = buyer;
    if (seller) query.seller = seller;
    const orders = await Order.find(query)
      .populate('product')
      .populate('seller', 'firstName lastName email')
      .populate('buyer', 'firstName lastName email');
    // Attach sellerInfo and buyerInfo for UI
    const ordersWithInfo = orders.map(order => ({
      ...order.toObject(),
      sellerInfo: order.seller,
      buyerInfo: order.buyer,
    }));
    return NextResponse.json(ordersWithInfo);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    await connectDB();
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
      .populate('product')
      .populate('seller', 'firstName lastName email')
      .populate('buyer', 'firstName lastName email');
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    // Emit Socket.io event for status update
    if (global._io) {
      global._io.emit('order:status', { order, seller: order.seller?._id?.toString(), buyer: order.buyer?._id?.toString() });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
} 