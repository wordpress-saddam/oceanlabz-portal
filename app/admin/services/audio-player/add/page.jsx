"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { audioTrackApi, audioCategoryApi } from "@/lib/api";
import { cookieUtils } from "@/lib/api";

export default function AddAudioPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        category_id: "",
        duration: "",
        audioFile: null,
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            const token = cookieUtils.get('token');
            if (!token) {
                setError("Authentication required. Please login.");
                return;
            }

            try {
                const response = await audioCategoryApi.getAll(token);
                if (response.success && response.data.categories) {
                    setCategories(response.data.categories);
                    // Set first category as default
                    if (response.data.categories.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            category_id: response.data.categories[0].id.toString()
                        }));
                    }
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to load categories");
            }
        };

        fetchCategories();
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
        if (!formData.title.trim()) {
            setError("Audio title is required");
            setLoading(false);
            return;
        }

        if (!formData.artist.trim()) {
            setError("Artist name is required");
            setLoading(false);
            return;
        }

        if (!formData.category_id) {
            setError("Category is required");
            setLoading(false);
            return;
        }

        if (!formData.audioFile) {
            setError("Audio file is required");
            setLoading(false);
            return;
        }

        try {
            // Create FormData for file upload
            const uploadData = new FormData();
            uploadData.append('title', formData.title);
            uploadData.append('artist', formData.artist);
            uploadData.append('category_id', formData.category_id);
            if (formData.duration) {
                uploadData.append('duration', formData.duration);
            }
            uploadData.append('audio_file', formData.audioFile);

            const response = await audioTrackApi.create(uploadData, token);
            
            if (response.success) {
                setSuccess("Audio added successfully!");
                // Redirect after 1.5 seconds
                setTimeout(() => {
                    router.push("/admin/services/audio-player");
                }, 1500);
            }
        } catch (err) {
            console.error("Error adding audio:", err);
            setError(err.message || "Failed to add audio track");
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            audioFile: file
        }));
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                        <span className="text-4xl">🎵</span>
                        Add New Audio
                    </h1>
                    <p className="text-[#9a9a9a] text-sm">Upload a new audio track to your library</p>
                </div>
                <Link
                    href="/admin/services/audio-player"
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition text-sm"
                >
                    ← Back to Audio Library
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

                    {/* Audio Title */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Track Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Summer Vibes"
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 smooth-transition"
                        />
                    </div>

                    {/* Artist Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Artist Name *
                        </label>
                        <input
                            type="text"
                            name="artist"
                            value={formData.artist}
                            onChange={handleChange}
                            placeholder="e.g., Ocean Sounds"
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 smooth-transition"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Category *
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 smooth-transition"
                        >
                            {categories.length === 0 ? (
                                <option value="">Loading categories...</option>
                            ) : (
                                categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon || '🎵'} {cat.name}
                                    </option>
                                ))
                            )}
                        </select>
                        <p className="text-[#6a6a6a] text-xs mt-1">
                            Don't see your category? <Link href="/admin/settings/audio-categories" className="text-blue-400 hover:text-blue-300">Add new category</Link>
                        </p>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Duration (Optional)
                        </label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="e.g., 3:45"
                            className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 smooth-transition"
                        />
                        <p className="text-[#6a6a6a] text-xs mt-1">Format: MM:SS (e.g., 3:45). Leave empty to auto-detect.</p>
                    </div>

                    {/* Audio File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                            Audio File *
                        </label>
                        <div className="border-2 border-dashed border-[#3a3a3a] rounded-lg p-8 text-center hover:border-blue-500 smooth-transition">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="audioFile"
                            />
                            <label htmlFor="audioFile" className="cursor-pointer">
                                <div className="text-4xl mb-2">🎵</div>
                                {formData.audioFile ? (
                                    <p className="text-white font-medium">{formData.audioFile.name}</p>
                                ) : (
                                    <>
                                        <p className="text-white font-medium mb-1">Click to upload audio file</p>
                                        <p className="text-[#6a6a6a] text-sm">MP3, WAV, OGG, or FLAC</p>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Adding..." : "Add Audio Track"}
                        </button>
                        <Link
                            href="/admin/services/audio-player"
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
