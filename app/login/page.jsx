"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, cookieUtils, validateEmail } from "@/lib/api";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        setLoginError("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await authApi.login(formData.email, formData.password);

            if (result.success) {
                const { user, access_token } = result.data;

                // Set cookies for authentication
                cookieUtils.set('token', access_token, formData.rememberMe ? 7 : 1);
                cookieUtils.set('role', user.role, formData.rememberMe ? 7 : 1);
                cookieUtils.set('userName', user.name, formData.rememberMe ? 7 : 1);

                // Redirect based on role
                if (user.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            }
        } catch (error) {
            setLoginError(error.message || "Invalid email or password");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center p-4 animate-fadeIn">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md animate-slideUp">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-8 shadow-2xl backdrop-blur-xl">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                            OceanLabz
                        </h1>
                        <p className="text-[#9a9a9a]">Sign in to your account</p>
                    </div>

                    {/* Login Error */}
                    {loginError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-slideUp">
                            <p className="text-red-400 text-sm flex items-center gap-2">
                                <span>⚠️</span>
                                {loginError}
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
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
                                        } rounded-lg px-12 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-blue-500 smooth-transition`}
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
                                        } rounded-lg px-12 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-blue-500 smooth-transition`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                            )}
                            <div className="text-right mt-2">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-blue-500 hover:text-blue-400 smooth-transition"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-[#3a3a3a] bg-[#0a0a0a] text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-[#9a9a9a]">Remember me</span>
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 smooth-transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-[#3a3a3a]"></div>
                        <span className="text-[#6a6a6a] text-sm">OR</span>
                        <div className="flex-1 h-px bg-[#3a3a3a]"></div>
                    </div>

                    {/* Signup Link */}
                    <p className="text-center text-[#9a9a9a]">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-500 hover:text-blue-400 smooth-transition font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
