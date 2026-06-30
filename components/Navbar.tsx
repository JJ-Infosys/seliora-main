'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  PhoneIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Instantly show from sessionStorage on page load
    const cached = sessionStorage.getItem('user');
    if (cached) {
      try {
        const u = JSON.parse(cached);
        setIsLoggedIn(true);
        setUserName(u.name);
        setUserRole(u.role);
      } catch {}
    }

    // Listen for login event — updates navbar instantly without page reload
    const handleAuthChanged = (e: any) => {
      setIsLoggedIn(true);
      setUserName(e.detail.name);
      setUserRole(e.detail.role);
      updateCartCount();
    };

    checkAuth();
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('authChanged', handleAuthChanged);
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('authChanged', handleAuthChanged);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserName(data.user.name);
        setUserRole(data.user.role);
        sessionStorage.setItem('user', JSON.stringify({ name: data.user.name, role: data.user.role, email: data.user.email }));
      } else {
        sessionStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
      }
    } catch {}
  };

  const updateCartCount = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        const total = (data.items || []).reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  const isActive = (path: string) =>
    pathname === path ? 'text-amber-600 font-medium' : 'text-gray-700 hover:text-amber-600';

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl font-bold text-amber-600">Seloria</span>
            <span className="hidden sm:inline text-xs text-gray-500">✦ Jewelry</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`${isActive('/')} transition-colors text-sm`}>Home</Link>
            <Link href="/products" className={`${isActive('/products')} transition-colors text-sm`}>Shop</Link>
            <Link href="/about" className={`${isActive('/about')} transition-colors text-sm`}>About Us</Link>
            <Link href="/contact" className={`${isActive('/contact')} transition-colors text-sm`}>Contact Us</Link>
            <Link href="/terms" className={`${isActive('/terms')} transition-colors text-sm`}>Terms</Link>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Cart with live counter */}
            <Link href="/cart" className="relative p-2">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-amber-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:inline">{userName}</span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100"
                    >
                      {userRole === 'admin' && (
                        <Link href="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors font-medium"
                          onClick={() => setIsUserMenuOpen(false)}>
                          <Cog6ToothIcon className="h-5 w-5 mr-3 text-amber-600" />
                          Admin Panel
                        </Link>
                      )}
                      <Link href="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}>
                        <ClipboardDocumentListIcon className="h-5 w-5 mr-3 text-gray-500" />
                        My Orders
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <XMarkIcon className="h-5 w-5 mr-3" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth/login"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XMarkIcon className="h-6 w-6 text-gray-700" /> : <Bars3Icon className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <Link href="/" className="flex items-center py-2 text-gray-700 hover:text-amber-600" onClick={() => setIsMenuOpen(false)}>
                <HomeIcon className="h-5 w-5 mr-3" /> Home
              </Link>
              <Link href="/products" className="flex items-center py-2 text-gray-700 hover:text-amber-600" onClick={() => setIsMenuOpen(false)}>
                <TagIcon className="h-5 w-5 mr-3" /> Shop
              </Link>
              <Link href="/about" className="flex items-center py-2 text-gray-700 hover:text-amber-600" onClick={() => setIsMenuOpen(false)}>
                <InformationCircleIcon className="h-5 w-5 mr-3" /> About Us
              </Link>
              <Link href="/contact" className="flex items-center py-2 text-gray-700 hover:text-amber-600" onClick={() => setIsMenuOpen(false)}>
                <PhoneIcon className="h-5 w-5 mr-3" /> Contact Us
              </Link>
              <Link href="/terms" className="flex items-center py-2 text-gray-700 hover:text-amber-600" onClick={() => setIsMenuOpen(false)}>
                <DocumentTextIcon className="h-5 w-5 mr-3" /> Terms & Conditions
              </Link>
              {isLoggedIn && (
                <>
                  <div className="border-t border-gray-100 my-1" />
                  <Link href="/orders" className="flex items-center py-2 text-gray-700 hover:text-amber-600" onClick={() => setIsMenuOpen(false)}>
                    <ClipboardDocumentListIcon className="h-5 w-5 mr-3" /> My Orders
                  </Link>
                  <button onClick={handleLogout} className="flex items-center w-full py-2 text-red-600 hover:text-red-700">
                    <XMarkIcon className="h-5 w-5 mr-3" /> Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
