"use client"

import { useUser, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TestSignUpPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState({});
  const [testResult, setTestResult] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  const checkClerkConfig = () => {
    const info = {
      isLoaded,
      isSignUpLoaded,
      hasSignUp: !!signUp,
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not Set',
      hasSecretKey: process.env.CLERK_SECRET_KEY ? 'Set' : 'Not Set',
      currentUrl: window.location.href,
      userAgent: navigator.userAgent,
    };
    
    setDebugInfo(info);
    console.log('Clerk Debug Info:', info);
  };

  const testSignUp = async () => {
    if (!isSignUpLoaded) {
      setTestResult("Clerk not loaded");
      return;
    }

    try {
      setTestResult("Testing sign-up...");
      
      // Generate a truly unique password
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const testPassword = `TestPass${timestamp}${randomString}@#$`;
      const testEmail = `test-${timestamp}-${randomString}@example.com`;
      
      console.log("Test credentials:", { email: testEmail, password: testPassword });
      
      const result = await signUp.create({
        firstName: "Test",
        lastName: "User",
        emailAddress: testEmail,
        password: testPassword,
      });

      setTestResult(`Sign-up result: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      console.error("Test sign-up error:", err);
      setTestResult(`Error: ${JSON.stringify(err, null, 2)}`);
    }
  };

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
            
            <button
              onClick={checkClerkConfig}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
            >
              Check Clerk Configuration
            </button>
            
            <button
              onClick={testSignUp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
            >
              Test Sign-Up Process
            </button>
            
            <button
              onClick={async () => {
                if (!isSignUpLoaded) {
                  setTestResult("Clerk not loaded");
                  return;
                }
                try {
                  setTestResult("Testing with simple password...");
                  const timestamp = Date.now();
                  const result = await signUp.create({
                    firstName: "Test",
                    lastName: "User",
                    emailAddress: `simple-${timestamp}@example.com`,
                    password: `Simple${timestamp}Pass`,
                  });
                  setTestResult(`Simple password result: ${JSON.stringify(result, null, 2)}`);
                } catch (err) {
                  console.error("Simple password test error:", err);
                  setTestResult(`Simple password error: ${JSON.stringify(err, null, 2)}`);
                }
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
            >
              Test with Simple Password
            </button>
            
            <Link 
              href="/home"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 block text-center"
            >
              Back to Home
            </Link>
          </div>
          
          {/* Debug Information */}
          {Object.keys(debugInfo).length > 0 && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Configuration Status:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                {Object.entries(debugInfo).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {testResult && (
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Test Result:</h3>
              <pre className="text-sm bg-white p-2 rounded overflow-auto max-h-32">
                {testResult}
              </pre>
            </div>
          )}
          
          <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Common Issues:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Missing or incorrect Clerk API keys in .env.local</li>
              <li>• Clerk application not configured for your domain</li>
              <li>• Email and password authentication not enabled in Clerk dashboard</li>
              <li>• Network connectivity issues</li>
              <li>• Invalid email format or weak password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 