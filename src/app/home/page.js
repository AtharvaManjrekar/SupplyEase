"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Users, ShoppingCart, Truck, Heart, MapPin, Clock, Phone } from "lucide-react"
import Image from "next/image"
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import TopVendorsSection from "../components/TopVendorsSection";
import FreshDealsSection from "../components/FreshDealsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

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
  ];

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
  ];

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
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">

      <Header />

      <HeroSection />

      <StatsSection />

      <TopVendorsSection topVendors={topVendors} isVisible={isVisible} />

      <FreshDealsSection freshDeals={freshDeals} isVisible={isVisible} />
      <TestimonialsSection
        testimonials={testimonials}
        currentTestimonial={currentTestimonial}
        setCurrentTestimonial={setCurrentTestimonial}
      />
      <CTASection />
      <Footer />
    </div>
  );
} 