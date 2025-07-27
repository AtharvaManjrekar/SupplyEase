"use client";

import Header from "../home/components/Header";

export default function ContactPage() {
    return (
        <section className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Header />
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 mt-10">
                        Contact <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">Us</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Have questions, feedback, or want to partner with us? Fill out the form below or reach out directly. We're here to help!
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <form className="bg-gradient-to-br from-green-200 to-orange-200 rounded-2xl shadow-lg p-8 flex flex-col space-y-6">
                        <input type="text" placeholder="Your Name" className="px-4 py-3 rounded-lg border border-green-400 bg-[#FFF7ED] shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-400" required />
                        <input type="email" placeholder="Your Email" className="px-4 py-3 rounded-lg border border-green-400 bg-[#FFF7ED] shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-400" required />
                        <textarea placeholder="Your Message" rows={5} className="px-4 py-3 rounded-lg border border-green-400 bg-[#FFF7ED] shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 placeholder-gray-400" required />
                        <button type="submit" className="bg-gradient-to-r from-green-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105">
                            Send Message
                        </button>
                    </form>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-80 w-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609826074!2d72.74109995!3d19.0821978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63fdc6b0c47%3A0x1a1b1b1b1b1b1b1b!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Our Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
} 