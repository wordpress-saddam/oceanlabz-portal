"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { locationDeviceApi } from "@/lib/api";
import { authApi, cookieUtils } from "@/lib/api";

export default function AddDevicePage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        type: "Smartphone",
        user_id: "",
        status: "Active",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load users from API
        const fetchUsers = async () => {
            const token = cookieUtils.get('token');
            if (!token) {
                setError("Authentication required. Please login.");
                return;
            }

            try {
                const response = await authApi.getAllUsers(token);
                if (response.success && response.data.users) {
                    setUsers(response.data.users);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users");
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const token = cookieUtils.get('token');
        if (!token) {
            setError("Authentication required. Please login.");
            setLoading(false);
            return;
        }

        // Validation
        if (!formData.name.trim()) {
            setError("Device name is required");
            setLoading(false);
            return;
        }

        if (!formData.user_id) {
            setError("Please select a user");
            setLoading(false);
            return;
        }

        try {
            const response = await locationDeviceApi.create({
                name: formData.name,
                type: formData.type,
                user_id: parseInt(formData.user_id),
                status: formData.status,
            }, token);
            
            if (response.success) {
                setSuccess("Device added successfully!");
                // Redirect after 1.5 seconds
                setTimeout(() => {
                    router.push("/admin/services/location-tracker");
                }, 1500);
            }
        } catch (err) {
            console.error("Error adding device:", err);
            setError(err.message || "Failed to add device");
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
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                        <span className="text-4xl">📍</span>
                        Add New Device
                    </h1>
                    <p className="text-[#9a9a9a] text-sm">Register a new device for location tracking</p>
                </div>
                <Link
                    href="/admin/services/location-tracker"
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition text-sm"
                >
                    ← Back to Devices
                </Link>
            </div>

            {/* Form */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-8 border border-[#3a3a3a] max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <p className="text-red-400 text-sm">⚠️ {error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <p className="text-green-400 text-sm">✓ {success}</p>
                        </div>
                    )}

                    {/* Device Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Device Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., John's iPhone"
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 smooth-transition"
                        />
                    </div>

                    {/* Device Type */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Device Type *
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 smooth-transition"
                        >
                            <option value="Smartphone">📱 Smartphone</option>
                            <option value="Tablet">📲 Tablet</option>
                            <option value="Laptop">💻 Laptop</option>
                            <option value="GPS Tracker">🛰️ GPS Tracker</option>
                            <option value="Smartwatch">⌚ Smartwatch</option>
                        </select>
                    </div>

                    {/* Select User */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Assign to User *
                        </label>
                        <select
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 smooth-transition"
                        >
                            <option value="">Select a user...</option>
                            {users.length === 0 ? (
                                <option value="" disabled>Loading users...</option>
                            ) : (
                                users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))
                            )}
                        </select>
                        <p className="text-[#6a6a6a] text-xs mt-1">Select the user who will own this device</p>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Initial Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 smooth-transition"
                        >
                            <option value="Active">✅ Active</option>
                            <option value="Inactive">⏸️ Inactive</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Adding..." : "Add Device"}
                        </button>
                        <Link
                            href="/admin/services/location-tracker"
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
