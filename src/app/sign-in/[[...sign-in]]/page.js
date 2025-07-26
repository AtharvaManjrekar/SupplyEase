"use client"

import { SignIn } from "@clerk/nextjs"
import { ShoppingCart, Users, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (isSignedIn && user) {
      fetch(`/api/users/me?clerkId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            if (data.user.role === 'vendor') {
              router.push('/vendor');
            } else if (data.user.role === 'distributor') {
              router.push('/distributor');
            } else {
              router.push('/select-role');
            }
          } else {
            // fallback: if user not found, go to select-role
            router.push('/select-role');
          }
        });
    }
  }, [isSignedIn, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Branding & Info */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                EaseSupply
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Welcome back to
              <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent block">
                EaseSupply
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Connect with fresh vegetable vendors and street food suppliers. Your trusted platform for quality produce and reliable partnerships.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-800">500+ Active Vendors</h3>
                <p className="text-sm text-gray-600">Connect with verified suppliers</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-orange-100">
              <Truck className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Daily Fresh Delivery</h3>
                <p className="text-sm text-gray-600">Quality produce at your doorstep</p>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent p-0",
                    headerTitle: "text-2xl font-bold text-gray-800 text-center",
                    headerSubtitle: "text-gray-600 text-center mt-2",
                    formButtonPrimary: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg",
                    formFieldInput: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300",
                    formFieldLabel: "text-gray-700 font-medium mb-2 block",
                    footerActionLink: "text-green-600 hover:text-green-700 font-semibold transition-colors",
                    dividerLine: "bg-gray-300",
                    dividerText: "text-gray-500 bg-white px-4",
                    socialButtonsBlockButton: "border border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300",
                    socialButtonsBlockButtonText: "text-gray-700 font-medium",
                    formFieldLabelRow: "mb-2",
                    formFieldRow: "mb-4",
                    formResendCodeLink: "text-green-600 hover:text-green-700 font-semibold transition-colors",
                    identityPreviewText: "text-gray-700",
                    identityPreviewEditButton: "text-green-600 hover:text-green-700 font-semibold transition-colors",
                    formHeaderTitle: "text-2xl font-bold text-gray-800 text-center",
                    formHeaderSubtitle: "text-gray-600 text-center mt-2",
                    formFieldAction: "text-green-600 hover:text-green-700 font-semibold transition-colors",
                    footerAction: "text-center mt-6",
                    footerActionText: "text-gray-600",
                    footerActionLink: "text-green-600 hover:text-green-700 font-semibold transition-colors",
                  },
                  layout: {
                    socialButtonsPlacement: "bottom",
                    showOptionalFields: false,
                  }
                }}
                redirectUrl="/select-role"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-green-400/20 to-orange-400/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full animate-pulse delay-1000"></div>
    </div>
  )
} 