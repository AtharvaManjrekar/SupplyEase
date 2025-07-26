"use client"

import { ShoppingCart, Users, Truck, Star } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-green-50 py-10 sm:py-16 md:py-20 lg:py-32">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Connect with Fresh
                <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent block">
                  Vegetable Vendors
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                EaseSupply bridges the gap between street food vendors and fresh vegetable suppliers. 
                Get quality produce delivered daily, build lasting partnerships, and grow your business.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-base sm:text-lg">
                Find Vendors
              </button>
              <button className="border-2 border-green-500 text-green-600 px-6 py-3 sm:px-8 sm:py-4 rounded-full hover:bg-green-50 transition-all duration-300 font-semibold text-base sm:text-lg">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-col xs:flex-row gap-6 pt-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">500+</div>
                  <div className="text-sm text-gray-600">Active Vendors</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="w-8 h-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">1000+</div>
                  <div className="text-sm text-gray-600">Daily Deliveries</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">4.9</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Fresh vegetables and street food vendors"
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                priority
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-green-400/20 to-orange-400/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 