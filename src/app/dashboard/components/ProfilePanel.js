import React from 'react';
import { User, Database } from 'lucide-react';

export default function ProfilePanel({ user, userData }) {
  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-black mb-2 tracking-tight">Welcome to Your Dashboard</h1>
        <p className="text-lg text-black/80 mb-4">Manage your vegetable supply business with ease. Track orders, manage inventory, and grow your business.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-2xl border border-green-200 flex items-center gap-4 shadow-sm">
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500/20"><svg width="28" height="28"><circle cx="14" cy="14" r="12" fill="#16a34a" /></svg></span>
            <div>
              <h3 className="font-semibold text-black/80 text-lg">Total Orders</h3>
              <p className="text-2xl font-extrabold text-black">24</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-6 rounded-2xl border border-orange-200 flex items-center gap-4 shadow-sm">
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500/20"><svg width="28" height="28"><circle cx="14" cy="14" r="12" fill="#ea580c" /></svg></span>
            <div>
              <h3 className="font-semibold text-black/80 text-lg">Active Deliveries</h3>
              <p className="text-2xl font-extrabold text-black">8</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-2xl border border-blue-200 flex items-center gap-4 shadow-sm">
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500/20"><svg width="28" height="28"><circle cx="14" cy="14" r="12" fill="#2563eb" /></svg></span>
            <div>
              <h3 className="font-semibold text-black/80 text-lg">Partners</h3>
              <p className="text-2xl font-extrabold text-black">12</p>
            </div>
          </div>
        </div>
      </div>
      {/* User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Clerk User Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-7 h-7 text-black/80" />
            <h2 className="text-xl font-bold text-black">Clerk User Information</h2>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-semibold text-black/70">Name:</span>
              <p className="text-black font-medium text-base">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-black/70">Email:</span>
              <p className="text-black font-medium text-base">{user.emailAddresses[0].emailAddress}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-black/70">User ID:</span>
              <p className="text-black text-xs font-mono bg-blue-50 p-2 rounded">{user.id}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-black/70">Created:</span>
              <p className="text-black font-medium text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        {/* MongoDB User Data */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-7 h-7 text-black/80" />
            <h2 className="text-xl font-bold text-black">Database Information</h2>
          </div>
          {userData ? (
            <div className="space-y-2">
              <div>
                <span className="text-sm font-semibold text-black/70">Role:</span>
                <p className="text-black font-medium text-base capitalize">{userData.role || 'Not set'}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-black/70">Company:</span>
                <p className="text-black font-medium text-base">{userData.company || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-black/70">Phone:</span>
                <p className="text-black font-medium text-base">{userData.phone || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-black/70">Verified:</span>
                <p className="text-black font-medium text-base">{userData.isVerified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-black/70">Database Created:</span>
                <p className="text-black font-medium text-base">{new Date(userData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-black mx-auto mb-4" />
              <p className="text-black font-medium">User data not found in database</p>
              <p className="text-sm text-black mt-2">This might happen if the webhook hasn't processed yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 