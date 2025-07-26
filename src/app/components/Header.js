"use client"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

export default function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              EaseSupply
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/home" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Home
            </Link>
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
          <div className="flex items-center space-x-3">
            <SignedOut>
              <Link href="/sign-in">
                <button className="text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-2 rounded-full hover:bg-green-50">
                  Sign In
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
                  Sign Up
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "shadow-xl border border-gray-200",
                    userButtonPopoverActionButton: "hover:bg-green-50 text-gray-700",
                    userButtonPopoverActionButtonText: "text-gray-700",
                    userButtonPopoverFooter: "border-t border-gray-200",
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
} 