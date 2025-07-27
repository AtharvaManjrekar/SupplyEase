"use client"
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/store/slices/userSlice';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { isSignedIn, user, signOut } = useUser();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    dispatch(clearUser());
    router.push('/home');
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              EaseSupply
            </span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/home" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Products
            </Link>
            <Link href="/vendors" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Vendors
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Contact
            </Link>
            {isSignedIn && (
              <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Dashboard
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 font-medium">
                  Welcome, {user.firstName || user.emailAddresses[0].emailAddress}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-full transition-colors font-medium"
                >
                  Logout
                </button>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10",
                      userButtonPopoverCard: "shadow-xl border border-gray-200",
                      userButtonPopoverActionButton: "hover:bg-green-50 text-gray-700",
                      userButtonPopoverActionButtonText: "text-gray-700",
                      userButtonPopoverFooter: "border-t border-gray-200",
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/sign-in"
                  className="text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-2 rounded-full hover:bg-green-50"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}