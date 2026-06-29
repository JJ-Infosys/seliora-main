import mongoose, { Mongoose } from 'mongoose';
import bcrypt from 'bcryptjs';

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function seedAdmin() {
  try {
    const User = (await import('./models/User')).default;
    const hashed = await bcrypt.hash('02230223', 10);
    const result = await User.findOneAndUpdate(
      { email: 'admin@gmail.com' },
      { $set: { name: 'Admin', email: 'admin@gmail.com', password: hashed, role: 'admin' } },
      { upsert: true, new: true }
    );
    console.log('✅ Admin ready — email: admin@gmail.com  password: 02230223');
  } catch (err) {
    console.error('Admin seed failed:', err);
  }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      console.log('Connected to MongoDB');
      await seedAdmin();
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}