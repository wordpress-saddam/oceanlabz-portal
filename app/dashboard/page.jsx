"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfileModal from "@/components/UserProfileModal";

export default function Dashboard() {
    const router = useRouter();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        // Get user ID from cookie
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];
            if (token && token.startsWith('dummy-token-')) {
                const id = parseInt(token.replace('dummy-token-', ''));
                setCurrentUserId(id);
            }
        }
    }, []);

    const handleLogout = () => {
        // Clear all authentication cookies
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
        document.cookie = "userName=; path=/; max-age=0";

        // Redirect to login page
        router.push("/login");
    };
    const stats = [
        {
            title: "Active Services",
            value: "3",
            icon: "⚙️",
            color: "from-blue-500 to-blue-600"
        },
        {
            title: "Current Plan",
            value: "Gold",
            icon: "💎",
            color: "from-yellow-500 to-yellow-600"
        },
        {
            title: "Usage This Month",
            value: "78%",
            icon: "📊",
            color: "from-green-500 to-green-600"
        },
        {
            title: "Support Tickets",
            value: "2",
            icon: "🎫",
            color: "from-purple-500 to-purple-600"
        }
    ];

    const services = [
        { name: "Web Hosting", status: "Active", lastUpdate: "2 hours ago" },
        { name: "Email Service", status: "Active", lastUpdate: "1 day ago" },
        { name: "Cloud Storage", status: "Active", lastUpdate: "3 days ago" }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8 animate-fadeIn">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Subscriber Dashboard</h1>
                        <p className="text-[#9a9a9a]">Welcome back! Here's your account overview.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white smooth-transition font-medium hover:shadow-lg hover:shadow-red-500/20"
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.title}
                            className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a] hover:border-[#4a4a4a] smooth-transition hover:scale-105 cursor-pointer animate-slideUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg mb-4`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-[#9a9a9a] text-sm mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Services */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a] animate-slideUp" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span>⚙️</span>
                            Your Services
                        </h2>
                        <div className="space-y-4">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a]/50 hover:bg-[#2a2a2a] smooth-transition border border-transparent hover:border-[#4a4a4a]"
                                >
                                    <div>
                                        <p className="text-white font-medium">{service.name}</p>
                                        <p className="text-[#9a9a9a] text-sm">Last updated: {service.lastUpdate}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                        {service.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 smooth-transition">
                            Manage Services
                        </button>
                    </div>

                    {/* Profile & Quick Actions */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a] animate-slideUp" style={{ animationDelay: '0.5s' }}>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span>👤</span>
                                Profile
                            </h2>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                                    JS
                                </div>
                                <h3 className="text-white font-medium">John Subscriber</h3>
                                <p className="text-[#9a9a9a] text-sm">user@oceanlabz.com</p>
                                <div className="mt-4 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                                    Gold Plan
                                </div>
                            </div>
                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="w-full mt-6 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-2 rounded-lg smooth-transition"
                            >
                                Edit Profile
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a] animate-slideUp" style={{ animationDelay: '0.6s' }}>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span>⚡</span>
                                Quick Actions
                            </h2>
                            <div className="space-y-3">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg smooth-transition flex items-center gap-3 font-medium">
                                    <span>📧</span>
                                    Contact Support
                                </button>
                                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg smooth-transition flex items-center gap-3 font-medium">
                                    <span>💳</span>
                                    Billing
                                </button>
                                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg smooth-transition flex items-center gap-3 font-medium">
                                    <span>📊</span>
                                    View Reports
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Profile Modal */}
            <UserProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                userId={currentUserId}
            />
        </div>
    );
}
