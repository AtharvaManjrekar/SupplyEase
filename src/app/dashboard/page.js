"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { ShoppingCart, Users, Truck, Star, User, Database, Settings, Package, MapPin, Store } from 'lucide-react';
import Header from '../home/components/Header';

// New: Sidebar and Panel Components
import Sidebar from './components/Sidebar';
import ProfilePanel from './components/ProfilePanel';
import ProductsNearbyPanel from './components/ProductsNearbyPanel';
import SellProductsPanel from './components/SellProductsPanel';
import OrdersPage from './components/orders';

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPanel, setSelectedPanel] = useState('profile');

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

  // Role-based panel options
  const role = userData?.role;
  const panels = [
    { key: 'profile', label: 'Profile', icon: User },
    ...(role === 'vendor' ? [{ key: 'productsNearby', label: 'Products Nearby', icon: MapPin }] : []),
    ...(role === 'distributor' ? [{ key: 'sellProducts', label: 'Sell Products', icon: Store }] : []),
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  // Panel rendering
  let panelContent = null;
  if (selectedPanel === 'profile') {
    panelContent = <ProfilePanel user={user} userData={userData} />;
  } else if (selectedPanel === 'productsNearby') {
    panelContent = <ProductsNearbyPanel userData={userData} />;
  } else if (selectedPanel === 'sellProducts') {
    panelContent = <SellProductsPanel user={userData} />;
  } else if (selectedPanel === 'orders') {
    panelContent = <OrdersPage userData={userData} role={role} />;
  } else if (selectedPanel === 'settings') {
    panelContent = <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-white/20">Settings - Coming soon</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-20">
          {/* Sidebar */}
          <Sidebar panels={panels} selectedPanel={selectedPanel} setSelectedPanel={setSelectedPanel} />
          {/* Main Panel */}
          <div className="flex-1">{panelContent}</div>
        </div>
      </div>
      {/* Background decorative elements */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-gradient-to-r from-green-400/10 to-orange-400/10 rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full animate-pulse delay-1000 pointer-events-none"></div>
      <div className="fixed top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-green-300/10 to-blue-300/10 rounded-full animate-pulse delay-500 pointer-events-none"></div>
    </div>
  );
}