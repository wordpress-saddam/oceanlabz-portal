"use client";

import { useState, useEffect } from "react";
import { authApi, cookieUtils } from "@/lib/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        {
            title: "Total Users",
            value: "...",
            change: "+12.5%",
            trend: "up",
            icon: "👥",
            color: "from-blue-500 to-blue-600"
        },
        {
            title: "Revenue",
            value: "$45,231",
            change: "+23.1%",
            trend: "up",
            icon: "💰",
            color: "from-green-500 to-green-600"
        },
        {
            title: "Active Services",
            value: "156",
            change: "+8.2%",
            trend: "up",
            icon: "⚙️",
            color: "from-purple-500 to-purple-600"
        },
        {
            title: "New Signups",
            value: "89",
            change: "-3.4%",
            trend: "down",
            icon: "📈",
            color: "from-orange-500 to-orange-600"
        }
    ]);

    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = cookieUtils.get('token');
                if (token) {
                    const response = await authApi.getAllUsers(token);
                    if (response.success) {
                        const users = response.data.users;

                        // Update Total Users stat
                        setStats(prev => prev.map(stat =>
                            stat.title === "Total Users"
                                ? { ...stat, value: users.length.toLocaleString() }
                                : stat
                        ));

                        // Update Recent Activity with latest users
                        // Sort by ID descending (newest first) and take top 5
                        const recentUsers = [...users]
                            .sort((a, b) => b.id - a.id)
                            .slice(0, 5)
                            .map(user => ({
                                user: user.name,
                                action: `Joined as ${user.role}`,
                                time: new Date(user.created_at || Date.now()).toLocaleDateString(),
                                avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                            }));

                        setRecentActivity(recentUsers);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const quickActions = [
        { title: "Add New User", icon: "➕", color: "bg-blue-600 hover:bg-blue-700" },
        { title: "View Reports", icon: "📊", color: "bg-purple-600 hover:bg-purple-700" },
        { title: "Manage Plans", icon: "💳", color: "bg-green-600 hover:bg-green-700" },
        { title: "Settings", icon: "⚙️", color: "bg-orange-600 hover:bg-orange-700" }
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-[#9a9a9a]">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={stat.title}
                        className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a] hover:border-[#4a4a4a] smooth-transition hover:scale-105 hover:shadow-2xl cursor-pointer animate-slideUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                                {stat.icon}
                            </div>
                            <span className={`text-sm font-medium px-2 py-1 rounded ${stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-[#9a9a9a] text-sm mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity (Now showing Active Users) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a] animate-slideUp" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span>👥</span>
                        Recent Users
                    </h2>
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="text-center py-8 text-[#9a9a9a]">
                                <span className="animate-spin inline-block mr-2">⏳</span>
                                Loading users...
                            </div>
                        ) : recentActivity.length > 0 ? (
                            recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 rounded-lg bg-[#0a0a0a]/50 hover:bg-[#2a2a2a] smooth-transition border border-transparent hover:border-[#4a4a4a]"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                        {activity.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{activity.user}</p>
                                        <p className="text-[#9a9a9a] text-sm">{activity.action}</p>
                                    </div>
                                    <span className="text-[#6a6a6a] text-xs">{activity.time}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-[#9a9a9a]">
                                No recent users found
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a] animate-slideUp" style={{ animationDelay: '0.5s' }}>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span>⚡</span>
                        Quick Actions
                    </h2>
                    <div className="space-y-3">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                className={`w-full ${action.color} text-white px-4 py-3 rounded-lg smooth-transition flex items-center gap-3 font-medium shadow-lg`}
                            >
                                <span className="text-xl">{action.icon}</span>
                                {action.title}
                            </button>
                        ))}
                    </div>

                    {/* Mini Chart Visualization */}
                    <div className="mt-6 p-4 bg-[#0a0a0a]/50 rounded-lg border border-[#3a3a3a]">
                        <h3 className="text-sm font-medium text-[#9a9a9a] mb-3">Weekly Overview</h3>
                        <div className="flex items-end justify-between gap-2 h-24">
                            {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end">
                                    <div
                                        className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t animate-pulse-slow"
                                        style={{
                                            height: `${height}%`,
                                            animationDelay: `${i * 0.2}s`
                                        }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-[#6a6a6a]">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
