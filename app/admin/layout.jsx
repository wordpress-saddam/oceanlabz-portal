"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import UserProfileModal from "@/components/UserProfileModal";
import { authApi, cookieUtils } from "@/lib/api";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [servicesExpanded, setServicesExpanded] = useState(
        pathname.startsWith("/admin/services")
    );
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Get user ID from cookie and fetch user data
        const fetchCurrentUser = async () => {
            const token = cookieUtils.get('token');
            if (token) {
                try {
                    const response = await authApi.getUser(token);
                    if (response.success) {
                        setCurrentUser(response.data.user);
                    }
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                }
            }
        };
        fetchCurrentUser();
    }, []);

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: "📊" },
        { name: "Users", href: "/admin/users", icon: "👥" },
        {
            name: "Services",
            href: "/admin/services",
            icon: "⚙️",
            hasSubmenu: true,
            submenu: [
                { name: "Audio Player", href: "/admin/services/audio-player", icon: "🎵" },
                { name: "Location Tracker", href: "/admin/services/location-tracker", icon: "📍" }
            ]
        },
        { name: "Analytics", href: "/admin/analytics", icon: "📈" },
        { name: "Settings", href: "/admin/settings", icon: "🔧" },
    ];

    const handleLogout = async () => {
        try {
            const token = cookieUtils.get('token');
            if (token) {
                await authApi.logout(token);
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            // Clear all authentication cookies
            cookieUtils.clearAuth();
            // Redirect to login page
            router.push("/login");
        }
    };

    const toggleServices = (e) => {
        e.preventDefault();
        setServicesExpanded(!servicesExpanded);
    };

    const handleProfileUpdate = (updatedUser) => {
        setCurrentUser(updatedUser);
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0a]">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-r border-[#3a3a3a] flex flex-col animate-fadeIn">
                {/* Logo/Brand */}
                <div className="p-6 border-b border-[#3a3a3a]">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        OceanLabz
                    </h1>
                    <p className="text-xs text-[#9a9a9a] mt-1">Admin Portal</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        const isServiceActive = pathname.startsWith("/admin/services");

                        return (
                            <div key={item.href}>
                                {item.hasSubmenu ? (
                                    <>
                                        {/* Services Menu with Submenu */}
                                        <button
                                            onClick={toggleServices}
                                            className={`
                                                w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg smooth-transition
                                                ${isServiceActive && pathname === item.href
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                                                    : 'text-[#9a9a9a] hover:bg-[#2a2a2a] hover:text-white'
                                                }
                                            `}
                                            style={{
                                                animationDelay: `${index * 0.1}s`,
                                                animation: 'slideUp 0.5s ease-out backwards'
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <span className={`smooth-transition ${servicesExpanded ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        </button>

                                        {/* Submenu */}
                                        {servicesExpanded && (
                                            <div className="ml-4 mt-2 space-y-1 animate-slideUp">
                                                <Link
                                                    href={item.href}
                                                    className={`
                                                        flex items-center gap-3 px-4 py-2 rounded-lg smooth-transition text-sm
                                                        ${pathname === item.href
                                                            ? 'bg-[#2a2a2a] text-white'
                                                            : 'text-[#9a9a9a] hover:bg-[#2a2a2a] hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    <span>📋</span>
                                                    <span>All Services</span>
                                                </Link>
                                                {item.submenu.map((subItem) => {
                                                    const isSubActive = pathname === subItem.href;
                                                    return (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            className={`
                                                                flex items-center gap-3 px-4 py-2 rounded-lg smooth-transition text-sm
                                                                ${isSubActive
                                                                    ? 'bg-gradient-to-r from-blue-600/50 to-purple-600/50 text-white border-l-2 border-blue-500'
                                                                    : 'text-[#9a9a9a] hover:bg-[#2a2a2a] hover:text-white'
                                                                }
                                                            `}
                                                        >
                                                            <span>{subItem.icon}</span>
                                                            <span>{subItem.name}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-lg smooth-transition
                                            ${isActive
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                                                : 'text-[#9a9a9a] hover:bg-[#2a2a2a] hover:text-white'
                                            }
                                        `}
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                            animation: 'slideUp 0.5s ease-out backwards'
                                        }}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-[#3a3a3a] space-y-2">
                    <button
                        onClick={() => setShowProfileModal(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] smooth-transition"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">
                                {currentUser ? currentUser.name : 'Loading...'}
                            </p>
                            <p className="text-xs text-[#9a9a9a] truncate">
                                {currentUser ? currentUser.email : '...'}
                            </p>
                        </div>
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white smooth-transition font-medium hover:shadow-lg hover:shadow-red-500/20"
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>

            {/* User Profile Modal */}
            {currentUser && (
                <UserProfileModal
                    isOpen={showProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    userId={currentUser.id}
                    onUpdate={handleProfileUpdate}
                />
            )}
        </div>
    );
}