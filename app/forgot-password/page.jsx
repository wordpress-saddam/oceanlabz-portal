"use client";

import { useState } from "react";
import Link from "next/link";
import { authApi, validateEmail } from "@/lib/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resetLink, setResetLink] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!email) {
            setError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Invalid email format");
            return;
        }

        setIsLoading(true);

        try {
            const result = await authApi.forgotPassword(email);

            if (result.success) {
                setResetLink(result.data.reset_url);
                setSuccess(true);
            }
        } catch (err) {
            setError(err.message || "Failed to send reset link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8 animate-slideUp">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                        OceanLabz
                    </h1>
                    <p className="text-[#9a9a9a]">Reset Your Password</p>
                </div>

                {/* Forgot Password Card */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-8 border border-[#3a3a3a] shadow-2xl animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    {!success ? (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
                            <p className="text-[#9a9a9a] text-sm mb-6">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📧</span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError("");
                                            }}
                                            className={`w-full bg-[#0a0a0a] border ${error ? "border-red-500" : "border-[#3a3a3a]"
                                                } rounded-lg px-12 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-blue-500 smooth-transition`}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    {error && (
                                        <p className="text-red-400 text-xs mt-1">{error}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">✅</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
                            <p className="text-[#9a9a9a] text-sm">
                                We've sent a password reset link to <span className="text-white font-medium">{email}</span>
                            </p>

                            {/* Show reset link for testing */}
                            <div className="mt-6 p-4 bg-[#0a0a0a]/50 rounded-lg border border-[#3a3a3a]">
                                <p className="text-xs text-[#6a6a6a] mb-2">For testing purposes, here's your reset link:</p>
                                <Link
                                    href={resetLink}
                                    className="text-sm text-blue-400 hover:text-blue-300 break-all"
                                >
                                    {resetLink}
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="text-sm text-[#9a9a9a] hover:text-white smooth-transition"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
