"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi, validatePassword } from "@/lib/api";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [resetError, setResetError] = useState("");
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const tokenParam = searchParams.get('token');

        if (!emailParam || !tokenParam) {
            setResetError("Invalid reset link. Please request a new password reset.");
        } else {
            setEmail(emailParam);
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        setResetError("");
    };

    const validateForm = () => {
        const newErrors = {};

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResetError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await authApi.resetPassword(
                email,
                token,
                formData.password,
                formData.confirmPassword
            );

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            }
        } catch (err) {
            setResetError(err.message || "Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!email || !token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
                    <p className="text-[#9a9a9a] mb-6">This password reset link is invalid or has expired.</p>
                    <Link
                        href="/forgot-password"
                        className="text-blue-400 hover:text-blue-300"
                    >
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8 animate-slideUp">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                        OceanLabz
                    </h1>
                    <p className="text-[#9a9a9a]">Create New Password</p>
                </div>

                {/* Reset Password Card */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-8 border border-[#3a3a3a] shadow-2xl animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    {!success ? (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                            <p className="text-[#9a9a9a] text-sm mb-6">
                                Enter your new password below.
                            </p>

                            {resetError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                    <p className="text-red-400 text-sm">{resetError}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                        New Password
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
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔒</span>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full bg-[#0a0a0a] border ${errors.confirmPassword ? "border-red-500" : "border-[#3a3a3a]"
                                                } rounded-lg px-12 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-blue-500 smooth-transition`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">✅</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Password Reset Successful!</h2>
                            <p className="text-[#9a9a9a] text-sm">
                                Your password has been reset successfully. Redirecting to login...
                            </p>
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

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Loading...</h2>
                    <p className="text-[#9a9a9a] mb-6">Please wait while we load your data.</p>
                </div>
            </div>
        }>
            <ResetPasswordComponent />
        </Suspense>
    );
}