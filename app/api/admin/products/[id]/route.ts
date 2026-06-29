export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Product from '@/lib/models/Product';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await adminMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  await connectToDatabase();

  const body = await req.json();
  const product = await Product.findByIdAndUpdate(
    params.id,
    { ...body, price: body.price ? Number(body.price) : undefined, stock: body.stock !== undefined ? Number(body.stock) : undefined },
    { new: true, runValidators: true }
  );

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await adminMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  await connectToDatabase();

  const product = await Product.findByIdAndDelete(params.id);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  return NextResponse.json({ message: 'Product deleted' });
}
