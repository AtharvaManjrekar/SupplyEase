"use client"

import { ShoppingCart, ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-orange-600">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of street food vendors and vegetable suppliers who are already 
            growing their businesses with EaseSupply. Start connecting today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg flex items-center justify-center space-x-2">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-green-600 transition-all duration-300 font-semibold text-lg">
              Learn More
            </button>
          </div>
          
          <p className="text-white/80 text-sm mt-6">
            No credit card required • Free to join • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
} 