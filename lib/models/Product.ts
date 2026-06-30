import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    index: true 
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  sku: {
    type: String,
    required: [true, 'Product SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
    index: true,
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: 0 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    index: true 
  },
  subcategory: String,
  images: [{
    type: String,
    default: ['/placeholder-jewelry.jpg']
  }],
  metalType: String,
  gemstone: String,
  weight: Number,
  dimensions: String,
  stock: { 
    type: Number, 
    required: true,
    default: 0,
    min: 0,
    index: true 
  },
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5 
  },
  numReviews: { 
    type: Number, 
    default: 0 
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

// Indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, price: -1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);