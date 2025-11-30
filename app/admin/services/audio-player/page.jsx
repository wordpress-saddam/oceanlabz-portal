"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { audioTrackApi, audioCategoryApi } from "@/lib/api";
import { cookieUtils } from "@/lib/api";

export default function AudioPlayerPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [openDropdown, setOpenDropdown] = useState(null);
    const [userRole, setUserRole] = useState("subscriber");
    const [tracks, setTracks] = useState([]);
    const [categories, setCategories] = useState([]);
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

        // Fetch data from API
        const fetchData = async () => {
            if (!token) {
                setError("Authentication required. Please login.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                // Fetch tracks and categories in parallel
                const [tracksResponse, categoriesResponse] = await Promise.all([
                    audioTrackApi.getAll(token),
                    audioCategoryApi.getAll(token)
                ]);

                if (tracksResponse.success && tracksResponse.data.tracks) {
                    setTracks(tracksResponse.data.tracks);
                    // Expand first category if available
                    if (tracksResponse.data.tracks.length > 0) {
                        const firstCategoryId = tracksResponse.data.tracks[0].category_id;
                        if (firstCategoryId) {
                            setExpandedCategories(new Set([firstCategoryId.toString()]));
                        }
                    }
                }

                if (categoriesResponse.success && categoriesResponse.data.categories) {
                    setCategories(categoriesResponse.data.categories);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Failed to load audio data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get category by ID
    const getCategoryById = (categoryId) => {
        return categories.find(cat => cat.id === categoryId);
    };

    // Filter tracks based on search and category
    const getFilteredTracks = () => {
        let filtered = selectedCategory === "all"
            ? tracks
            : tracks.filter(t => t.category_id === parseInt(selectedCategory));

        if (searchQuery) {
            filtered = filtered.filter(t =>
                (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (t.artist && t.artist.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return filtered;
    };

    const filteredTracks = getFilteredTracks();

    // Group tracks by category for "all" view
    const groupedTracks = categories.map(cat => ({
        ...cat,
        tracks: filteredTracks.filter(t => t.category_id === cat.id)
    })).filter(cat => cat.tracks.length > 0);

    const toggleCategory = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        const categoryIdStr = categoryId.toString();
        if (newExpanded.has(categoryIdStr)) {
            newExpanded.delete(categoryIdStr);
        } else {
            newExpanded.add(categoryIdStr);
        }
        setExpandedCategories(newExpanded);
    };

    const getTotalTracksCount = () => tracks.length;

    const handleAction = async (action, track) => {
        setOpenDropdown(null);
        const token = cookieUtils.get('token');

        if (action === 'Edit') {
            // Navigate to edit page
            router.push(`/admin/services/audio-player/edit/${track.id}`);
        } else if (action === 'Remove') {
            if (confirm(`Are you sure you want to remove "${track.title}"?`)) {
                try {
                    await audioTrackApi.delete(track.id, token);
                    // Remove from local state
                    setTracks(tracks.filter(t => t.id !== track.id));
                    alert(`Removed: ${track.title}`);
                } catch (err) {
                    alert(`Error: ${err.message}`);
                }
            }
        } else {
            // Add your action logic here
            console.log(`${action} - ${track.title}`);
        }
    };

    const toggleDropdown = (trackId) => {
        setOpenDropdown(openDropdown === trackId ? null : trackId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-white text-lg">Loading audio library...</div>
            </div>
        );
    }

    if (error && tracks.length === 0) {
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
                        <span className="text-4xl">🎵</span>
                        Audio Library
                    </h1>
                    <p className="text-[#9a9a9a] text-sm">{getTotalTracksCount()} tracks across {categories.length} categories</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/services/audio-player/add"
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg smooth-transition text-sm font-medium"
                    >
                        + Add Audio
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
                                placeholder="Search tracks or artists..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg pl-12 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 smooth-transition"
                            />
                        </div>
                    </div>

                    {/* Category Dropdown */}
                    <div className="lg:w-64">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 smooth-transition appearance-none cursor-pointer"
                        >
                            <option value="all">📂 All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon || '🎵'} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Total Tracks</p>
                    <p className="text-2xl font-bold text-white">{getTotalTracksCount().toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Categories</p>
                    <p className="text-2xl font-bold text-blue-400">{categories.length}</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Filtered Results</p>
                    <p className="text-2xl font-bold text-green-400">{filteredTracks.length}</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-xs mb-1">Selected</p>
                    <p className="text-2xl font-bold text-purple-400">
                        {selectedCategory === "all" ? "All" : getCategoryById(parseInt(selectedCategory))?.name || "Unknown"}
                    </p>
                </div>
            </div>

            {/* Audio List */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#3a3a3a] text-xs font-semibold text-[#9a9a9a] uppercase">
                    <div className="col-span-1">#</div>
                    <div className="col-span-4">Track</div>
                    <div className="col-span-3">Artist</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1">Duration</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Track List */}
                <div className="max-h-[600px] overflow-y-auto">
                    {selectedCategory === "all" ? (
                        // Grouped by category view
                        groupedTracks.map((category) => (
                            <div key={category.id} className="border-b border-[#3a3a3a] last:border-b-0">
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(category.id.toString())}
                                    className="w-full px-6 py-3 flex items-center justify-between hover:bg-[#2a2a2a] smooth-transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{category.icon || '🎵'}</span>
                                        <span className="text-white font-semibold">{category.name}</span>
                                        <span className="text-xs text-[#6a6a6a] bg-[#2a2a2a] px-2 py-1 rounded">
                                            {category.tracks.length} tracks
                                        </span>
                                    </div>
                                    <span className={`text-[#9a9a9a] smooth-transition ${expandedCategories.has(category.id.toString()) ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                {/* Category Tracks */}
                                {expandedCategories.has(category.id.toString()) && (
                                    <div className="bg-[#0a0a0a]/30">
                                        {category.tracks.slice(0, 20).map((track, index) => (
                                            <div
                                                key={track.id}
                                                className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-[#2a2a2a] smooth-transition border-t border-[#2a2a2a] text-sm relative"
                                            >
                                                <div className="col-span-1 text-[#6a6a6a]">{index + 1}</div>
                                                <div className="col-span-4 text-white font-medium truncate">{track.title}</div>
                                                <div className="col-span-3 text-[#9a9a9a] truncate">{track.artist}</div>
                                                <div className="col-span-2">
                                                    <span className="text-xs text-blue-400">{category.icon || '🎵'} {category.name}</span>
                                                </div>
                                                <div className="col-span-1 text-[#9a9a9a]">{track.duration || '0:00'}</div>
                                                <div className="col-span-1 text-right relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDropdown(track.id);
                                                        }}
                                                        className="text-white hover:text-blue-400 smooth-transition text-lg font-bold"
                                                    >
                                                        ⋮
                                                    </button>

                                                    {openDropdown === track.id && (
                                                        <div className="absolute right-0 top-8 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg shadow-xl z-50 min-w-[160px]">
                                                            {userRole === "admin" ? (
                                                                <>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAction('Play', track); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] flex items-center gap-2">
                                                                        <span>▶️</span> Play
                                                                    </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAction('Edit', track); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] flex items-center gap-2">
                                                                        <span>✏️</span> Edit
                                                                    </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAction('Active', track); }} className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                                        <span>✅</span> Active
                                                                    </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAction('Inactive', track); }} className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                                        <span>⏸️</span> Inactive
                                                                    </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAction('Install', track); }} className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                                        <span>📥</span> Install
                                                                    </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAction('Uninstall', track); }} className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                                        <span>📤</span> Uninstall
                                                                    </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAction('Remove', track); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2a2a2a] flex items-center gap-2 border-t border-[#3a3a3a]">
                                                                        <span>🗑️</span> Remove
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAction('Play', track); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] flex items-center gap-2">
                                                                        <span>▶️</span> Play
                                                                    </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAction('Install', track); }} className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                                        <span>📥</span> Install
                                                                    </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleAction('Uninstall', track); }} className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                                        <span>📤</span> Uninstall
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {category.tracks.length > 20 && (
                                            <div className="px-6 py-3 text-center text-sm text-[#6a6a6a]">
                                                + {category.tracks.length - 20} more tracks...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        // Single category view - show all tracks
                        filteredTracks.length > 0 ? (
                            filteredTracks.map((track, index) => (
                                <div
                                    key={track.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-[#2a2a2a] smooth-transition border-b border-[#2a2a2a] last:border-b-0 text-sm relative"
                                >
                                    <div className="col-span-1 text-[#6a6a6a]">{index + 1}</div>
                                    <div className="col-span-4 text-white font-medium truncate">{track.title}</div>
                                    <div className="col-span-3 text-[#9a9a9a] truncate">{track.artist}</div>
                                    <div className="col-span-2">
                                        <span className="text-xs text-blue-400">
                                            {getCategoryById(track.category_id)?.icon || '🎵'} {getCategoryById(track.category_id)?.name || 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="col-span-1 text-[#9a9a9a]">{track.duration || '0:00'}</div>
                                    <div className="col-span-1 text-right relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(track.id);
                                            }}
                                            className="text-white hover:text-blue-400 smooth-transition text-lg font-bold"
                                        >
                                            ⋮
                                        </button>

                                        {openDropdown === track.id && (
                                            <div className="absolute right-0 top-8 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg shadow-xl z-50 min-w-[160px]">
                                                {userRole === "admin" ? (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAction('Play', track); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] flex items-center gap-2">
                                                            <span>▶️</span> Play
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAction('Edit', track); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] flex items-center gap-2">
                                                            <span>✏️</span> Edit
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAction('Active', track); }} className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                            <span>✅</span> Active
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAction('Inactive', track); }} className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                            <span>⏸️</span> Inactive
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAction('Install', track); }} className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                            <span>📥</span> Install
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAction('Uninstall', track); }} className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                            <span>📤</span> Uninstall
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAction('Remove', track); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2a2a2a] flex items-center gap-2 border-t border-[#3a3a3a]">
                                                            <span>🗑️</span> Remove
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAction('Play', track); }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2a2a2a] flex items-center gap-2">
                                                            <span>▶️</span> Play
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAction('Install', track); }} className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                            <span>📥</span> Install
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleAction('Uninstall', track); }} className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-[#2a2a2a] flex items-center gap-2">
                                                            <span>📤</span> Uninstall
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center text-[#6a6a6a]">
                                No tracks found matching your search.
                            </div>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-[#3a3a3a] text-xs text-[#6a6a6a] text-center">
                    Showing {filteredTracks.length} of {getTotalTracksCount().toLocaleString()} total tracks
                </div>
            </div>
        </div>
    );
}
