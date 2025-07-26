"use client"
import { MapPin, Star } from "lucide-react"
import Image from "next/image"

export default function TopVendorsSection({ topVendors, isVisible }) {
  return (
    <section id="vendors" className="py-20 bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible?.vendors ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Top{" "}
            <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              Bhaji Vendors
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our verified vendors who provide the freshest vegetables to street food sellers across India
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topVendors.map((vendor, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="relative">
                <Image
                  src={vendor.image || "/placeholder.svg"}
                  alt={vendor.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {vendor.verified && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Verified
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{vendor.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{vendor.location}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{vendor.rating}</span>
                  </div>
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                    {vendor.speciality}
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105">
                  Connect Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 