"use client";

import Link from "next/link";

export default function ServicesPage() {
    const services = [
        {
            id: "audio-player",
            name: "Audio Player",
            icon: "🎵",
            description: "Play and manage your audio files with our advanced audio player",
            color: "from-blue-500 to-purple-500",
            status: "Active",
            users: 1234
        },
        {
            id: "location-tracker",
            name: "Location Tracker",
            icon: "📍",
            description: "Track and monitor locations in real-time with GPS integration",
            color: "from-green-500 to-teal-500",
            status: "Active",
            users: 856
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Services</h1>
                <p className="text-[#9a9a9a]">Manage and access all available services</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-sm">Total Services</p>
                    <p className="text-2xl font-bold text-white mt-1">{services.length}</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-sm">Active Services</p>
                    <p className="text-2xl font-bold text-green-400 mt-1">{services.filter(s => s.status === 'Active').length}</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">{services.reduce((acc, s) => acc + s.users, 0)}</p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                    <div
                        key={service.id}
                        className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a] hover:border-[#4a4a4a] smooth-transition hover:scale-105 cursor-pointer animate-slideUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Service Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl shadow-lg`}>
                                {service.icon}
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                {service.status}
                            </span>
                        </div>

                        {/* Service Info */}
                        <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                        <p className="text-[#9a9a9a] text-sm mb-4">{service.description}</p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#3a3a3a]">
                            <div>
                                <p className="text-[#6a6a6a] text-xs">Active Users</p>
                                <p className="text-white font-bold">{service.users.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Link
                                href={`/admin/services/${service.id}`}
                                className={`flex-1 bg-gradient-to-r ${service.color} text-white py-3 rounded-lg font-medium hover:shadow-lg smooth-transition text-center`}
                            >
                                Open Service
                            </Link>
                            <button className="px-4 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition">
                                ⚙️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
