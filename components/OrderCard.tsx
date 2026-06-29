'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CogIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

interface OrderCardProps {
  order: {
    _id: string;
    orderNumber: string;
    items: Array<{
      name: string;
      image: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    shippingAddress: any;
    createdAt: string;
    estimatedDelivery?: string;
    trackingNumber?: string;
    deliveredAt?: string;
  };
}

const STEPS = [
  { key: 'pending',    label: 'Order Placed',  Icon: ShoppingBagIcon },
  { key: 'processing', label: 'Processing',    Icon: CogIcon },
  { key: 'shipped',    label: 'Shipped',       Icon: TruckIcon },
  { key: 'delivered',  label: 'Delivered',     Icon: CheckCircleIcon },
];

const stepIndex = (status: string) => STEPS.findIndex(s => s.key === status);

export default function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentStep = stepIndex(order.orderStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'processing': return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case 'shipped': return <TruckIcon className="h-5 w-5 text-purple-600" />;
      case 'cancelled': return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default: return <ClockIcon className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Order #{order.orderNumber}</p>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)}
              <span>{getStatusText(order.orderStatus)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-bold text-amber-600">₹{order.totalAmount.toLocaleString()}</p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              {/* Order progress stepper */}
              {order.orderStatus !== 'cancelled' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                    <div
                      className="absolute top-4 left-0 h-0.5 bg-amber-500 z-0 transition-all duration-500"
                      style={{ width: `${currentStep === 0 ? 0 : (currentStep / (STEPS.length - 1)) * 100}%` }}
                    />
                    {STEPS.map((step, i) => {
                      const done = i <= currentStep;
                      return (
                        <div key={step.key} className="flex flex-col items-center z-10 gap-1">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                            done ? 'bg-amber-500 border-amber-500' : 'bg-white border-gray-300'
                          }`}>
                            <step.Icon className={`h-4 w-4 ${done ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <span className={`text-xs font-medium text-center w-16 ${done ? 'text-amber-600' : 'text-gray-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {order.orderStatus === 'cancelled' && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-red-700">This order has been cancelled</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            src={item.image || ''}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          ₹{(item.quantity * item.price).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Shipping Address</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    <p className="text-sm text-gray-800">{order.shippingAddress.name}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.zipCode}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                    <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>
                    <p className="text-sm text-gray-600">Email: {order.shippingAddress.email}</p>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-semibold text-gray-700 mb-1">Payment</h4>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-3">
                      <h4 className="font-semibold text-gray-700 mb-1">Tracking Number</h4>
                      <p className="text-sm font-mono bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg inline-block">
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}

                  {order.deliveredAt && (
                    <div className="mt-3">
                      <h4 className="font-semibold text-gray-700 mb-1">Delivered On</h4>
                      <p className="text-sm text-green-700 font-medium">
                        {new Date(order.deliveredAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {order.estimatedDelivery && (
                    <div className="mt-3">
                      <h4 className="font-semibold text-gray-700 mb-1">Estimated Delivery</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}