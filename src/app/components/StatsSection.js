"use client"

import { Users, Truck, Star, TrendingUp } from "lucide-react"

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      number: "500+",
      label: "Active Vendors",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Truck,
      number: "1000+",
      label: "Daily Deliveries",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: Star,
      number: "4.9",
      label: "Average Rating",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: TrendingUp,
      number: "40%",
      label: "Growth Rate",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join the growing community of street food vendors and vegetable suppliers 
            who trust EaseSupply for their daily business needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 