"use client"
import { Users, ShoppingCart, MapPin, Heart } from "lucide-react"

export default function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: "500+", label: "Active Vendors", icon: Users },
            { number: "2000+", label: "Street Food Sellers", icon: ShoppingCart },
            { number: "50+", label: "Cities Covered", icon: MapPin },
            { number: "99%", label: "Customer Satisfaction", icon: Heart },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 