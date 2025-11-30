"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DeviceDetailPage() {
    const params = useParams();
    const deviceId = params.id;
    const [trackingEnabled, setTrackingEnabled] = useState(false);

    // Mock device data (in real app, fetch from API)
    const device = {
        id: deviceId,
        name: `Device ${deviceId}`,
        username: "John Doe",
        type: "Smartphone",
        status: "Active",
        battery: 85,
        activationDate: "2024-01-15",
        location: { lat: 40.7128, lng: -74.0060, address: "New York, NY" },
        lastUpdate: "2 mins ago",
        history: [
            { time: "10:30 AM", location: "New York, NY", lat: 40.7128, lng: -74.0060 },
            { time: "09:15 AM", location: "Brooklyn, NY", lat: 40.6782, lng: -73.9442 },
            { time: "08:00 AM", location: "Queens, NY", lat: 40.7282, lng: -73.7949 },
        ]
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                        <span className="text-4xl">📍</span>
                        {device.name}
                    </h1>
                    <p className="text-[#9a9a9a] text-sm">Real-time location tracking and device details</p>
                </div>
                <Link
                    href="/admin/services/location-tracker"
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition text-sm"
                >
                    ← Back to Devices
                </Link>
            </div>

            {/* Device Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Device Type</p>
                    <p className="text-xl font-bold text-white">{device.type}</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Status</p>
                    <p className={`text-xl font-bold ${device.status === 'Active' ? 'text-green-400' : 'text-gray-400'}`}>
                        {device.status}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Battery</p>
                    <p className="text-xl font-bold text-yellow-400">{device.battery}%</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Last Update</p>
                    <p className="text-xl font-bold text-blue-400">{device.lastUpdate}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map View */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>🗺️</span>
                            Live Location Map
                        </h3>
                        <button
                            onClick={() => setTrackingEnabled(!trackingEnabled)}
                            className={`px-4 py-2 rounded-lg font-medium smooth-transition ${trackingEnabled
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white'
                                }`}
                        >
                            {trackingEnabled ? '✓ Tracking' : 'Start Tracking'}
                        </button>
                    </div>

                    {/* Mock Map */}
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-[#3a3a3a] flex items-center justify-center relative overflow-hidden">
                        {/* Map Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                                {[...Array(48)].map((_, i) => (
                                    <div key={i} className="border border-green-500/30"></div>
                                ))}
                            </div>
                        </div>

                        {/* Location Marker */}
                        <div className="relative z-10 text-center">
                            <div className="text-6xl mb-4 animate-bounce">📍</div>
                            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-green-500/30">
                                <p className="text-white font-medium">{device.location.address}</p>
                                <p className="text-[#9a9a9a] text-sm">
                                    {device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)}
                                </p>
                            </div>
                        </div>

                        {/* Tracking Pulse */}
                        {trackingEnabled && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-green-500/20 animate-ping"></div>
                            </div>
                        )}
                    </div>

                    {/* Location Coordinates */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-4 border border-[#3a3a3a]">
                            <p className="text-[#9a9a9a] text-sm mb-1">Latitude</p>
                            <p className="text-white font-mono">{device.location.lat.toFixed(6)}</p>
                        </div>
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-4 border border-[#3a3a3a]">
                            <p className="text-[#9a9a9a] text-sm mb-1">Longitude</p>
                            <p className="text-white font-mono">{device.location.lng.toFixed(6)}</p>
                        </div>
                    </div>
                </div>

                {/* Device Details & History */}
                <div className="space-y-6">
                    {/* Device Details */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a]">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>📱</span>
                            Device Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-[#9a9a9a] text-sm">Device Name</span>
                                <span className="text-white text-sm font-medium">{device.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#9a9a9a] text-sm">Username</span>
                                <span className="text-white text-sm font-medium">{device.username}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#9a9a9a] text-sm">Type</span>
                                <span className="text-white text-sm font-medium">{device.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#9a9a9a] text-sm">Activation Date</span>
                                <span className="text-white text-sm font-medium">{device.activationDate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#9a9a9a] text-sm">Battery Level</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${device.battery > 60 ? 'bg-green-500' :
                                                    device.battery > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${device.battery}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-white text-sm font-medium">{device.battery}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location History */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a]">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>🕐</span>
                            Location History
                        </h3>
                        <div className="space-y-3">
                            {device.history.map((entry, index) => (
                                <div key={index} className="flex items-start gap-3 pb-3 border-b border-[#3a3a3a] last:border-b-0">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-medium">{entry.location}</p>
                                        <p className="text-[#6a6a6a] text-xs">{entry.time}</p>
                                        <p className="text-[#6a6a6a] text-xs font-mono">
                                            {entry.lat.toFixed(4)}, {entry.lng.toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
