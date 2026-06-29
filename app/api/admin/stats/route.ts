export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';

export async function GET(req: NextRequest) {
  const auth = await adminMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  await connectToDatabase();

  const [totalOrders, totalProducts, totalUsers, revenueResult, ordersByStatus, recentOrders] =
    await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
        .lean(),
    ]);

  return NextResponse.json({
    stats: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: revenueResult[0]?.total || 0,
      ordersByStatus,
    },
    recentOrders,
  });
}
