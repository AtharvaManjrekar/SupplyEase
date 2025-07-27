"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../home/components/Header";
export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("Failed to fetch products");
                const data = await res.json();
                setProducts(data.products || []);
            } catch (err) {
                setProducts([
                    {
                        title: "Sample Bhaji",
                        vendor: "Vendor A",
                        image: "/placeholder.svg",
                        price: "₹50/kg",
                        description: "Fresh and organic bhaji from local farms.",
                    },
                    {
                        title: "Organic Tomatoes",
                        vendor: "Vendor B",
                        image: "/placeholder.svg",
                        price: "₹40/kg",
                        description: "Juicy, ripe tomatoes for your kitchen.",
                    },

                    {
                        title: "Organic Tomatoes",
                        vendor: "Vendor B",
                        image: "/placeholder.svg",
                        price: "₹40/kg",
                        description: "Juicy, ripe tomatoes for your kitchen.",
                    },
                    {
                        title: "Organic Tomatoes",
                        vendor: "Vendor B",
                        image: "/placeholder.svg",
                        price: "₹40/kg",
                        description: "Juicy, ripe tomatoes for your kitchen.",
                    },
                ]);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <section className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Header />
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 mt-10">
                        Our <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">Products</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Explore a wide range of fresh vegetables and produce from trusted vendors.
                    </p>
                </div>
                {loading ? (
                    <div className="text-center text-gray-500">Loading products...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product, idx) => (
                            <div
                                key={idx}
                                className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-green-100"
                            >
                                <div className="relative">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.title}
                                        width={200}
                                        height={150}
                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                                    <div className="text-sm text-gray-600 mb-3">by {product.vendor}</div>
                                    <div className="text-lg text-green-600 font-semibold mb-2">{product.price}</div>
                                    <div className="text-gray-500 text-sm mb-4">{product.description}</div>
                                    <button className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
} 