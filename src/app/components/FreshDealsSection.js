"use client"

import { ShoppingCart, Tag } from "lucide-react"
import Image from "next/image"

export default function FreshDealsSection() {
  const freshDeals = [
    {
      title: "Onion & Potato Combo",
      originalPrice: "₹120",
      salePrice: "₹89",
      discount: "26% OFF",
      vendor: "Sharma Vegetables",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Green Leafy Bundle",
      originalPrice: "₹80",
      salePrice: "₹59",
      discount: "26% OFF",
      vendor: "Fresh Greens Co.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      title: "Tomato Special",
      originalPrice: "₹60",
      salePrice: "₹45",
      discount: "25% OFF",
      vendor: "Red Tomato Farm",
      image: "/placeholder.svg?height=150&width=200",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Fresh Deals & Offers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the best prices on fresh vegetables and daily essentials. 
            Limited time offers from trusted vendors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {freshDeals.map((deal, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
              <div className="relative">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  width={200}
                  height={150}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                    <Tag className="w-3 h-3" />
                    <span>{deal.discount}</span>
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                  {deal.title}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-gray-600">by</span>
                  <span className="text-sm font-medium text-green-600">{deal.vendor}</span>
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl font-bold text-green-600">{deal.salePrice}</span>
                  <span className="text-lg text-gray-400 line-through">{deal.originalPrice}</span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 