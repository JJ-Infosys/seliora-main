'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import OrderCard from '@/components/OrderCard';
import { ClipboardDocumentListIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const newOrderId = searchParams.get('orderId');

  useEffect(() => {
    if (success === 'true') setShowBanner(true);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Payment success banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-4"
            >
              <CheckCircleIcon className="h-7 w-7 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-800 text-lg">Payment Successful!</p>
                <p className="text-green-700 text-sm mt-0.5">
                  Your order has been placed and is being processed. You can track the status below.
                </p>
              </div>
              <button onClick={() => setShowBanner(false)} className="text-green-500 hover:text-green-700">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <ClipboardDocumentListIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600">No orders yet</h2>
            <p className="text-gray-500 mt-2">Start shopping to see your orders here</p>
            <Link href="/products"
              className="inline-block mt-6 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Highlight the newly paid order */}
                {newOrderId && order._id === newOrderId && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">New order — just placed</span>
                  </div>
                )}
                <div className={newOrderId && order._id === newOrderId ? 'ring-2 ring-green-400 rounded-xl' : ''}>
                  <OrderCard order={order} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
