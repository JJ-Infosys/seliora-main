export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Product from '@/lib/models/Product';

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const ensureUniqueSlug = async (base: string, currentId: string) => {
  const normalized = base || `product-${Date.now()}`;
  let slug = normalized;
  let counter = 1;

  while (await Product.exists({ slug, _id: { $ne: currentId } })) {
    slug = `${normalized}-${counter}`;
    counter += 1;
  }

  return slug;
};

const toSku = (value: string) =>
  value
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const ensureUniqueSku = async (base: string, currentId: string) => {
  const fallback = `SKU-${Date.now()}`;
  const normalized = base || fallback;
  let sku = normalized;
  let counter = 1;

  while (await Product.exists({ sku, _id: { $ne: currentId } })) {
    sku = `${normalized}-${counter}`;
    counter += 1;
  }

  return sku;
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await adminMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  await connectToDatabase();

  const body = await req.json();

  if (body.name || body.slug) {
    const baseSlug = toSlug(body.slug || body.name || '');
    body.slug = await ensureUniqueSlug(baseSlug, params.id);
  }

  if (body.name || body.sku) {
    const baseSku = toSku(body.sku || body.name || '');
    body.sku = await ensureUniqueSku(baseSku, params.id);
  }

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
