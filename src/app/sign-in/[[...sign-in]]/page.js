"use client"

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "@/store/slices/userSlice";
import { ShoppingCart, Users, Truck, Star, Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    if (!isLoaded) {
      setError("Please wait while we load the authentication system...");
      return;
    }

    try {
      setLocalLoading(true);
      setError("");
      setSuccess("");

      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard"
      });
    } catch (err) {
      console.error("Error signing in with Google:", err);
      setError("Failed to sign in with Google. Please try again.");
      setLocalLoading(false);
    }
  };

  const fetchUserFromMongoDB = async (clerkId) => {
    try {
      const response = await fetch(`/api/users/${clerkId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");
    setSuccess("");
    dispatch(setLoading(true));

    if (!isLoaded) {
      setError("Please wait while we load the authentication system...");
      setLocalLoading(false);
      dispatch(setLoading(false));
      return;
    }

    // Comprehensive validation
    const validationErrors = [];
    
    // Check required fields
    if (!email.trim()) {
      validationErrors.push("Email is required");
    }
    if (!password) {
      validationErrors.push("Password is required");
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      validationErrors.push("Please enter a valid email address");
    }
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      setLocalLoading(false);
      dispatch(setLoading(false));
      return;
    }

    try {
      // Log attempt for debugging
      const timestamp = new Date().toISOString();
      console.log("==== Sign-in Debug Information ====");
      console.log(JSON.stringify({
        timestamp,
        email, // Don't log password
        userAgent: navigator.userAgent,
        windowLocation: window.location.href
      }, null, 2));
      console.log("=================================");

      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        try {
          // Fetch user data from MongoDB
          const mongoUser = await fetchUserFromMongoDB(result.userId);
          
          if (!mongoUser) {
            setError("User account not found. Please contact support.");
            setLocalLoading(false);
            dispatch(setLoading(false));
            return;
          }

          // Check if user role is valid
          if (!['vendor', 'distributor', 'admin'].includes(mongoUser.role)) {
            setError("Invalid user role. Please contact support.");
            setLocalLoading(false);
            dispatch(setLoading(false));
            return;
          }

          // Store complete user data in Redux
          dispatch(setUser(mongoUser));
          
          setSuccess("Sign in successful! Redirecting...");
          // Log successful sign-in
          console.log("Sign-in successful:", {
            timestamp: new Date().toISOString(),
            userId: result.userId,
            sessionId: result.sessionId,
            role: mongoUser.role
          });
          
          router.push("/dashboard");
        } catch (mongoError) {
          console.error("Error fetching user data from MongoDB:", mongoError);
          setError("Error loading user data. Please try again.");
          setLocalLoading(false);
          dispatch(setLoading(false));
        }
      } else if (result.status === "needs_verification") {
        setError("Please verify your email address before signing in.");
        setLocalLoading(false);
        dispatch(setLoading(false));
      } else {
        console.error("Unexpected sign-in status:", result.status);
        setError("Something went wrong. Please try again.");
        setLocalLoading(false);
        dispatch(setLoading(false));
      }
    } catch (err) {
      console.error("Detailed sign-in error:", {
        name: err.name,
        message: err.message,
        code: err.code,
        errors: err.errors,
        stack: err.stack
      });
      
      // Comprehensive error handling
      let errorMessage = "Failed to sign in. Please check your credentials.";
      
      // Handle different types of errors
      if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        // Clerk validation errors
        errorMessage = err.errors[0].message;
      } else if (err.message) {
        // General error with message
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        // String error
        errorMessage = err;
      } else if (err.status) {
        // HTTP status error
        switch (err.status) {
          case 400:
            errorMessage = "Invalid credentials. Please check your email and password.";
            break;
          case 401:
            errorMessage = "Invalid email or password. Please try again.";
            break;
          case 403:
            errorMessage = "Account is locked. Please contact support.";
            break;
          case 404:
            errorMessage = "Account not found. Please check your email or sign up.";
            break;
          case 422:
            errorMessage = "Invalid email format. Please check your email address.";
            break;
          case 429:
            errorMessage = "Too many sign-in attempts. Please wait a moment and try again.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = `Error ${err.status}: ${err.message || 'Sign-in failed'}`;
        }
      } else if (err.code) {
        // Error with code
        switch (err.code) {
          case 'NETWORK_ERROR':
            errorMessage = "Network error. Please check your internet connection.";
            break;
          case 'TIMEOUT':
            errorMessage = "Request timed out. Please try again.";
            break;
          case 'INVALID_EMAIL':
            errorMessage = "Please enter a valid email address.";
            break;
          case 'INVALID_PASSWORD':
            errorMessage = "Invalid password. Please try again.";
            break;
          case 'ACCOUNT_NOT_FOUND':
            errorMessage = "No account found with this email. Please sign up.";
            break;
          case 'ACCOUNT_LOCKED':
            errorMessage = "Account is temporarily locked. Please try again later.";
            break;
          case 'EMAIL_NOT_VERIFIED':
            errorMessage = "Please verify your email address before signing in.";
            break;
          default:
            errorMessage = `Error: ${err.message || 'Sign-in failed'}`;
        }
      }
      
      // Log detailed error for debugging
      console.error("Detailed sign-in error:", {
        error: err,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        email: email // Log email for debugging (without password)
      });
      
      setError(errorMessage);
      dispatch(setLoading(false));
    } finally {
      setLocalLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Branding & Info */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <Link href="/home" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200 cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                EaseSupply
              </span>
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Welcome Back to
              <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent block">
                EaseSupply
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sign in to access your dashboard and continue managing your vegetable supply business with ease.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-800">500+ Active Users</h3>
                <p className="text-sm text-gray-600">Join our growing community</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-orange-100">
              <Truck className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Efficient logistics network</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100">
              <Star className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Quality Assured</h3>
                <p className="text-sm text-gray-600">Fresh vegetables guaranteed</p>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Custom Sign In Form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                <p className="text-gray-600 mt-2">Welcome back to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 ml-3">
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 ml-3">
                        <p className="text-sm font-medium">{success}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <Link 
                    href="/forgot-password"
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}