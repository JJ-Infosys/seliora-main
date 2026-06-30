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

const ensureUniqueSlug = async (base: string) => {
  const normalized = base || `product-${Date.now()}`;
  let slug = normalized;
  let counter = 1;

  while (await Product.exists({ slug })) {
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

const ensureUniqueSku = async (base: string) => {
  const fallback = `SKU-${Date.now()}`;
  const normalized = base || fallback;
  let sku = normalized;
  let counter = 1;

  while (await Product.exists({ sku })) {
    sku = `${normalized}-${counter}`;
    counter += 1;
  }

  return sku;
};

export async function GET(req: NextRequest) {
  const auth = await adminMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';

  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const auth = await adminMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const body = await req.json();
    const { name, description, price, category, subcategory, images, metalType, gemstone, weight, dimensions, stock, sku } = body;

    if (!name || !description || !price || !category || stock === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = await ensureUniqueSlug(toSlug(name));
    const uniqueSku = await ensureUniqueSku(toSku(sku || name));

    const product = await Product.create({
      name,
      slug,
      sku: uniqueSku,
      description,
      price: Number(price),
      category,
      subcategory,
      images: images?.length ? images : [],
      metalType,
      gemstone,
      weight: weight ? Number(weight) : undefined,
      dimensions,
      stock: Number(stock),
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    console.error('Create product error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}
