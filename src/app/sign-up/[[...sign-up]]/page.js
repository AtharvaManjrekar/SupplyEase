"use client"

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ShoppingCart, Users, Truck, Star, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "vendor", // Add role field with default
  });
  const [selectedRole, setSelectedRole] = useState("vendor");
  const ROLE_TYPES = ["vendor", "distributor"];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: verification
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState(null);

  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) {
      setError("Please wait while we load the authentication system...");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard"
      });
    } catch (err) {
      console.error("Error signing up with Google:", err);
      setError("Failed to sign up with Google. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Comprehensive validation
    const validationErrors = [];
    
    // Check required fields
    if (!formData.firstName.trim()) {
      validationErrors.push("First name is required");
    }
    if (!formData.lastName.trim()) {
      validationErrors.push("Last name is required");
    }
    if (!formData.email.trim()) {
      validationErrors.push("Email is required");
    }
    if (!formData.password) {
      validationErrors.push("Password is required");
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      validationErrors.push("Please enter a valid email address");
    }
    
    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
        validationErrors.push("Password must be at least 8 characters long");
      }
      if (!/(?=.*[a-z])/.test(formData.password)) {
        validationErrors.push("Password must contain at least one lowercase letter");
      }
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        validationErrors.push("Password must contain at least one uppercase letter");
      }
      if (!/(?=.*\d)/.test(formData.password)) {
        validationErrors.push("Password must contain at least one number");
      }
    }
    
    // Password confirmation
    if (!formData.confirmPassword) {
      validationErrors.push("Please confirm your password");
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.push("Passwords do not match");
    }
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      setLoading(false);
      return;
    }

    if (!isLoaded) {
      setError("Please wait while we load the authentication system...");
      setLoading(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      // Add timestamp to logging
      const timestamp = new Date().toISOString();
      
      // Log debug information to console only
      const logMessage = `[${timestamp}] Starting sign-up process for ${formData.email}`;
      console.log(logMessage);

      // Detailed debug information
      console.log("==== Sign-up Debug Information ====");
      console.log(JSON.stringify({
        timestamp,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        hasPassword: !!formData.password,
        userAgent: navigator.userAgent,
        windowLocation: window.location.href
      }, null, 2));
      console.log("=================================");

      // Create the sign-up object
      const signUpData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        password: formData.password
      };

      const result = await signUp.create(signUpData);

      console.log("Clerk sign-up response:", {
        status: result.status,
        createdSessionId: result.createdSessionId,
        createdUserId: result.createdUserId,
        emailVerified: result?.emailAddress?.verified
      });

      if (result.status === "complete") {
        setSuccess("Account created successfully! Redirecting to dashboard...");
        router.push("/dashboard");
      } else if (result.status === "missing_requirements") {
        // Prepare email verification before showing the verification step
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setStep(2);
        setSuccess("Please check your email to verify your account.");
      } else {
        console.log("Unexpected sign-up status:", result.status);
        setError("Unexpected response from authentication service. Please try again.");
      }
    } catch (err) {
      console.error("Detailed sign-up error:", {
        name: err.name,
        message: err.message,
        code: err.code,
        errors: err.errors,
        stack: err.stack
      });

      let errorMessage = "Failed to create account. Please try again.";

      if (err.errors && Array.isArray(err.errors)) {
        const errors = err.errors.map(e => ({
          code: e.code,
          message: e.message,
          longMessage: e.longMessage,
          meta: e.meta
        }));
        console.log("Validation errors:", errors);
        
        // Handle specific error codes
        const firstError = err.errors[0];
        switch(firstError?.code) {
          case "form_password_pwned":
            errorMessage = "This password has been found in a data breach. Please choose a different password.";
            break;
          case "form_password_too_weak":
            errorMessage = "Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.";
            break;
          case "form_identifier_exists":
            errorMessage = "An account with this email already exists.";
            break;
          case "form_param_nil":
            errorMessage = "Please fill in all required fields.";
            break;
          case "form_param_invalid":
            errorMessage = firstError.message || "Invalid input provided. Please check your information.";
            break;
          default:
            errorMessage = firstError?.message || "Validation error occurred. Please check your information.";
        }
      } else if (err.code) {
        switch(err.code) {
          case "network_error":
            errorMessage = "Network error. Please check your internet connection.";
            break;
          case "client_rate_limited":
            errorMessage = "Too many attempts. Please wait a moment and try again.";
            break;
          default:
            errorMessage = `Error: ${err.message || "Unknown error occurred"}`;
        }
      }

      setError(errorMessage);
      setLastError(err);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: e.target.code.value,
      });

      if (result.status === "complete") {
        // Create user in MongoDB after successful verification
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clerkId: result.createdUserId,
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              role: selectedRole,
              imageUrl: result.imageUrl || '',
              createdAt: new Date(),
              updatedAt: new Date()
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create user profile');
          }

          setSuccess("Account created successfully! Redirecting to dashboard...");
          router.push("/dashboard");
        } catch (error) {
          console.error("Error creating user profile:", error);
          setError("Account verified but failed to create profile. Please contact support.");
          // You might want to handle this error differently since the Clerk account is already created
        }
      }
    } catch (err) {
      console.error("Error verifying email:", err);
      
      // Comprehensive error handling for email verification
      let errorMessage = "Failed to verify email. Please try again.";
      
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
            errorMessage = "Invalid verification code. Please check and try again.";
            break;
          case 401:
            errorMessage = "Verification failed. Please try again.";
            break;
          case 403:
            errorMessage = "Access denied. Please contact support.";
            break;
          case 404:
            errorMessage = "Verification code not found. Please request a new one.";
            break;
          case 422:
            errorMessage = "Invalid verification code format.";
            break;
          case 429:
            errorMessage = "Too many verification attempts. Please wait and try again.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = `Error ${err.status}: ${err.message || 'Verification failed'}`;
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
          case 'INVALID_CODE':
            errorMessage = "Invalid verification code. Please check and try again.";
            break;
          case 'EXPIRED_CODE':
            errorMessage = "Verification code has expired. Please request a new one.";
            break;
          default:
            errorMessage = `Error: ${err.message || 'Verification failed'}`;
        }
      }
      
      // Log detailed error for debugging
      console.error("Detailed email verification error:", {
        error: err,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
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
              Join the
              <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent block">
                EaseSupply
              </span>
              Community
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Connect with fresh vegetable vendors and street food sellers. Create your account to start building your supply network today.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">500+ Vendors</h3>
                <p className="text-gray-600 text-sm">Connect with verified vegetable suppliers</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Daily Fresh Delivery</h3>
                <p className="text-gray-600 text-sm">Get fresh produce delivered to your doorstep</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Quality Assured</h3>
                <p className="text-gray-600 text-sm">All vendors are verified and quality-checked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                <p className="text-gray-600 mt-2">Join thousands of vendors and buyers</p>
              </div>

              {step === 1 ? (
                <>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                            placeholder="Enter last name"
                            required
                          />
                        </div>
                      </div>
                    </div>

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
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
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
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                          placeholder="Create a strong password"
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

                    {/* Confirm Password Field */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                        I am a
                      </label>
                      <div className="flex gap-4">
                        {ROLE_TYPES.map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setSelectedRole(role)}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2
                            ${selectedRole === role ? "bg-green-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                          >
                            {role === "vendor" ? (
                              <Users className="w-5 h-5" />
                            ) : (
                              <Truck className="w-5 h-5" />
                            )}
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {success && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
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
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Sign Up Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={handleGoogleSignUp}
                      disabled={loading || !isLoaded}
                      className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      <span>{loading ? "Signing up..." : "Continue with Google"}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Email Verification Step */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Verify Your Email</h3>
                    <p className="text-gray-600">
                      We've sent a verification code to <span className="font-medium">{formData.email}</span>
                    </p>
                  </div>

                  <form onSubmit={handleEmailVerification} className="space-y-6">
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <input
                        id="code"
                        name="code"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                        placeholder="Enter 6-digit code"
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    {success && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        <p className="text-sm">{success}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        "Verify Email"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300"
                    >
                      Back to Sign Up
                    </button>
                  </form>
                </>
              )}

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    href="/sign-in" 
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-green-400/20 to-orange-400/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-green-300/30 to-blue-300/30 rounded-full animate-pulse delay-500"></div>
    </div>
  );
}
