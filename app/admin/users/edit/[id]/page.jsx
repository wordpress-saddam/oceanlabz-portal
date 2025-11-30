"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, cookieUtils, validateEmail, validatePassword } from "@/lib/api";

export default function EditUser({ params }) {
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "subscriber",
        services: []
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [success, setSuccess] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        // Handle params which might be a Promise in Next.js 15+
        const loadParams = async () => {
            const resolvedParams = await Promise.resolve(params);
            const id = resolvedParams.id;
            setUserId(id);

            try {
                const token = cookieUtils.get('token');

                if (!token) {
                    setSubmitError("Not authenticated. Please login.");
                    setUserNotFound(true);
                    setLoadingUser(false);
                    return;
                }

                const response = await authApi.getUserById(id, token);

                if (response.success) {
                    setFormData({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        password: "",
                        role: response.data.user.role,
                        services: []
                    });
                } else {
                    setUserNotFound(true);
                }
            } catch (err) {
                setSubmitError(err.message || "Failed to load user");
                setUserNotFound(true);
            } finally {
                setLoadingUser(false);
            }
        };

        loadParams();
    }, [params]);

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
        setSubmitError("");
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

        // Password is optional for updates
        if (formData.password && !validatePassword(formData.password)) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const token = cookieUtils.get('token');

            if (!token) {
                setSubmitError("Not authenticated. Please login.");
                setIsLoading(false);
                return;
            }

            // Prepare update data (only include password if it's set)
            const updateData = {
                name: formData.name,
                email: formData.email,
                role: formData.role
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            const response = await authApi.updateUser(userId, updateData, token);

            if (response.success) {
                setSuccess(true);
                // Redirect to users list after short delay
                setTimeout(() => {
                    router.push("/admin/users");
                }, 1000);
            } else {
                setSubmitError(response.message || "Failed to update user");
                setIsLoading(false);
            }
        } catch (err) {
            setSubmitError(err.message || "Failed to update user. Please try again.");
            setIsLoading(false);
        }
    };

    if (loadingUser) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-4xl mb-4 animate-spin">⏳</div>
                    <p className="text-[#9a9a9a]">Loading user data...</p>
                </div>
            </div>
        );
    }

    if (userNotFound) {
        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-8 border border-[#3a3a3a] text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
                    <p className="text-[#9a9a9a] mb-6">The user you're looking for doesn't exist.</p>
                    <Link
                        href="/admin/users"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 smooth-transition"
                    >
                        Back to Users
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Edit User</h1>
                    <p className="text-[#9a9a9a]">Update user account information</p>
                </div>
                <Link
                    href="/admin/users"
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition"
                >
                    ← Back to Users
                </Link>
            </div>

            {/* Success Message */}
            {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-slideUp">
                    <p className="text-green-400 flex items-center gap-2">
                        <span>✓</span>
                        User updated successfully! Redirecting...
                    </p>
                </div>
            )}

            {/* Error Message */}
            {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-slideUp">
                    <p className="text-red-400 flex items-center gap-2">
                        <span>⚠️</span>
                        {submitError}
                    </p>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-8 border border-[#3a3a3a] animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full bg-[#0a0a0a] border ${errors.name ? "border-red-500" : "border-[#3a3a3a]"
                                } rounded-lg px-4 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-blue-500 smooth-transition`}
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full bg-[#0a0a0a] border ${errors.email ? "border-red-500" : "border-[#3a3a3a]"
                                } rounded-lg px-4 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-blue-500 smooth-transition`}
                            placeholder="john@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Password (leave blank to keep current)
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full bg-[#0a0a0a] border ${errors.password ? "border-red-500" : "border-[#3a3a3a]"
                                } rounded-lg px-4 py-3 text-white placeholder-[#6a6a6a] focus:outline-none focus:border-blue-500 smooth-transition`}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                        )}
                        <p className="text-[#6a6a6a] text-xs mt-1">Minimum 8 characters (optional)</p>
                    </div>

                    {/* Role Field */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Role *
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 smooth-transition appearance-none cursor-pointer"
                        >
                            <option value="subscriber">Subscriber</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    {/* Services Multi-Select */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Services
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg cursor-pointer hover:border-[#4a4a4a] smooth-transition">
                                <input
                                    type="checkbox"
                                    checked={(formData.services || []).includes('audio-player')}
                                    onChange={(e) => {
                                        const services = formData.services || [];
                                        if (e.target.checked) {
                                            setFormData(prev => ({
                                                ...prev,
                                                services: [...services, 'audio-player']
                                            }));
                                        } else {
                                            setFormData(prev => ({
                                                ...prev,
                                                services: services.filter(s => s !== 'audio-player')
                                            }));
                                        }
                                    }}
                                    className="w-4 h-4 accent-blue-600"
                                />
                                <span className="text-white">🎵 Audio Player</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg cursor-pointer hover:border-[#4a4a4a] smooth-transition">
                                <input
                                    type="checkbox"
                                    checked={(formData.services || []).includes('location-tracker')}
                                    onChange={(e) => {
                                        const services = formData.services || [];
                                        if (e.target.checked) {
                                            setFormData(prev => ({
                                                ...prev,
                                                services: [...services, 'location-tracker']
                                            }));
                                        } else {
                                            setFormData(prev => ({
                                                ...prev,
                                                services: services.filter(s => s !== 'location-tracker')
                                            }));
                                        }
                                    }}
                                    className="w-4 h-4 accent-blue-600"
                                />
                                <span className="text-white">📍 Location Tracker</span>
                            </label>
                        </div>
                        <p className="text-[#6a6a6a] text-xs mt-2">Select one or more services to assign</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 smooth-transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Updating User...
                                </span>
                            ) : success ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span>✓</span>
                                    User Updated
                                </span>
                            ) : (
                                "Update User"
                            )}
                        </button>
                        <Link
                            href="/admin/users"
                            className="px-8 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
