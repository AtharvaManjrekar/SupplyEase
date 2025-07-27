"use client";

import Header from "../home/components/Header";

export default function AboutPage() {
    return (
        <section className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Header />
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 mt-10">
                        About <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">EaseSupply</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        EaseSupply bridges the gap between local vegetable vendors and street food sellers, making fresh produce accessible, affordable, and reliable for everyone. Our mission is to empower small businesses, support local farmers, and foster community connections through technology.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl shadow-lg p-10 text-gray-700 text-lg leading-relaxed">
                    <ul className="list-disc pl-6 mb-6">
                        <li><b>Our Mission:</b> To connect vendors and buyers for a fair, transparent, and efficient supply chain.</li>
                        <li><b>Our Vision:</b> A thriving ecosystem where local businesses grow and communities prosper.</li>
                        <li><b>Our Values:</b> Trust, Freshness, Community, and Innovation.</li>
                    </ul>
                    <p>
                        We believe in supporting local economies and providing the freshest produce to our customers. By leveraging technology, we make it easy for vendors to reach new customers and for buyers to find the best deals in their city.
                    </p>
                </div>
            </div>
        </section>
    );
} 