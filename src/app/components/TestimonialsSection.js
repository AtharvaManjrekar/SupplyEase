"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import Image from "next/image"

export default function TestimonialsSection() {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from street food vendors and vegetable suppliers who have transformed 
            their businesses with EaseSupply.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <Quote className="w-12 h-12 text-green-500" />
              </div>
              
              <div className="text-center mb-8">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
              </div>

              <div className="flex items-center justify-center space-x-1 mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Image
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  width={60}
                  height={60}
                  className="w-15 h-15 rounded-full object-cover"
                />
                <div className="text-center">
                  <h4 className="font-bold text-gray-800">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-600 text-sm">{testimonials[currentTestimonial].role}</p>
                  <p className="text-gray-500 text-sm">{testimonials[currentTestimonial].location}</p>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-green-500 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 