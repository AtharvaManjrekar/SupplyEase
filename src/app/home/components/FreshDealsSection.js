"use client"
import { Clock } from "lucide-react"
import Image from "next/image"

export default function FreshDealsSection({ freshDeals, isVisible }) {
  return (
    <section id="deals" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible?.deals ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Fresh{" "}
            <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              Bhaji Deals
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Limited time offers on the freshest vegetables from our trusted vendors
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {freshDeals.map((deal, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-green-100"
            >
              <div className="relative">
                <Image
                  src={deal.image || "/placeholder.svg"}
                  alt={deal.title}
                  width={200}
                  height={150}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {deal.discount}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{deal.title}</h3>
                <div className="text-sm text-gray-600 mb-3">by {deal.vendor}</div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">{deal.salePrice}</span>
                    <span className="text-lg text-gray-400 line-through">{deal.originalPrice}</span>
                  </div>
                  <div className="flex items-center text-orange-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Limited Time</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105">
                  Grab Deal Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 