"use client"

import { useUser } from '@clerk/nextjs';
import { ShoppingCart, Package, Users, TrendingUp, MapPin, Clock, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (isLoaded && user) {
      fetch(`/api/users/me?clerkId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.user || data.user.role !== 'vendor') {
            router.push('/select-role');
          }
        });
    }
  }, [isLoaded, user, router]);
  if (!isLoaded) return <LoadingScreen />;
  const [vendorData, setVendorData] = useState({
    totalOrders: 156,
    pendingDeliveries: 8,
    activeCustomers: 23,
    monthlyRevenue: 45000,
    recentOrders: [
      { id: 1, customer: "Rajesh Kumar", items: "Fresh Tomatoes, Onions", amount: 1200, status: "pending", time: "2 hours ago" },
      { id: 2, customer: "Priya Sharma", items: "Carrots, Potatoes", amount: 800, status: "delivered", time: "4 hours ago" },
      { id: 3, customer: "Amit Patel", items: "Green Peas, Cauliflower", amount: 1500, status: "pending", time: "6 hours ago" },
    ]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                EaseSupply
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Vendor Dashboard</span>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName?.charAt(0) || 'V'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.firstName || 'Vendor'}! 👋
          </h1>
          <p className="text-gray-600">Manage your vegetable supply business efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{vendorData.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Deliveries</p>
                <p className="text-3xl font-bold text-orange-600">{vendorData.pendingDeliveries}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Customers</p>
                <p className="text-3xl font-bold text-gray-800">{vendorData.activeCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{vendorData.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {vendorData.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{order.customer}</h3>
                  <p className="text-gray-600 text-sm">{order.items}</p>
                  <p className="text-gray-500 text-xs">{order.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">₹{order.amount}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 