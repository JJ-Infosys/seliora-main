'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Replace any of these URLs with your own images when ready
const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&h=700&fit=crop',
    label: 'Pearl Collection',
  },
  {
    src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&h=700&fit=crop',
    label: 'Diamond Rings',
  },
  {
    src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&h=700&fit=crop',
    label: 'Gold Necklaces',
  },
  {
    src: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=900&h=700&fit=crop',
    label: 'Earring Collection',
  },
  {
    src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&h=700&fit=crop',
    label: 'Bracelets',
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = useCallback(() =>
    setCurrentSlide(s => (s - 1 + HERO_IMAGES.length) % HERO_IMAGES.length), []);
  const nextSlide = useCallback(() =>
    setCurrentSlide(s => (s + 1) % HERO_IMAGES.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 3500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=8&sort=-createdAt');
      const data = await response.json();
      setFeaturedProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Online placeholder images use karo
  const categories = [
    {
      name: 'Necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
      count: '120+'
    },
    {
      name: 'Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      count: '85+'
    },
    {
      name: 'Earrings',
      image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400&h=400&fit=crop',
      count: '95+'
    },
    {
      name: 'Bracelets',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      count: '60+'
    }
  ];

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    if (emailInput && emailInput.value) {
      alert(`Thank you for subscribing with ${emailInput.value}!`);
      form.reset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-amber-100/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight">
                Discover the <br />
                <span className="text-amber-600">Elegance</span> in Every Piece
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Explore our curated collection of handcrafted jewelry that tells a story of timeless beauty and sophistication.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products"
                  className="inline-flex items-center px-8 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors text-lg font-semibold">
                  Shop Now
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
                <Link href="/products"
                  className="inline-flex items-center px-8 py-3 border-2 border-amber-600 text-amber-600 rounded-full hover:bg-amber-50 transition-colors text-lg font-semibold">
                  View Collection
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-8">
                {[['10K+', 'Happy Customers'], ['5K+', 'Products Sold'], ['4.8★', 'Average Rating']].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-gray-800">{num}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — image slider in a box */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] lg:h-[600px]"
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                {HERO_IMAGES.map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    alt={img.label}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                    style={{ opacity: i === currentSlide ? 1 : 0 }}
                  />
                ))}

                {/* Arrows */}
                <button onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/60 text-white rounded-full p-2 transition-colors z-10">
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/60 text-white rounded-full p-2 transition-colors z-10">
                  <ChevronRightIcon className="h-5 w-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {HERO_IMAGES.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === currentSlide ? 'bg-amber-400 w-7 h-2' : 'bg-white/60 w-2 h-2 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Badge */}
              <div className="absolute -bottom-5 -right-4 bg-white rounded-xl shadow-xl p-4 z-10">
                <p className="text-sm text-gray-500">New Arrival</p>
                <p className="font-semibold text-gray-800">{HERO_IMAGES[currentSlide].label}</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Shop by Category</h2>
            <p className="mt-2 text-gray-600">Find the perfect piece for every occasion</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group cursor-pointer"
              >
                <Link href={`/products?category=${category.name}`}>
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{category.name}</h3>
                      <p className="text-sm text-white/80">{category.count} Products</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Featured Products</h2>
              <p className="mt-2 text-gray-600">Discover our most loved jewelry pieces</p>
            </div>
            <Link href="/products" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center">
              View All
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md h-80 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-amber-100 mb-8">Get 10% off your first order and stay updated with our latest collections</p>
          <form
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800 bg-white/90"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}