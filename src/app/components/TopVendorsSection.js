"use client"

import { Star, MapPin, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function TopVendorsSection() {
  const topVendors = [
    {
      name: "Lakshmi Fresh Vegetables",
      location: "Andheri, Mumbai",
      rating: 4.9,
      speciality: "Organic Bhaji",
      image: "/placeholder.svg?height=200&width=300",
      verified: true,
    },
    {
      name: "Raman's Garden Fresh",
      location: "Connaught Place, Delhi",
      rating: 4.8,
      speciality: "Seasonal Vegetables",
      image: "/placeholder.svg?height=200&width=300",
      verified: true,
    },
    {
      name: "Green Valley Bhaji",
      location: "Koregaon Park, Pune",
      rating: 4.7,
      speciality: "Farm Direct",
      image: "/placeholder.svg?height=200&width=300",
      verified: true,
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Top Vegetable Vendors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with verified and trusted vegetable suppliers who deliver 
            fresh, quality produce to street food vendors across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {topVendors.map((vendor, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
              <div className="relative">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {vendor.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">
                      {vendor.rating}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 text-sm">{vendor.location}</span>
                </div>
                
                <div className="mb-4">
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {vendor.speciality}
                  </span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 font-medium">
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