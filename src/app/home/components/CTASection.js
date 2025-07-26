"use client"

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-orange-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
        <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
          Join thousands of vendors and sellers who are already growing their business with EaseSupply
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
  )
} 