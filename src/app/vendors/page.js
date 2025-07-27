"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../home/components/Header";
export default function VendorsPage() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVendors() {
            try {
                const res = await fetch("/api/vendors");
                if (!res.ok) throw new Error("Failed to fetch vendors");
                const data = await res.json();
                setVendors(data.vendors || []);
            } catch (err) {
                setVendors([
                    {
                        name: "Ramesh Bhajiwala",
                        image: "/placeholder.svg",
                        location: "Mumbai",
                        sales: 1200,
                        famousFor: "Fresh Bhindi & Tomatoes",
                        isTopSeller: true,
                    },
                    {
                        name: "Priya Veggies",
                        image: "/placeholder.svg",
                        location: "Delhi",
                        sales: 950,
                        famousFor: "Organic Greens",
                        isTopSeller: false,
                    },
                    {
                        name: "Amit's Cart",
                        image: "/placeholder.svg",
                        location: "Pune",
                        sales: 870,
                        famousFor: "Seasonal Fruits",
                        isTopSeller: false,
                    },
                    {
                        name: "Sunita Fresh",
                        image: "/placeholder.svg",
                        location: "Ahmedabad",
                        sales: 800,
                        famousFor: "Leafy Vegetables",
                        isTopSeller: false,
                    },
                ]);
            } finally {
                setLoading(false);
            }
        }
        fetchVendors();
    }, []);

    // Find the top seller
    const topVendor = vendors.reduce((max, v) => (v.sales > (max?.sales || 0) ? v : max), null);
    const otherVendors = vendors.filter(v => v !== topVendor);

    return (
        <section className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Header />
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 mt-10">
                        Famous <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">Vendors</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover the most popular vendors and see who has sold the most products on EaseSupply.
                    </p>
                </div>
                {loading ? (
                    <div className="text-center text-gray-500">Loading vendors...</div>
                ) : (
                    <>
                        {topVendor && (
                            <div className="mb-16 flex flex-col items-center">
                                <div className="bg-gradient-to-r from-orange-400 to-green-400 rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 max-w-3xl w-full mx-auto border-4 border-orange-500">
                                    <Image src={topVendor.image} alt={topVendor.name} width={120} height={120} className="rounded-full shadow-lg object-cover" />
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-3xl font-bold text-orange-700 mb-2">Top Seller: {topVendor.name}</h3>
                                        <div className="text-lg text-gray-700 mb-1">{topVendor.location}</div>
                                        <div className="text-md text-green-700 mb-2">Famous for: {topVendor.famousFor}</div>
                                        <div className="text-xl font-semibold text-green-800">Total Sales: {topVendor.sales}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherVendors.map((vendor, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-green-100 flex flex-col items-center p-6">
                                    <Image src={vendor.image} alt={vendor.name} width={80} height={80} className="rounded-full shadow-md object-cover mb-4" />
                                    <h4 className="text-xl font-bold text-gray-800 mb-1">{vendor.name}</h4>
                                    <div className="text-sm text-gray-600 mb-1">{vendor.location}</div>
                                    <div className="text-sm text-green-700 mb-2">Famous for: {vendor.famousFor}</div>
                                    <div className="text-md font-semibold text-orange-700">Sales: {vendor.sales}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
} 