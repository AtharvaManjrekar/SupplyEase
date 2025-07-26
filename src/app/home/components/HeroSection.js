"use client"
import { Users, Truck } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16 md:py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-orange-400/20"></div>
      <div className="container mx-auto px-2 sm:px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Connect with
              <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent block">
                Fresh Bhaji Vendors
              </span>
              in Your City
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
              Bridge the gap between local vegetable vendors and street food sellers. Fresh produce, fair prices, and
              community connections - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Join Now - It's Free!
              </button>
              <button className="border-2 border-orange-500 text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105">
                Explore Vendors
              </button>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-green-600" />
                <span className="text-gray-700 font-medium text-sm sm:text-base">500+ Vendors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-6 h-6 text-orange-600" />
                <span className="text-gray-700 font-medium text-sm sm:text-base">Daily Fresh Delivery</span>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center items-center w-full">
            <div className="animate-float w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Street food vendors and bhaji sellers"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl w-full h-auto object-contain"
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
                priority
              />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 