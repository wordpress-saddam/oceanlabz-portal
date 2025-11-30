"use client";

import { useState, useEffect } from "react";
import { authApi, cookieUtils } from "@/lib/api";

export default function UserProfileModal({ isOpen, onClose, userId, onUpdate }) {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        services: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            loadUserData();
        }
    }, [isOpen, userId]);

    const loadUserData = async () => {
        setLoading(true);
        try {
            const token = cookieUtils.get('token');
            if (!token) {
                setError("Not authenticated");
                setLoading(false);
                return;
            }

            const response = await authApi.getUserById(userId, token);

            if (response.success) {
                setUser(response.data.user);
                setFormData({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    password: "",
                    services: response.data.user.services || []
                });
            } else {
                setError("Failed to load user data");
            }
        } catch (err) {
            setError(err.message || "Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");

        try {
            const token = cookieUtils.get('token');
            if (!token) {
                setError("Not authenticated");
                setSaving(false);
                return;
            }

            // Prepare update data
            const updateData = {
                name: formData.name,
                email: formData.email,
                role: user.role // Keep the same role
            };

            // Only include password if it's set
            if (formData.password) {
                updateData.password = formData.password;
            }

            const response = await authApi.updateUser(userId, updateData, token);

            if (response.success) {
                setSuccess(true);
                const updatedUser = response.data.user;
                setUser(updatedUser);
                setIsEditing(false);

                // Notify parent component about update
                if (onUpdate) {
                    onUpdate(updatedUser);
                }

                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
            } else {
                setError(response.message || "Failed to update profile");
            }
        } catch (err) {
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 shadow-2xl animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">My Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-[#9a9a9a] hover:text-white smooth-transition text-2xl"
                    >
                        ×
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4 animate-spin">⏳</div>
                        <p className="text-[#9a9a9a]">Loading profile...</p>
                    </div>
                ) : (
                    <>
                        {/* Success Message */}
                        {success && (
                            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-green-400 text-sm flex items-center gap-2">
                                    <span>✓</span>
                                    Profile updated successfully!
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm flex items-center gap-2">
                                    <span>⚠️</span>
                                    {error}
                                </p>
                            </div>
                        )}

                        {!isEditing ? (
                            // View Mode
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[#9a9a9a] text-sm mb-1">Name</p>
                                    <p className="text-white font-medium">{user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[#9a9a9a] text-sm mb-1">Email</p>
                                    <p className="text-white font-medium">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-[#9a9a9a] text-sm mb-1">Role</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user?.role === 'admin'
                                        ? 'bg-purple-500/20 text-purple-400'
                                        : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {user?.role === 'admin' ? 'Administrator' : 'Subscriber'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[#9a9a9a] text-sm mb-2">Services</p>
                                    <div className="flex flex-wrap gap-2">
                                        {user?.services && user.services.length > 0 ? (
                                            user.services.map(service => (
                                                <span
                                                    key={service}
                                                    className="px-3 py-1 bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg text-sm text-white"
                                                >
                                                    {service === 'audio-player' ? '🎵 Audio Player' : '📍 Location Tracker'}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-[#6a6a6a] text-sm">No services assigned</p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 smooth-transition"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            // Edit Mode
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 smooth-transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 smooth-transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                        Password (optional)
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current"
                                        className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 smooth-transition"
                                    />
                                </div>

                                {/* Services are read-only in profile edit */}
                                <div>
                                    <p className="text-[#9a9a9a] text-sm mb-2">Services (Contact admin to change)</p>
                                    <div className="flex flex-wrap gap-2 opacity-70">
                                        {user?.services && user.services.length > 0 ? (
                                            user.services.map(service => (
                                                <span
                                                    key={service}
                                                    className="px-3 py-1 bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg text-sm text-white"
                                                >
                                                    {service === 'audio-player' ? '🎵 Audio Player' : '📍 Location Tracker'}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-[#6a6a6a] text-sm">No services assigned</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 smooth-transition disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: user.name,
                                                email: user.email,
                                                password: "",
                                                services: user.services || []
                                            });
                                            setError("");
                                        }}
                                        className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
