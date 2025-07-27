"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { ShoppingCart, Users, Truck, Star, User, Database, Settings, Package, MapPin, Store } from 'lucide-react';
import Header from '../home/components/Header';
import StatsSection from '../home/components/StatsSection';
import CTASection from '../home/components/CTASection';
import Footer from '../home/components/Footer';

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
    { key: 'profile', label: 'Profile', icon: User, color: 'bg-gray-200 hover:bg-gray-300' },
    ...(role === 'vendor' ? [{ key: 'productsNearby', label: 'Products Nearby', icon: MapPin, color: 'bg-gray-200 hover:bg-gray-300' }] : []),
    ...(role === 'distributor' ? [{ key: 'sellProducts', label: 'Sell Products', icon: Store, color: 'bg-gray-200 hover:bg-gray-300' }] : []),
    { key: 'orders', label: 'Orders', icon: Package, color: 'bg-gray-200 hover:bg-gray-300' },
    { key: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-200 hover:bg-gray-300' },
  ];

  // Updated panel rendering with card-based layout
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-20">
          {/* Sidebar */}
          <Sidebar panels={panels} selectedPanel={selectedPanel} setSelectedPanel={setSelectedPanel} />
          {/* Main Panel */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-transform duration-300 ease-in-out">
            {panelContent}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}