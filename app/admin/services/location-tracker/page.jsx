"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { locationDeviceApi } from "@/lib/api";
import { cookieUtils } from "@/lib/api";

export default function LocationTrackerPage() {
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [userRole, setUserRole] = useState("subscriber");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Get user role and token from cookie
        const cookies = document.cookie.split(';');
        const roleCookie = cookies.find(c => c.trim().startsWith('role='));
        const token = cookieUtils.get('token');
        
        if (roleCookie) {
            const role = roleCookie.split('=')[1];
            setUserRole(role);
        }

        // Fetch devices from API
        const fetchDevices = async () => {
            if (!token) {
                setError("Authentication required. Please login.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await locationDeviceApi.getAll(token);
                if (response.success && response.data.devices) {
                    setDevices(response.data.devices);
                }
            } catch (err) {
                console.error("Error fetching devices:", err);
                setError(err.message || "Failed to load devices");
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, []);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Format last update time
    const formatLastUpdate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
    };

    // Filter devices
    const getFilteredDevices = () => {
        let filtered = devices;

        if (statusFilter !== "all") {
            filtered = filtered.filter(d => d.status.toLowerCase() === statusFilter.toLowerCase());
        }

        if (searchQuery) {
            filtered = filtered.filter(d => {
                const userName = d.user ? d.user.name : '';
                const userEmail = d.user ? d.user.email : '';
                const location = d.address || '';
                return (
                    (d.name && d.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (userName && userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (userEmail && userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (location && location.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            });
        }

        return filtered;
    };

    const filteredDevices = getFilteredDevices();

    const handleAction = async (action, device) => {
        setOpenDropdown(null);
        const token = cookieUtils.get('token');

        if (action === 'View Map') {
            // Navigate to device detail page
            router.push(`/admin/services/location-tracker/${device.id}`);
        } else if (action === 'Edit') {
            // Navigate to edit page
            router.push(`/admin/services/location-tracker/edit/${device.id}`);
        } else if (action === 'Activate' || action === 'Deactivate') {
            try {
                await locationDeviceApi.toggleStatus(device.id, token);
                // Refresh devices
                const response = await locationDeviceApi.getAll(token);
                if (response.success && response.data.devices) {
                    setDevices(response.data.devices);
                }
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        } else if (action === 'Delete') {
            if (confirm(`Are you sure you want to delete "${device.name}"?`)) {
                try {
                    await locationDeviceApi.delete(device.id, token);
                    // Remove from local state
                    setDevices(devices.filter(d => d.id !== device.id));
                } catch (err) {
                    alert(`Error: ${err.message}`);
                }
            }
        } else {
            console.log(`${action} - ${device.name}`);
        }
    };

    const toggleDropdown = (deviceId) => {
        setOpenDropdown(openDropdown === deviceId ? null : deviceId);
    };

    const getActiveCount = () => devices.filter(d => d.status === 'Active').length;
    const getInactiveCount = () => devices.filter(d => d.status === 'Inactive').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-white text-lg">Loading devices...</div>
            </div>
        );
    }

    if (error && devices.length === 0) {
        return (
            <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400">⚠️ {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fadeIn" onClick={() => setOpenDropdown(null)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                        <span className="text-4xl">📍</span>
                        Location Tracker
                    </h1>
                    <p className="text-[#9a9a9a] text-sm">{devices.length} devices registered</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/services/location-tracker/add"
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg smooth-transition text-sm font-medium"
                    >
                        + Add Device
                    </Link>
                    <Link
                        href="/admin/services"
                        className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition text-sm"
                    >
                        ← Back to Services
                    </Link>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-4 border border-[#3a3a3a]">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                            <input
                                type="text"
                                placeholder="Search devices, users, or locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg pl-12 pr-4 py-2.5 text-white focus:outline-none focus:border-green-500 smooth-transition"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="lg:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500 smooth-transition appearance-none cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Total Devices</p>
                    <p className="text-2xl font-bold text-white">{devices.length}</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Active</p>
                    <p className="text-2xl font-bold text-green-400">{getActiveCount()}</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Inactive</p>
                    <p className="text-2xl font-bold text-gray-400">{getInactiveCount()}</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Filtered Results</p>
                    <p className="text-2xl font-bold text-blue-400">{filteredDevices.length}</p>
                </div>
            </div>

            {/* Devices Table */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#3a3a3a] text-xs font-semibold text-[#9a9a9a] uppercase">
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">Device Name</div>
                    <div className="col-span-2">Username</div>
                    <div className="col-span-2">Activation Date</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Table Body */}
                <div className="max-h-[600px] overflow-y-auto">
                    {filteredDevices.length > 0 ? (
                        filteredDevices.map((device, index) => (
                            <div
                                key={device.id}
                                className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-[#2a2a2a] smooth-transition border-b border-[#2a2a2a] last:border-b-0 text-sm relative"
                            >
                                <div className="col-span-1 text-[#6a6a6a]">{index + 1}</div>
                                <div className="col-span-3">
                                    <p className="text-white font-medium truncate">{device.name}</p>
                                    <p className="text-[#6a6a6a] text-xs">{device.type}</p>
                                </div>
                                <div className="col-span-2 text-[#9a9a9a] truncate">
                                    {device.user ? `${device.user.name}` : 'Unassigned'}
                                </div>
                                <div className="col-span-2 text-[#9a9a9a]">{formatDate(device.created_at)}</div>
                                <div className="col-span-2">
                                    <p className="text-[#9a9a9a] text-xs truncate">📍 {device.address || 'No location'}</p>
                                    <p className="text-[#6a6a6a] text-xs">{formatLastUpdate(device.last_update)}</p>
                                </div>
                                <div className="col-span-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${device.status === 'Active'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {device.status}
                                    </span>
                                </div>
                                <div className="col-span-1 text-right relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown(device.id);
                                        }}
                                        className="text-white hover:text-green-400 smooth-transition text-lg font-bold"
                                    >
                                        ⋮
                                    </button>

                                    {openDropdown === device.id && (
                                        <div className="absolute right-0 top-8 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg shadow-xl z-50 min-w-[180px]">
                                            <button onClick={(e) => { e.stopPropagation(); handleAction('View Map', device); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] flex items-center gap-2">
                                                <span>🗺️</span> View Map
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleAction('Real-Time Track', device); }} className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                <span>📡</span> Real-Time Track
                                            </button>
                                            {device.status === 'Active' ? (
                                                <button onClick={(e) => { e.stopPropagation(); handleAction('Deactivate', device); }} className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                    <span>⏸️</span> Deactivate
                                                </button>
                                            ) : (
                                                <button onClick={(e) => { e.stopPropagation(); handleAction('Activate', device); }} className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                    <span>✅</span> Activate
                                                </button>
                                            )}
                                            <button onClick={(e) => { e.stopPropagation(); handleAction('Edit', device); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] flex items-center gap-2">
                                                <span>✏️</span> Edit
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleAction('Delete', device); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2a2a2a] flex items-center gap-2 border-t border-[#3a3a3a]">
                                                <span>🗑️</span> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-12 text-center text-[#6a6a6a]">
                            No devices found matching your search.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-[#3a3a3a] text-xs text-[#6a6a6a] text-center">
                    Showing {filteredDevices.length} of {devices.length} total devices
                </div>
            </div>
        </div>
    );
}
