"use client"

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function TestSignUpPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Test Sign-Up Flow
        </h1>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Current Status: <span className="font-semibold text-green-600">Not Signed In</span>
            </p>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/sign-up"
              className="w-full bg-gradient-to-r from-green-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-orange-600 transition-all duration-300 block text-center"
            >
              Go to Sign Up
            </Link>
            
            <Link 
              href="/sign-in"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 block text-center"
            >
              Go to Sign In
            </Link>
            
            <Link 
              href="/home"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 block text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 