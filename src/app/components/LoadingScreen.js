import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-orange-100">
      <div className="relative w-full max-w-xs p-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 flex flex-col items-center">
        {/* Animated Loader */}
        <div className="mb-6">
          <span className="relative flex h-16 w-16">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-green-400 to-orange-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-16 w-16 bg-gradient-to-r from-green-500 to-orange-500 shadow-lg"></span>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">EaseSupply</h2>
        <p className="text-gray-700 text-lg font-medium animate-pulse">Loading your experience...</p>
      </div>
    </div>
  );
} 