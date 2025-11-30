"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, cookieUtils, validateEmail, validatePassword } from "@/lib/api";

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "subscriber"
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [signupError, setSignupError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        setSignupError("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setSignupError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await authApi.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                role: formData.role
            });

            if (result.success) {
                const { user, access_token } = result.data;

                // Auto-login: Set cookies for authentication
                cookieUtils.set('token', access_token, 1);
                cookieUtils.set('role', user.role, 1);
                cookieUtils.set('userName', user.name, 1);

                // Redirect based on role
                if (user.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            }
        } catch (error) {
            setSignupError(error.message || "Registration failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center p-4 animate-fadeIn">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
            </div>

            {/* Signup Card */}
            <div className="relative w-full max-w-md animate-slideUp">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-8 shadow-2xl backdrop-blur-xl">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
                            Join OceanLabz
                        </h1>
                        <p className="text-[#9a9a9a]">Create your account</p>
                    </div>

                    {/* Signup Error */}
                    {signupError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-slideUp">
                            <p className="text-red-400 text-sm flex items-center gap-2">
                                <span>⚠️</span>
                                {signupError}
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">👤</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0a0a0a] border ${errors.name ? "border-red-500" : "border-[#3a3a3a]"
                                        } rounded-lg px-12 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-purple-500 smooth-transition`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📧</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0a0a0a] border ${errors.email ? "border-red-500" : "border-[#3a3a3a]"
                                        } rounded-lg px-12 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-purple-500 smooth-transition`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔒</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0a0a0a] border ${errors.password ? "border-red-500" : "border-[#3a3a3a]"
                                        } rounded-lg px-12 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-purple-500 smooth-transition`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔐</span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0a0a0a] border ${errors.confirmPassword ? "border-red-500" : "border-[#3a3a3a]"
                                        } rounded-lg px-12 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-purple-500 smooth-transition`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                Account Type
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🎭</span>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-12 py-3 text-white focus:outline-none focus:border-purple-500 smooth-transition appearance-none cursor-pointer"
                                >
                                    <option value="subscriber">Subscriber</option>
                                    <option value="admin">Administrator</option>
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a6a6a] pointer-events-none">▼</span>
                            </div>
                        </div>

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 smooth-transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-[#3a3a3a]"></div>
                        <span className="text-[#6a6a6a] text-sm">OR</span>
                        <div className="flex-1 h-px bg-[#3a3a3a]"></div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-[#9a9a9a]">
                        Already have an account?{" "}
                        <Link href="/login" className="text-purple-500 hover:text-purple-400 smooth-transition font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
