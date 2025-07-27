"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { ShoppingCart, Users, Truck, Star, User, Database, Settings, Package } from 'lucide-react';
import Header from '../home/components/Header';

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/sign-in');
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Your Dashboard
              </h1>
              <p className="text-gray-600 mb-6">
                Manage your vegetable supply business with ease. Track orders, manage inventory, and grow your business.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <Package className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Total Orders</h3>
                      <p className="text-2xl font-bold text-green-600">24</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-8 h-8 text-orange-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Active Deliveries</h3>
                      <p className="text-2xl font-bold text-orange-600">8</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Partners</h3>
                      <p className="text-2xl font-bold text-blue-600">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Clerk User Info */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-blue-900">
                    Clerk User Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-blue-700">Name:</span>
                    <p className="text-blue-900 font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-700">Email:</span>
                    <p className="text-blue-900 font-medium">
                      {user.emailAddresses[0].emailAddress}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-700">User ID:</span>
                    <p className="text-blue-900 text-sm font-mono bg-blue-50 p-2 rounded">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-700">Created:</span>
                    <p className="text-blue-900 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* MongoDB User Data */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <Database className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-green-900">
                    Database Information
                  </h2>
                </div>
                {userData ? (
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-green-700">Role:</span>
                      <p className="text-green-900 font-medium capitalize">
                        {userData.role || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-700">Company:</span>
                      <p className="text-green-900 font-medium">
                        {userData.company || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-700">Phone:</span>
                      <p className="text-green-900 font-medium">
                        {userData.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-700">Verified:</span>
                      <p className="text-green-900 font-medium">
                        {userData.isVerified ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-700">Database Created:</span>
                      <p className="text-green-900 font-medium">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-green-700 font-medium">User data not found in database</p>
                    <p className="text-sm text-green-600 mt-2">
                      This might happen if the webhook hasn't processed yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5" />
                    <span>View Orders</span>
                  </div>
                </button>
                <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5" />
                    <span>Track Deliveries</span>
                  </div>
                </button>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5" />
                    <span>Manage Partners</span>
                  </div>
                </button>
                <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-semibold text-green-600">₹45,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-semibold text-blue-600">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Growth</span>
                  <span className="font-semibold text-orange-600">+12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-gradient-to-r from-green-400/10 to-orange-400/10 rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full animate-pulse delay-1000 pointer-events-none"></div>
      <div className="fixed top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-green-300/10 to-blue-300/10 rounded-full animate-pulse delay-500 pointer-events-none"></div>
    </div>
  );
} 