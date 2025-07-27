"use client"

import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';

export default function TestPasswordPage() {
  const { signUp, isLoaded } = useSignUp();
  const [results, setResults] = useState([]);

  const testPassword = async (password, description) => {
    if (!isLoaded) {
      setResults(prev => [...prev, { password, description, result: "Clerk not loaded" }]);
      return;
    }

    try {
      const timestamp = Date.now();
      const result = await signUp.create({
        firstName: "Test",
        lastName: "User",
        emailAddress: `test-${timestamp}@example.com`,
        password: password,
      });
      setResults(prev => [...prev, { password, description, result: "SUCCESS", data: result }]);
    } catch (err) {
      setResults(prev => [...prev, { password, description, result: "ERROR", error: err }]);
    }
  };

  const runAllTests = async () => {
    setResults([]);
    
    const testPasswords = [
      { password: "Test123!@#", description: "Basic strong password" },
      { password: "MySecurePass2024!", description: "Descriptive strong password" },
      { password: "aB1!cD2@eF3#", description: "Random characters" },
      { password: "Password123!", description: "Common pattern" },
      { password: "Qwerty123!", description: "Keyboard pattern" },
      { password: "Admin123!", description: "Admin pattern" },
      { password: "User123!", description: "User pattern" },
      { password: "Test123!", description: "Simple test pattern" },
    ];

    for (const test of testPasswords) {
      await testPassword(test.password, test.description);
      // Wait a bit between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Password Test Page</h1>
        
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <button
            onClick={runAllTests}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors mb-6"
          >
            Run All Password Tests
          </button>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                result.result === "SUCCESS" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{result.description}</h3>
                    <p className="text-sm text-gray-600">Password: {result.password}</p>
                    <p className={`font-medium ${
                      result.result === "SUCCESS" ? "text-green-700" : "text-red-700"
                    }`}>
                      Result: {result.result}
                    </p>
                  </div>
                  <button
                    onClick={() => testPassword(result.password, result.description)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Retest
                  </button>
                </div>
                
                {result.error && (
                  <div className="mt-2">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-red-600">Error Details</summary>
                      <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">About Password Testing:</h3>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• This page tests different password formats with Clerk</li>
              <li>• Some passwords may be flagged as compromised</li>
              <li>• Use successful passwords as examples for your app</li>
              <li>• Wait between tests to avoid rate limiting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 