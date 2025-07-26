"use client"

import { useUser } from '@clerk/nextjs';
import { ShoppingCart, Package, Truck, Users, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../components/LoadingScreen';

export default function SelectRole() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoaded) return <LoadingScreen />;

  const roles = [
    {
      id: 'vendor',
      title: 'Vendor',
      description: 'I supply fresh vegetables to street food vendors and restaurants',
      icon: Package,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      features: [
        'Manage your vegetable inventory',
        'Connect with street food vendors',
        'Track orders and deliveries',
        'Earn competitive profits'
      ]
    },
    {
      id: 'distributor',
      title: 'Distributor',
      description: 'I distribute vegetables from vendors to various locations',
      icon: Truck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      features: [
        'Manage distribution network',
        'Coordinate deliveries',
        'Track logistics and routes',
        'Build supplier relationships'
      ]
    }
  ];

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      setError('Please select a role to continue.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          role: selectedRole,
        }),
      });

      if (response.ok) {
        // Redirect to the appropriate dashboard
        router.push(`/${selectedRole}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update role. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              <span className="text-gray-700 font-medium">Select Your Role</span>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to EaseSupply! Please select your role to get started with managing your vegetable supply business.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`relative bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${
                selectedRole === role.id
                  ? 'border-green-500 shadow-green-100'
                  : 'border-white/20 hover:border-green-300'
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-full flex items-center justify-center mr-4`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{role.title}</h3>
                    <p className="text-gray-600">{role.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedRole === role.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
            className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto space-x-2 ${
              selectedRole && !isLoading
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Choose EaseSupply?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">500+ Active Users</h4>
              <p className="text-gray-600 text-sm">Join our growing community of vendors and distributors</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Fast Delivery</h4>
              <p className="text-gray-600 text-sm">Efficient logistics and timely deliveries</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Quality Assured</h4>
              <p className="text-gray-600 text-sm">Fresh vegetables and verified suppliers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 