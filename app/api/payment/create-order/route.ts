import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Order from '@/lib/models/Order';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';
import { authMiddleware } from '@/lib/auth';
import razorpay from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const auth = await authMiddleware(req);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    const decoded = auth as any;
    const { address } = await req.json();

    if (!address || !address.street || !address.city || !address.state || !address.zipCode) {
      return NextResponse.json(
        { error: 'Complete address is required' },
        { status: 400 }
      );
    }

    // Get cart
    const cart = await Cart.findOne({ user: decoded.userId })
      .populate('items.product', 'name price images stock');

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Check stock and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Only ${product.stock} units of ${product.name} available` },
          { status: 400 }
        );
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '/placeholder-jewelry.jpg',
        quantity: item.quantity,
        price: product.price
      });

      totalAmount += product.price * item.quantity;
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // in paise
      currency: 'INR',
      receipt: `ORD_${Date.now()}`,
      notes: {
        userId: decoded.userId.toString()
      }
    });

    // Create order in database
    const order = await Order.create({
      user: decoded.userId,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        ...address,
        email: address.email,
        phone: address.phone
      },
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: decoded.userId },
      { items: [], totalItems: 0, totalPrice: 0 }
    );

    return NextResponse.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: totalAmount,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}