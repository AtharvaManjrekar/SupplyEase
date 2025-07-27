"use client"

import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';

export default function DebugClerkPage() {
  const { signUp, isLoaded } = useSignUp();
  const [debugInfo, setDebugInfo] = useState({});
  const [testResult, setTestResult] = useState("");

  const checkClerkConfig = () => {
    const info = {
      isLoaded,
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
    if (!isLoaded) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Clerk Debug Information</h1>
        
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="space-y-4 mb-6">
            <button 
              onClick={checkClerkConfig}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Check Clerk Configuration
            </button>
            
            <button 
              onClick={testSignUp}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors ml-4"
            >
              Test Sign-Up Process
            </button>
          </div>
          
          {Object.keys(debugInfo).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Configuration Status:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(debugInfo).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-700">{key}:</div>
                    <div className="text-gray-900 break-all">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {testResult && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Test Result:</h3>
              <pre className="text-sm bg-white p-2 rounded overflow-auto max-h-32">
                {testResult}
              </pre>
            </div>
          )}
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Common Issues:</h3>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Missing or incorrect Clerk API keys in .env.local</li>
              <li>• Clerk application not configured for your domain</li>
              <li>• Email and password authentication not enabled in Clerk dashboard</li>
              <li>• Network connectivity issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 