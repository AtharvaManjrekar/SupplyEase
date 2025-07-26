"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Users, ShoppingCart, Truck, Heart, MapPin, Clock, Phone } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState({})

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Street Food Vendor",
      location: "Mumbai",
      text: "This platform helped me connect with the best bhaji suppliers in my area. Fresh vegetables, fair prices, and reliable delivery!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Priya Sharma",
      role: "Bhaji Vendor",
      location: "Delhi",
      text: "I've expanded my business to 15+ street food vendors through this platform. It's been a game-changer for my family business.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Amit Patel",
      role: "Food Cart Owner",
      location: "Pune",
      text: "Quality vegetables delivered on time, every time. My customers love the freshness, and my profits have increased by 40%!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 ">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 lg:px-5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                SupplyEase
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Vendors
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Contact
              </a>
            </nav>
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-20 lg:pl-8 lg:pr-2">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-orange-400/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Connect with
                <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent block">
                  Fresh Bhaji Vendors
                </span>
                in Your City
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Bridge the gap between local vegetable vendors and street food sellers. Fresh produce, fair prices, and
                community connections - all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Join Now - It's Free!
                </button>
                <button className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105">
                  Explore Vendors
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700 font-medium">500+ Vendors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-6 h-6 text-orange-600" />
                  <span className="text-gray-700 font-medium">Daily Fresh Delivery</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="animate-float">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Street food vendors and bhaji sellers"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Top Vendors Section */}
      <section id="vendors" className="py-20 bg-gradient-to-br from-green-50 to-orange-50 lg:px-5">
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible.vendors ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
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

      {/* Fresh Deals Section */}
      <section id="deals" className="py-20 bg-white lg:px-5">
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible.deals ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              What Our{" "}
              <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                Community Says
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from vendors and sellers who've transformed their business with SupplyEase
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="flex-shrink-0">
                  <Image
                    src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-4 border-green-200"
                  />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg lg:text-xl text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div>
                    <div className="font-bold text-gray-800 text-lg">{testimonials[currentTestimonial].name}</div>
                    <div className="text-green-600 font-medium">{testimonials[currentTestimonial].role}</div>
                    <div className="text-gray-500 text-sm">{testimonials[currentTestimonial].location}</div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-green-500 scale-125" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join thousands of vendors and sellers who are already growing their business with SupplyEase
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Start Selling Today
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105">
              Find Vendors Near You
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">SupplyEase</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Connecting local bhaji vendors with street food sellers across India. Fresh produce, fair prices,
                community connections.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Find Vendors
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Become a Seller
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Mumbai, Maharashtra</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-300">© 2024 SupplyEase. All rights reserved. Made with ❤️ for Indian vendors.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
