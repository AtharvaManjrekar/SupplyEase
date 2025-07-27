"use client"

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TestAuthPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Authentication Test</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Authentication Status</h2>
              <div className="space-y-2">
                <p><strong>Signed In:</strong> <span className="text-green-600">✓ Yes</span></p>
                <p><strong>Loaded:</strong> <span className="text-green-600">✓ Yes</span></p>
                <p><strong>Email Verified:</strong> {user.emailAddresses[0]?.verification?.status === 'verified' ? 
                  <span className="text-green-600">✓ Yes</span> : 
                  <span className="text-red-600">✗ No</span>}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => router.push('/home')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 